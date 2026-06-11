import type { Metadata } from "next";
import { Anton, DM_Serif_Display, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

// Display (banknote headline), engraved serif, ledger mono, body
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const dmSerif = DM_Serif_Display({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "$WORLDCUPBANK — Solana Airdrop for the World Cup",
  description: "Buy $WORLDCUPBANK on Solana, get airdropped $WORLDCUP. The biggest sporting event deserves the biggest airdrop. One world. One game. One goal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${dmSerif.variable} ${mono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
