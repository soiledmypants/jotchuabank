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
            <span className="dollar">$</span>JOTCHUABANK
          </div>
          <p>
            Deposits insured by Jotchua. $JOTCHUABANK on SOL/USDC — ape in, tip
            your teller, pet JOTCHUA.
          </p>
        </div>
      </footer>
    </>
  );
}
