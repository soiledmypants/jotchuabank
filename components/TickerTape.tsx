/**
 * TickerTape — the scrolling strip at the very top.
 * Edit ITEMS to change the messages.
 */
const ITEMS = [
  "$JOTCHUABANK",
  "● AIRDROP LIVE",
  "SOLANA · USDC",
  "DEPOSITS INSURED BY VIBES",
  "● HOLD THE BAG",
  "NO RUGS · ONLY HUGS",
  "THE TELLER IS A DOG",
];

export default function TickerTape() {
  // rendered twice for a seamless loop
  const run = [...ITEMS, ...ITEMS];
  return (
    <div className="tape" aria-hidden="true">
      <div className="tape__track">
        {run.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
