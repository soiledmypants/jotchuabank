// =============================================================
//  AIRDROP ENGINE — server-side only
//
//  Full pipeline (all steps optional, ordered):
//  1. claimPumpFunCreatorFees()  — sweeps SOL from pump.fun vault
//  2. swapSolForRewardToken()    — Jupiter: SOL → reward token
//  3. getAirdropSnapshot()       — who qualifies, how much each gets
//  4. executeAirdrop()           — send reward token to all holders
//
//  Requires env vars:
//    AIRDROP_WALLET_PRIVATE_KEY  — base58 private key of the fee wallet
//    NEXT_PUBLIC_RPC_URL         — Helius or other Solana RPC endpoint
//    NEXT_PUBLIC_MAIN_TOKEN_MINT — $JOTCHUABANK mint
//    NEXT_PUBLIC_REWARD_TOKEN_MINT — the token being airdropped
// =============================================================

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58";
import { AIRDROP } from "./config";
import { getTokenHolders, getSplTokenBalance, type TokenHolder } from "./solana";

export interface AirdropSnapshot {
  eligibleHolders: number;
  totalHolders: number;
  rewardBalance: string;       // formatted (with decimals applied)
  rewardBalanceRaw: string;    // atomic units as string (BigInt-safe)
  amountPerHolder: string;     // formatted
  amountPerHolderRaw: string;  // atomic units as string
  rewardToken: string;         // symbol
  minBalance: number;
  holders: { address: string; shortAddress: string; balance: number }[];
}

export interface AirdropResult {
  success: boolean;
  signatures: string[];
  holdersRewarded: number;
  totalDistributed: string;
  amountPerHolder: string;
  error?: string;
}

// ---- Snapshot -----------------------------------------------
// Read the current state: who qualifies, how much reward is available.
export async function getAirdropSnapshot(): Promise<AirdropSnapshot> {
  const rpcUrl = AIRDROP.rpcUrl;

  const [allHolders, rewardBalanceRaw, mintInfo] = await Promise.all([
    getTokenHolders(AIRDROP.mainTokenMint, rpcUrl, 0),
    getSplTokenBalance(AIRDROP.feeWallet, AIRDROP.rewardTokenMint, rpcUrl),
    fetchMintDecimals(AIRDROP.rewardTokenMint, rpcUrl),
  ]);

  const eligible = allHolders.filter(
    (h) => h.balance >= AIRDROP.minHolderBalance
  );

  const divisor = eligible.length > 0 ? BigInt(eligible.length) : BigInt(1);
  const perHolder = rewardBalanceRaw / divisor;
  const decimalFactor = Math.pow(10, mintInfo.decimals);

  return {
    eligibleHolders: eligible.length,
    totalHolders: allHolders.length,
    rewardBalance: (Number(rewardBalanceRaw) / decimalFactor).toLocaleString(),
    rewardBalanceRaw: rewardBalanceRaw.toString(),
    amountPerHolder: (Number(perHolder) / decimalFactor).toLocaleString(),
    amountPerHolderRaw: perHolder.toString(),
    rewardToken: AIRDROP.rewardTokenSymbol,
    minBalance: AIRDROP.minHolderBalance,
    holders: eligible.map((h) => ({
      address: h.owner,
      shortAddress: `${h.owner.slice(0, 6)}…${h.owner.slice(-4)}`,
      balance: h.balance,
    })),
  };
}

// ---- Execute ------------------------------------------------
// Signs and sends SPL transfers to all eligible holders.
// Batches 10 holders per transaction to stay within compute limits.
export async function executeAirdrop(
  privateKeyBase58: string
): Promise<AirdropResult> {
  const connection = new Connection(AIRDROP.rpcUrl, "confirmed");
  const payer = Keypair.fromSecretKey(bs58.decode(privateKeyBase58));
  const rewardMint = new PublicKey(AIRDROP.rewardTokenMint);

  const [allHolders, rewardBalanceRaw, mintInfo] = await Promise.all([
    getTokenHolders(AIRDROP.mainTokenMint, AIRDROP.rpcUrl, AIRDROP.minHolderBalance),
    getSplTokenBalance(AIRDROP.feeWallet, AIRDROP.rewardTokenMint, AIRDROP.rpcUrl),
    getMint(connection, rewardMint),
  ]);

  if (allHolders.length === 0) {
    return {
      success: false,
      signatures: [],
      holdersRewarded: 0,
      totalDistributed: "0",
      amountPerHolder: "0",
      error: "No eligible holders found.",
    };
  }

  if (rewardBalanceRaw === BigInt(0)) {
    return {
      success: false,
      signatures: [],
      holdersRewarded: 0,
      totalDistributed: "0",
      amountPerHolder: "0",
      error: "Fee wallet has no reward tokens to distribute.",
    };
  }

  const amountPerHolder = rewardBalanceRaw / BigInt(allHolders.length);
  const decimalFactor = Math.pow(10, mintInfo.decimals);

  // Get source ATA (fee wallet's token account for reward token)
  const sourceATA = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    rewardMint,
    payer.publicKey
  );

  const signatures: string[] = [];
  const BATCH_SIZE = 10;

  for (let i = 0; i < allHolders.length; i += BATCH_SIZE) {
    const batch = allHolders.slice(i, i + BATCH_SIZE);
    const tx = new Transaction();

    for (const holder of batch) {
      const holderPubkey = new PublicKey(holder.owner);
      const destATA = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        rewardMint,
        holderPubkey
      );

      tx.add(
        createTransferInstruction(
          sourceATA.address,
          destATA.address,
          payer.publicKey,
          amountPerHolder,
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }

    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
    signatures.push(sig);
  }

  return {
    success: true,
    signatures,
    holdersRewarded: allHolders.length,
    totalDistributed: (Number(rewardBalanceRaw) / decimalFactor).toLocaleString(),
    amountPerHolder: (Number(amountPerHolder) / decimalFactor).toLocaleString(),
  };
}

