"use client";

import { SITE } from "@/lib/config";
import {
  useAirdropStream,
  type StreamEvent,
  type FeeClaimData,
  type TokenSwapData,
  type TransferData,
} from "@/lib/useAirdropStream";

// ---- Row helpers --------------------------------------------

function shortWallet(w: string) {
  return w.length > 14 ? `${w.slice(0, 6)}…${w.slice(-4)}` : w;
}

function fmtNum(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString();
}

function txLink(sig: string | null | undefined) {
  if (!sig) return null;
  return (
    <a
      className="txlink"
      href={`${SITE.explorerTxBase}${sig}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      view ↗
    </a>
  );
}

// Renders one table row per StreamEvent
function EventRow({ event }: { event: StreamEvent }) {
  const { type, data } = event;

  if (type === "fee_claim") {
    const d = data as FeeClaimData;
    return (
      <tr className={d.status === "failed" ? "row--failed" : undefined}>
        <td data-label="Wallet">pump.fun vault</td>
        <td className="r amount" data-label="Amount">
          {d.amount != null ? (
            <>{fmtNum(d.amount)} <span className="usdc">SOL</span></>
          ) : "—"}
        </td>
        <td data-label="Type / Status">
          {d.status === "success" && (
            <span className="stamp stamp--ok">CLAIMED</span>
          )}
          {d.status === "no_fees" && (
            <span className="stamp stamp--pend">NO FEES</span>
          )}
          {d.status === "failed" && (
            <span className="stamp stamp--settled">FAILED</span>
          )}
        </td>
        <td className="r" data-label="Tx">{txLink(d.signature)}</td>
      </tr>
    );
  }

  if (type === "token_swap") {
    const d = data as TokenSwapData;
    return (
      <tr className={d.status === "failed" ? "row--failed" : "row--swap"}>
        <td data-label="Wallet">Jupiter DEX</td>
        <td className="r amount" data-label="Amount">
          {d.tokenReceived != null ? (
            <>
              {fmtNum(d.tokenReceived)}{" "}
              <span className="swap-token">{d.tokenSymbol ?? "TOKEN"}</span>
            </>
          ) : (
            d.error ?? "—"
          )}
        </td>
        <td data-label="Type / Status">
          {d.status === "success" ? (
            <span className="stamp stamp--swap">SWAP ↑</span>
          ) : (
            <span className="stamp stamp--settled">SWAP FAIL</span>
          )}
        </td>
        <td className="r" data-label="Tx">{txLink(d.signature)}</td>
      </tr>
    );
  }

  // transfer
  const d = data as TransferData;
  return (
    <tr className={
      d.status === "confirmed" ? "row--airdrop"
      : d.status === "failed"  ? "row--failed"
      : undefined
    }>
      <td data-label="Wallet">{shortWallet(d.wallet)}</td>
      <td className="r amount" data-label="Amount">
        {fmtNum(d.amount)}{" "}
        <span className="airdrop-token">{d.tokenSymbol}</span>
      </td>
      <td data-label="Type / Status">
        {d.status === "confirmed" && (
          <span className="stamp stamp--airdrop">AIRDROP ↓</span>
        )}
        {d.status === "pending" && (
          <span className="stamp stamp--pend">PENDING</span>
        )}
        {d.status === "failed" && (
          <span className="stamp stamp--settled">FAILED</span>
        )}
      </td>
      <td className="r" data-label="Tx">{txLink(d.signature)}</td>
    </tr>
  );
}

// ---- Main component -----------------------------------------

export default function AirdropTransactions() {
  const { events, connected } = useAirdropStream(20);

  return (
    <section className="section" id="feed">
      <div className="wrap">
        <div className="kicker">
          <h2>$JOTCHUABANK AIRDROPS</h2>
          <span className="rule" />
          <span className="tag">Deposit receipts</span>
        </div>

        <div className="receipt">
          <div className="receipt__head">
            <h3>Live Transactions</h3>
            <span className="live-dot-wrap">
              <span className={`live-dot ${connected ? "live-dot--on" : "live-dot--off"}`} />
              {connected ? "LIVE" : "CONNECTING…"}
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Wallet / Source</th>
                <th className="r">Amount</th>
                <th>Type / Status</th>
                <th className="r">Tx</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", opacity: 0.5, padding: "24px 0" }}>
                    Waiting for transactions…
                  </td>
                </tr>
              ) : (
                events.map((ev) => <EventRow key={ev.id} event={ev} />)
              )}
            </tbody>
          </table>

          <div className="receipt__foot">
            <span>Receipt count: {events.length}</span>
            <span>★ Thank you for banking with $JOTCHUABANK ★</span>
          </div>
        </div>
      </div>
    </section>
  );
}
