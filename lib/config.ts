// =============================================================
//  EDIT EVERYTHING HERE.
//  This is the single source of truth for the whole site.
// =============================================================

export const SITE = {
  name: "$WORLDCUPBANK",
  subtitle: "The biggest airdrop for the biggest event.",
  // shown under the hero title
  lede:
    "Buy $WORLDCUPBANK, become part of the squad.\n\nEvery transaction contributes to the treasury, and treasury fees are used to acquire and airdrop $WORLDCUP back to holders.\n\nHold the bank. Earn the cup.\n\nWhat's better than a free airdrop? Celebrating the biggest sporting event on the planet — bigger than the Super Bowl — with one. One world. One game. One goal.",

  // ---- LINKS -------------------------------------------------
  twitter: "https://x.com/WorldCupBankFun",
  ca: "6mR7a4oowNrQCW5KJNToyvQFgSakPwcrYH3k1B4E4DeD",
  pumpfun: "https://pump.fun/coin/6mR7a4oowNrQCW5KJNToyvQFgSakPwcrYH3k1B4E4DeD",

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
  // The $WORLDCUPBANK token mint (the coin people must hold)
  mainTokenMint: process.env.NEXT_PUBLIC_MAIN_TOKEN_MINT ?? "6mR7a4oowNrQCW5KJNToyvQFgSakPwcrYH3k1B4E4DeD",

  // The reward token being airdropped (the other coin you buy with fees)
  rewardTokenMint: process.env.NEXT_PUBLIC_REWARD_TOKEN_MINT ?? "PASTE_REWARD_TOKEN_MINT_HERE",
  rewardTokenSymbol: process.env.NEXT_PUBLIC_REWARD_TOKEN_SYMBOL ?? "$WORLDCUP",

  // Wallet that collects trading fees — its balance is used to buy the reward token
  feeWallet: process.env.NEXT_PUBLIC_FEE_WALLET ?? "PASTE_FEE_WALLET_HERE",

  // Minimum $JOTCHUABANK tokens a wallet must hold to qualify for the airdrop
  minHolderBalance: 500_000,

  // Solana RPC endpoint — use a Helius API key for best performance
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.mainnet-beta.solana.com",
} as const;