// ---- Jupiter Swap -------------------------------------------
// Buys reward token using fee wallet's SOL balance via Jupiter.
// Call this before executeAirdrop if you want to auto-convert fees.
export async function swapSolForRewardToken(
  privateKeyBase58: string,
  lamountsToSpend: bigint,
  slippageBps: number = 100
): Promise<string> {
  const SOL_MINT = "So11111111111111111111111111111111111111112";
  const connection = new Connection(AIRDROP.rpcUrl, "confirmed");
  const payer = Keypair.fromSecretKey(bs58.decode(privateKeyBase58));

  // Get quote from Jupiter v6
  const quoteUrl =
    `https://quote-api.jup.ag/v6/quote` +
    `?inputMint=${SOL_MINT}` +
    `&outputMint=${AIRDROP.rewardTokenMint}` +
    `&amount=${lamountsToSpend.toString()}` +
    `&slippageBps=${slippageBps}`;

  const quoteRes = await fetch(quoteUrl);
  if (!quoteRes.ok) throw new Error(`Jupiter quote error: ${quoteRes.status}`);
  const quote = await quoteRes.json();

  // Build swap transaction
  const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: payer.publicKey.toString(),
      wrapAndUnwrapSol: true,
    }),
  });

  if (!swapRes.ok) throw new Error(`Jupiter swap error: ${swapRes.status}`);
  const { swapTransaction } = await swapRes.json();

  // Deserialize versioned transaction, sign, and send
  const { VersionedTransaction } = await import("@solana/web3.js");
  const txBuffer = Buffer.from(swapTransaction, "base64");
  const vtx = VersionedTransaction.deserialize(txBuffer);
  vtx.sign([payer]);

  const sig = await connection.sendRawTransaction(vtx.serialize(), {
    skipPreflight: true,
    maxRetries: 2,
  });

  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

// ---- Internal helpers ---------------------------------------

interface MintInfo { decimals: number }

async function fetchMintDecimals(
  mintAddress: string,
  rpcUrl: string
): Promise<MintInfo> {
  const body = {
    jsonrpc: "2.0",
    id: "get-mint",
    method: "getAccountInfo",
    params: [mintAddress, { encoding: "jsonParsed" }],
  };

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`RPC getAccountInfo error: ${res.status}`);
  const json = await res.json();
  const decimals: number =
    json.result?.value?.data?.parsed?.info?.decimals ?? 6;
  return { decimals };
}

// =============================================================
//  FULL PIPELINE — claim → swap → distribute
//  Call this from the API route with { runFullPipeline: true }.
//
//  Steps:
//    1. Claim SOL from pump.fun creator vault
//    2. Jupiter swap: SOL → reward token (keeps 0.01 SOL for fees)
//    3. Distribute reward token evenly to all eligible holders
// =============================================================

export interface PipelineResult {
  claimSignature: string;
  claimedLamports: string;
  swapSignature: string;
  airdrop: AirdropResult;
}

export async function runFullAirdropPipeline(
  privateKeyBase58: string
): Promise<PipelineResult> {
  const { claimPumpFunCreatorFees } = await import("./pumpfun");
  const connection = new Connection(AIRDROP.rpcUrl, "confirmed");
  const keypair = Keypair.fromSecretKey(bs58.decode(privateKeyBase58));

  // Step 1 — Claim pump.fun creator fees (SOL → wallet)
  const { signature: claimSig, claimedLamports } =
    await claimPumpFunCreatorFees(connection, keypair);

  // Step 2 — Swap claimed SOL to reward token via Jupiter.
  // Reserve 0.01 SOL (10_000_000 lamports) for transaction fees.
  const RESERVE_LAMPORTS = BigInt(10_000_000);
  let swapSig = "";
  if (claimedLamports > RESERVE_LAMPORTS) {
    const lamportsToSwap = claimedLamports - RESERVE_LAMPORTS;
    swapSig = await swapSolForRewardToken(privateKeyBase58, lamportsToSwap);
  }

  // Step 3 — Distribute reward token to eligible holders
  const airdropResult = await executeAirdrop(privateKeyBase58);

  return {
    claimSignature: claimSig,
    claimedLamports: claimedLamports.toString(),
    swapSignature: swapSig,
    airdrop: airdropResult,
  };
}
