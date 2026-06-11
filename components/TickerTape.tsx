/**
 * TickerTape — the scrolling strip at the very top.
 * Edit ITEMS to change the messages.
 */
const ITEMS = [
  "$WORLDCUPBANK",
  "● AIRDROP LIVE",
  "SOLANA · USDC",
  "ONE WORLD · ONE GAME · ONE AIRDROP",
  "● BIGGER THAN THE SUPER BOWL",
  "BUY WCB · EARN $WORLDCUP",
  "THE BEAUTIFUL GAME · THE BEAUTIFUL GAINS",
  "● UNITY · PASSION · GLORY",
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
