// =============================================================
//  /api/airdrop
//
//  GET  → public snapshot: eligible holders, reward balance,
//          amount per holder.
//
//  POST → protected execution (requires Authorization: Bearer <AIRDROP_API_KEY>)
//
//    { "mode": "full" }           ← RECOMMENDED
//      Full pipeline:
//        1. Auto-claim pump.fun creator fees (SOL → your wallet)
//        2. Jupiter swap SOL → reward token
//        3. Snapshot holders with ≥ 500k $JOTCHUABANK
//        4. Distribute reward token evenly
//
//    { "mode": "distribute" }
//      Skip claim + swap. Just distribute whatever reward token
//      balance is already in the fee wallet.
//
//    { "mode": "swap", "lamports": "5000000000" }
//      Only run the Jupiter swap step.
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  getAirdropSnapshot,
  executeAirdrop,
  swapSolForRewardToken,
  runFullAirdropPipeline,
} from "@/lib/airdrop";

export const runtime = "nodejs";

// GET /api/airdrop — public snapshot
export async function GET() {
  try {
    const snapshot = await getAirdropSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/airdrop — protected execution
export async function POST(req: NextRequest) {
  const apiKey = process.env.AIRDROP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AIRDROP_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const privateKey = process.env.AIRDROP_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "AIRDROP_WALLET_PRIVATE_KEY is not set on the server." },
      { status: 500 }
    );
  }

  let body: { mode?: string; lamports?: string } = {};
  try { body = await req.json(); } catch { /* empty body = default to full */ }

  const mode = body.mode ?? "full";

  try {
    if (mode === "full") {
      // Claim pump.fun fees → swap → distribute
      const result = await runFullAirdropPipeline(privateKey);
      return NextResponse.json(result);
    }

    if (mode === "swap") {
      if (!body.lamports) {
        return NextResponse.json(
          { error: "Provide lamports amount for swap mode." },
          { status: 400 }
        );
      }
      const sig = await swapSolForRewardToken(privateKey, BigInt(body.lamports));
      return NextResponse.json({ swapSignature: sig });
    }

    if (mode === "distribute") {
      const result = await executeAirdrop(privateKey);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: `Unknown mode "${mode}". Use "full", "swap", or "distribute".` },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
