# $JOTCHUABANK

A one-page Solana meme/airdrop landing site styled like a meme **bank** —
banknote hero, cheque-style link panel, and a perforated receipt ledger
for airdrop transactions.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```

## The 4 things you'll edit
Everything you need to change lives in **`lib/config.ts`**:

| What            | Where                                   |
|-----------------|-----------------------------------------|
| Twitter / X     | `SITE.twitter`                          |
| Contract address| `SITE.ca`                               |
| pump.fun link   | `SITE.pumpfun`                          |
| Background photo| drop it at `public/background.jpg`      |

Look for `// <<< SWAP` comments in `lib/config.ts`.

## Structure
```
app/
  layout.tsx          # fonts (Anton / DM Serif / JetBrains Mono / Inter)
  page.tsx            # composes the sections
  globals.css         # all the bank styling + design tokens
components/
  TickerTape.tsx      # top scrolling strip
  Hero.tsx            # banknote hero + rubber seal
  LinkPanel.tsx       # cheque-style panel (CA + links)
  CopyCAButton.tsx    # copy-to-clipboard button
  AirdropTransactions.tsx  # perforated receipt ledger
lib/
  config.ts           # >>> edit links / CA / image here <<<
  transactions.ts     # mock feed + fetchTransactions() stub
```

## Connecting real airdrop data later
In `lib/transactions.ts`, replace `fetchTransactions()` with a real
Solana RPC / Helius call. Return objects shaped like `Tx`
(`{ wallet, amount, status, sig }`) and the ledger renders them as-is.
There's a commented example in that file to start from.
