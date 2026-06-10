// =============================================================
//  AIRDROP TRANSACTIONS — data layer
//  Tx now has txType + token so the feed can show both buy
//  transactions (USDC) and airdrop distributions ($JOTCHUA).
//  Swap fetchTransactions() for a real Helius/RPC call later.
// =============================================================

export type TxStatus = "confirmed" | "pending" | "settled";
export type TxType = "buy" | "airdrop";

export interface Tx {
  wallet: string;   // short display form, e.g. "7xKpQ2…aF9d"
  amount: string;   // pre-formatted, e.g. "12,500"
  status: TxStatus;
  sig: string;      // signature (used to build the explorer link)
  txType: TxType;   // "buy" = someone bought $JOTCHUABANK; "airdrop" = reward sent out
  token: string;    // token symbol displayed in the amount column
}

export const MOCK_TX: Tx[] = [
  { wallet: "7xKpQ2…aF9d", amount: "12,500",  status: "confirmed", sig: "5Jq8kw2", txType: "buy",     token: "USDC"     },
  { wallet: "Bny4Wu…3MzR", amount: "8,000",   status: "confirmed", sig: "2Vc1tp9", txType: "airdrop", token: "$JOTCHUA" },
  { wallet: "Gho9Ld…7yQa", amount: "4,206.9", status: "pending",   sig: "9Az7br3", txType: "buy",     token: "USDC"     },
  { wallet: "Dpz2Kc…Q1vN", amount: "25,000",  status: "settled",   sig: "3Hf5mn8", txType: "airdrop", token: "$JOTCHUA" },
  { wallet: "4Frt8s…uX0p", amount: "1,337",   status: "confirmed", sig: "7Kd2la4", txType: "buy",     token: "USDC"     },
  { wallet: "9Vbn3a…Lk6T", amount: "69,420",  status: "settled",   sig: "1Qw9ze6", txType: "airdrop", token: "$JOTCHUA" },
  { wallet: "Mxe7Yh…2Rdc", amount: "3,500",   status: "pending",   sig: "6Tn4vy1", txType: "buy",     token: "USDC"     },
];

// -------------------------------------------------------------
//  LATER: real data via Helius. Return Tx[] with txType set:
//    "buy"     → getSignaturesForAddress on $JOTCHUABANK mint
//    "airdrop" → getSignaturesForAddress on reward token mint,
//                filtered to transfers FROM the fee wallet
//
//  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
//  const fmt   = (n: number) => n.toLocaleString();
// -------------------------------------------------------------

export async function fetchTransactions(): Promise<Tx[]> {
  return MOCK_TX;
}

export const STATUS_META: Record<TxStatus, { label: string; cls: string }> = {
  confirmed: { label: "Confirmed", cls: "stamp--ok"      },
  pending:   { label: "Pending",   cls: "stamp--pend"    },
  settled:   { label: "Settled",   cls: "stamp--settled" },
};
