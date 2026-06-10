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
          <h2>Open an account</h2>
          <span className="rule" />
          <span className="tag">Teller window</span>
        </div>

        <div className="cheque">
          <div className="cheque__head">
            <div className="cheque__bankname">
              Jotchua National Bank
              <small>Member F.D.I.C — Federally Doubtful, Block-Chain Certified</small>
            </div>
            <div className="cheque__no">
              CHEQUE Nº <b>000-001</b>
              <br />
              PAY: BAG HOLDERS
              <br />
              AMOUNT: ∞ USDC
            </div>
          </div>

          <div className="cheque__body">
            {/* CONTRACT ADDRESS + COPY */}
            <div className="field">
              <span className="field__label">CA — $JOTCHUABANK ONLY ON PUMP.FUN</span>
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
            <span>⑆ 0210 0002 1⑆ $1JOTCHUA ⑈ 4206 9⑈</span>
            <span className="sig">— $JOTCHUABANK 🐾</span>
          </div>
        </div>
      </div>
    </section>
  );
}
