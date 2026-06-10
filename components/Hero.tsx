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
            aria-label="USDC certified Solana seal"
          >
            <circle cx="60" cy="60" r="56" fill="none" stroke="#c5362b" strokeWidth="3" />
            <circle cx="60" cy="60" r="44" fill="none" stroke="#c5362b" strokeWidth="1.5" />
            <path id="sealtop" d="M60 18 a42 42 0 0 1 0 84 a42 42 0 0 1 0 -84" fill="none" />
            <text
              fill="#c5362b"
              fontFamily="var(--font-mono)"
              fontWeight="700"
              fontSize="10.5"
              letterSpacing="2"
            >
              <textPath href="#sealtop" startOffset="2%">
                ★ USDC CERTIFIED ★ SOLANA ★ DEPOSIT OK ★
              </textPath>
            </text>
            <text x="60" y="56" textAnchor="middle" fill="#c5362b" fontFamily="var(--font-display)" fontSize="20">
              JOTCHUA
            </text>
            <text x="60" y="74" textAnchor="middle" fill="#c5362b" fontFamily="var(--font-mono)" fontWeight="700" fontSize="9" letterSpacing="2">
              EST. 2026
            </text>
          </svg>

          <p className="eyebrow">Federal reserve of good boys · solana</p>
          <h1 className="title">
          
          </h1>
          <p className="subtitle">{SITE.subtitle}</p>
          <p className="lede">{SITE.lede}</p>

          <div className="hero__cta">
            <a className="btn btn--mint" href="#open">
              Open an account ↓
            </a>
            <a className="btn btn--ghost" href="#feed">
              See the ledger
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
