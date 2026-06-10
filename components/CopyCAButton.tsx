"use client";

import { useState } from "react";

/**
 * CopyCAButton — copies the contract address to the clipboard
 * and flips to a confirmed state for a moment.
 */
export default function CopyCAButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard blocked (e.g. insecure context) — fail quietly
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy contract address"
      className={`copy ${copied ? "ok" : ""}`}
    >
      {copied ? "Copied ✓" : "Copy CA"}
    </button>
  );
}
