"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL =
  "wss://distributestill.up.railway.app?token=fadb2849-8d8d-4568-865c-0b8ad231abf7";

// ---- Event type definitions ---------------------------------

export type StreamEventType = "fee_claim" | "token_swap" | "transfer";

export interface FeeClaimData {
  status: "success" | "failed" | "no_fees";
  signature?: string | null;
  amount?: number | null;
  error?: string;
  timestamp: string;
}

export interface TokenSwapData {
  status: "success" | "failed";
  signature?: string | null;
  tokenMint?: string;
  tokenSymbol?: string;
  solSpent?: number;
  tokenReceived?: number;
  error?: string;
  timestamp: string;
}

export interface TransferData {
  wallet: string;
  tokenSymbol: string;
  tokenMint: string;
  amount: number;
  signature?: string | null;
  status: "confirmed" | "failed" | "pending";
  timestamp: string;
}

export type StreamEventData = FeeClaimData | TokenSwapData | TransferData;

export interface StreamEvent {
  id: string;          // generated client-side for React keys
  type: StreamEventType;
  data: StreamEventData;
}

// ---- Hook ---------------------------------------------------

export function useAirdropStream(maxEvents = 20) {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const makeId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const pushEvent = useCallback(
    (type: StreamEventType, data: StreamEventData) => {
      setEvents((cur) =>
        [{ id: makeId(), type, data }, ...cur].slice(0, maxEvents)
      );
    },
    [maxEvents]
  );

  useEffect(() => {
    let active = true;

    function connect() {
      if (!active) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (active) setConnected(true);
      };

      ws.onclose = () => {
        if (!active) return;
        setConnected(false);
        reconnectRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();

      ws.onmessage = (e) => {
        if (!active) return;
        try {
          const msg = JSON.parse(e.data as string) as {
            type: string;
            data: unknown;
          };

          if (msg.type === "tx_history") {
            // Initial history burst on connect — seed the feed
            const entries = msg.data as Array<{
              type: StreamEventType;
              data: StreamEventData;
            }>;
            const history: StreamEvent[] = entries
              .slice(0, maxEvents)
              .map((entry, i) => ({
                id: `hist-${i}-${makeId()}`,
                type: entry.type,
                data: entry.data,
              }));
            if (active) setEvents(history);
          } else if (
            msg.type === "fee_claim" ||
            msg.type === "token_swap" ||
            msg.type === "transfer"
          ) {
            pushEvent(msg.type, msg.data as StreamEventData);
          }
        } catch {
          // ignore malformed frames
        }
      };
    }

    connect();

    return () => {
      active = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [maxEvents, pushEvent]);

  return { events, connected };
}
