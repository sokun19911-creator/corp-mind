import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Corp Mind AI",
  description: "5人のAIエージェントがビジネスアイデアを審議・計画・アーカイブ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
