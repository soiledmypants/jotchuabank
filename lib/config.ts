// =============================================================
//  EDIT EVERYTHING HERE.
//  This is the single source of truth for the whole site.
// =============================================================

export const SITE = {
  name: "$JOTCHUABANK",
  subtitle: "USDC/SOL Airdrop for $JOTCHUA.",
  // shown under the hero title
  lede:
    "Buy $JOTCHUABANK, become part of the bank.\n\nEvery transaction contributes to the treasury, and treasury fees are used to acquire and airdrop $JOTCHUA back to holders.\n\nHold the bank. Earn the dog.\n\nTwo communities. One ecosystem. A win-win.",

  // ---- LINKS -------------------------------------------------
  twitter: "https://x.com/yourhandle",        // <<< SWAP: your X / Twitter
  ca: "PASTE_SOLANA_CA_HERE",                  // <<< SWAP: Solana mint address
  pumpfun: "https://pump.fun/coin/PASTE_CA_HERE", // <<< SWAP: pump.fun coin URL

  // ---- BACKGROUND PHOTO -------------------------------------
  // Put your puppy photo at /public/background.png
  // (or change this path). It loads on top of a warm fallback,
  // so the page never looks broken if the file is missing.
  backgroundImage: "/background.png",          // <<< SWAP if you rename it

  // ---- EXPLORER ---------------------------------------------
  // Used to build the per-transaction "view" link.
  explorerTxBase: "https://solscan.io/tx/",    // <<< SWAP if you prefer Solana Explorer
} as const;

// =============================================================
//  AIRDROP SYSTEM CONFIG
//  Fill these in once you have your token addresses.
//  Server-side secrets go in .env.local (never committed).
// =============================================================

export const AIRDROP = {
  // The $JOTCHUABANK token mint (the coin people must hold)
  mainTokenMint: process.env.NEXT_PUBLIC_MAIN_TOKEN_MINT ?? "PASTE_JOTCHUABANK_MINT_HERE",

  // The reward token being airdropped (the other coin you buy with fees)
  rewardTokenMint: process.env.NEXT_PUBLIC_REWARD_TOKEN_MINT ?? "PASTE_REWARD_TOKEN_MINT_HERE",
  rewardTokenSymbol: process.env.NEXT_PUBLIC_REWARD_TOKEN_SYMBOL ?? "$JOTCHUA",

  // Wallet that collects trading fees — its balance is used to buy the reward token
  feeWallet: process.env.NEXT_PUBLIC_FEE_WALLET ?? "PASTE_FEE_WALLET_HERE",

  // Minimum $JOTCHUABANK tokens a wallet must hold to qualify for the airdrop
  minHolderBalance: 500_000,

  // Solana RPC endpoint — use a Helius API key for best performance
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.mainnet-beta.solana.com",
} as const;
