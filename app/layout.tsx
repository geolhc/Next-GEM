import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project New GEM — Business Banking Onboarding",
  description: "A bold, progressive business banking onboarding concept: from business idea to banking ready in minutes.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
