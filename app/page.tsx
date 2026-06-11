import Hero from "@/components/Hero";
import LinkPanel from "@/components/LinkPanel";
import AirdropTransactions from "@/components/AirdropTransactions";
import TickerTape from "@/components/TickerTape";

export default function Page() {
  return (
    <>
      <TickerTape />
      <Hero />
      <LinkPanel />
      <AirdropTransactions />

      <footer className="foot">
        <div className="wrap">
          <div className="mark">
            <span className="dollar">$</span>WORLDCUPBANK
          </div>
          <p>
            The World Cup Bank — buy $WCB on Solana, get airdropped $WORLDCUP. The biggest sporting event deserves the biggest airdrop. Unity. Passion. Glory.
          </p>
        </div>
      </footer>
    </>
  );
}
