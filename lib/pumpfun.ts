// =============================================================
//  PUMP.FUN FEE CLAIM — server-side only
//
//  When you launch a token on pump.fun with a creator fee %,
//  every trade accumulates SOL into a vault PDA tied to your
//  wallet. This module claims that SOL so it can be swapped
//  into the reward token and distributed to holders.
//
//  The full pipeline (called from lib/airdrop.ts) is:
//    claimPumpFunCreatorFees()  ← this file
//       ↓ SOL lands in your wallet
//    swapSolForRewardToken()    ← Jupiter swap in lib/airdrop.ts
//       ↓ reward token lands in your wallet
//    executeAirdrop()           ← distribute to holders
//
//  VERIFY BEFORE FIRST RUN:
//    Find a real creator fee claim transaction on Solscan, look
//    at the pump.fun program instruction, and confirm:
//      a) The vault PDA address matches getCreatorVaultPDA()
//      b) The instruction discriminator matches (first 8 bytes of
//         sha256("global:collect_creator_fee"))
//    If the tx fails with "invalid instruction data", update
//    CLAIM_INSTRUCTION_NAME below to match the real IDL name.
// =============================================================

import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import { createHash } from "crypto";
import { AIRDROP } from "./config";

// Verified pump.fun program ID (mainnet)
export const PUMP_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

// Computes an Anchor-style instruction discriminator:
// sha256("global:<instructionName>")[0..8]
function discriminator(instructionName: string): Buffer {
  return Buffer.from(
    createHash("sha256")
      .update(`global:${instructionName}`)
      .digest()
      .slice(0, 8)
  );
}

// Derives the PDA where pump.fun stores your accumulated creator fees.
// Seeds: ["creator-vault", creatorPublicKey.toBuffer()]
export function getCreatorVaultPDA(creatorPublicKey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("creator-vault"), creatorPublicKey.toBuffer()],
    PUMP_PROGRAM_ID
  );
  return pda;
}

// Returns the lamport balance sitting in your creator vault PDA.
// Zero means no fees have accumulated yet (or already claimed).
export async function getCreatorVaultBalance(
  creatorPublicKey: PublicKey
): Promise<bigint> {
  const vault = getCreatorVaultPDA(creatorPublicKey);

  const res = await fetch(AIRDROP.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "vault-balance",
      method: "getBalance",
      params: [vault.toBase58()],
    }),
  });

  if (!res.ok) throw new Error(`RPC getBalance error: ${res.status}`);
  const json = await res.json();
  return BigInt(json.result?.value ?? 0);
}

// Sends the pump.fun collect_creator_fee instruction, sweeping all
// accumulated SOL from the vault PDA into the creator's wallet.
//
// Returns the tx signature and how many lamports were claimed.
// Returns { signature: "", claimedLamports: 0n } if vault is empty.
export async function claimPumpFunCreatorFees(
  connection: Connection,
  creatorKeypair: Keypair
): Promise<{ signature: string; claimedLamports: bigint }> {
  const vault = getCreatorVaultPDA(creatorKeypair.publicKey);
  const claimedLamports = await getCreatorVaultBalance(creatorKeypair.publicKey);

  if (claimedLamports === BigInt(0)) {
    return { signature: "", claimedLamports: BigInt(0) };
  }

  // Update this name if your pump.fun IDL uses a different instruction name.
  const CLAIM_INSTRUCTION_NAME = "collect_creator_fee";

  const ix = new TransactionInstruction({
    programId: PUMP_PROGRAM_ID,
    keys: [
      { pubkey: creatorKeypair.publicKey, isSigner: true,  isWritable: true  },
      { pubkey: vault,                    isSigner: false, isWritable: true  },
      { pubkey: SystemProgram.programId,  isSigner: false, isWritable: false },
    ],
    data: discriminator(CLAIM_INSTRUCTION_NAME),
  });

  const tx = new Transaction().add(ix);
  const signature = await sendAndConfirmTransaction(connection, tx, [creatorKeypair]);
  return { signature, claimedLamports };
}
