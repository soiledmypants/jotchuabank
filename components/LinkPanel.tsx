import { SITE } from "@/lib/config";
import CopyCAButton from "./CopyCAButton";

/**
 * LinkPanel — the "teller window". A bank-cheque card holding the
 * contract address (with copy button), X and pump.fun links.
 */
export default function LinkPanel() {
  return (
    <section className="section section--green" id="open">
      <div className="wrap">
        <div className="kicker">
          <h2>Join the Squad</h2>
          <span className="rule" />
          <span className="tag">Teller window</span>
        </div>

        <div className="cheque">
          <div className="cheque__head">
            <div className="cheque__bankname">
              World Cup Bank
              <small>Member F.I.F.A — Financially Insured For Airdrops · Block-Chain Certified</small>
            </div>
            <div className="cheque__no">
              CHEQUE Nº <b>WCB-001</b>
              <br />
              PAY: THE HOLDERS
              <br />
              AMOUNT: ∞ $WORLDCUP
            </div>
          </div>

          <div className="cheque__body">
            {/* CONTRACT ADDRESS + COPY */}
            <div className="field">
              <span className="field__label">CA — $WORLDCUPBANK ONLY ON PUMP.FUN</span>
              <div className="ca">
                <code>{SITE.ca}</code>
                <CopyCAButton value={SITE.ca} />
              </div>
            </div>

            {/* SOCIAL / TRADE LINKS */}
            <div className="field">
              <span className="field__label">Official links</span>
              <div className="links">
                <a className="btn btn--paper" href={SITE.twitter} target="_blank" rel="noopener noreferrer">
                  𝕏 / Twitter ↗
                </a>
                <a className="btn btn--mint" href={SITE.pumpfun} target="_blank" rel="noopener noreferrer">
                  Buy on pump.fun ↗
                </a>
              </div>
            </div>
          </div>

          <div className="micr">
            <span>⑆ 2026 0006 1⑆ $WCB ⑈ 4206 9⑈</span>
            <span className="sig">— $WORLDCUPBANK ⚽</span>
          </div>
        </div>
      </div>
    </section>
  );
}
