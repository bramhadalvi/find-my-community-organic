import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find My Community | Indie Game Audience Discovery",
  description: "Find your core audience for organic game community growth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0f1a] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
