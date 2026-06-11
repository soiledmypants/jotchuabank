import { SITE } from "@/lib/config";

/**
 * Hero — full-page photo background + dark overlay + banknote frame.
 * The background photo comes from SITE.backgroundImage and layers on
 * top of a warm fallback (see .hero in globals.css), so it never
 * looks broken while you're still adding the image.
 */
export default function Hero() {
  return (
    <header
      className="hero"
      // the photo is injected as a CSS var so globals.css can layer it
      // over the warm fallback gradient
      style={{ ["--bg-image" as string]: `url('${SITE.backgroundImage}')` }}
    >
      <div className="wrap">
        <div className="note">
          <span className="note__corner tl">$1B</span>
          <span className="note__corner tr">$1B</span>
          <span className="note__corner bl">SOL</span>
          <span className="note__corner br">USDC</span>

          {/* rubber seal */}
          <svg
            className="seal"
            viewBox="0 0 120 120"
            role="img"
            aria-label="World Cup Bank Solana seal"
          >
            <circle cx="60" cy="60" r="56" fill="none" stroke="#c9a227" strokeWidth="3" />
            <circle cx="60" cy="60" r="44" fill="none" stroke="#c9a227" strokeWidth="1.5" />
            <path id="sealtop" d="M60 18 a42 42 0 0 1 0 84 a42 42 0 0 1 0 -84" fill="none" />
            <text
              fill="#c9a227"
              fontFamily="var(--font-mono)"
              fontWeight="700"
              fontSize="9.5"
              letterSpacing="2"
            >
              <textPath href="#sealtop" startOffset="2%">
                ★ AIRDROP LIVE ★ SOLANA ★ BUY $WCB ★
              </textPath>
            </text>
            <text x="60" y="52" textAnchor="middle" fill="#c9a227" fontFamily="var(--font-display)" fontSize="18">
              WORLD
            </text>
            <text x="60" y="68" textAnchor="middle" fill="#c9a227" fontFamily="var(--font-display)" fontSize="18">
              CUP
            </text>
            <text x="60" y="80" textAnchor="middle" fill="#c9a227" fontFamily="var(--font-mono)" fontWeight="700" fontSize="9" letterSpacing="2">
              EST. 2026
            </text>
          </svg>

          <p className="eyebrow">World Cup Bank · Solana · Built on Trust. Driven by You.</p>
          <h1 className="title">
          
          </h1>
          <p className="subtitle">{SITE.subtitle}</p>
          <p className="lede">{SITE.lede}</p>

          <div className="hero__cta">
            <a className="btn btn--mint" href="#open">
              Join the Squad ↓
            </a>
            <a className="btn btn--ghost" href="#feed">
              See the Ledger ⚽
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
