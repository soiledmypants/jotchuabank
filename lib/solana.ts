// =============================================================
//  SOLANA UTILITIES — server-side only
//  Uses Helius RPC for token holder snapshots (much more
//  reliable than raw getProgramAccounts for large holder sets).
// =============================================================

export interface TokenHolder {
  owner: string;   // wallet address (full, not shortened)
  balance: number; // raw token amount (divide by 10^decimals for UI)
}

interface HeliusTokenAccount {
  address: string;
  mint: string;
  owner: string;
  amount: number;
  delegated_amount: number;
  frozen: boolean;
}

interface HeliusTokenAccountsResult {
  total: number;
  limit: number;
  cursor?: string;
  token_accounts: HeliusTokenAccount[];
}

// Fetches ALL holders of a given mint with balance >= minBalance.
// Paginates automatically through Helius getTokenAccounts.
export async function getTokenHolders(
  mintAddress: string,
  rpcUrl: string,
  minBalance: number = 0
): Promise<TokenHolder[]> {
  const holders: TokenHolder[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      jsonrpc: "2.0",
      id: "get-holders",
      method: "getTokenAccounts",
      params: {
        mint: mintAddress,
        limit: 1000,
        options: { showZeroBalance: false },
        ...(cursor ? { cursor } : {}),
      },
    };

    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Helius getTokenAccounts error: ${res.status} ${res.statusText}`);
    }

    const json: { result: HeliusTokenAccountsResult } = await res.json();
    const result = json.result;

    for (const acct of result.token_accounts) {
      if (acct.amount >= minBalance) {
        holders.push({ owner: acct.owner, balance: acct.amount });
      }
    }

    cursor = result.cursor;
  } while (cursor);

  return holders;
}

// Returns the SPL token balance (raw atomic units) of a wallet for a given mint.
// Used to check the fee wallet's reward token balance before distributing.
export async function getSplTokenBalance(
  ownerAddress: string,
  mintAddress: string,
  rpcUrl: string
): Promise<bigint> {
  const body = {
    jsonrpc: "2.0",
    id: "get-balance",
    method: "getTokenAccountsByOwner",
    params: [
      ownerAddress,
      { mint: mintAddress },
      { encoding: "jsonParsed" },
    ],
  };

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`RPC getTokenAccountsByOwner error: ${res.status}`);
  }

  const json = await res.json();
  const accounts: Array<{ account: { data: { parsed: { info: { tokenAmount: { amount: string } } } } } }> =
    json.result?.value ?? [];

  if (accounts.length === 0) return BigInt(0);

  // Sum across all token accounts owned by this wallet for this mint
  return accounts.reduce(
    (sum, acct) => sum + BigInt(acct.account.data.parsed.info.tokenAmount.amount),
    BigInt(0)
  );
}

// Returns SOL balance in lamports.
export async function getSolBalance(
  address: string,
  rpcUrl: string
): Promise<bigint> {
  const body = {
    jsonrpc: "2.0",
    id: "get-sol-balance",
    method: "getBalance",
    params: [address],
  };

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`RPC getBalance error: ${res.status}`);

  const json = await res.json();
  return BigInt(json.result?.value ?? 0);
}

// Shortens a Solana address for display: "7xKpQ2…aF9d"
export const shortenAddress = (addr: string) =>
  `${addr.slice(0, 6)}…${addr.slice(-4)}`;
