import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://geolhc.github.io/"),
  title: "Project New GEM — Business Banking Onboarding",
  description: "Next GEM is the Relationship Coach: spark faster, trust deeper and grow together through one connected business banking journey.",
  openGraph: {
    title: "Next GEM — Greater. Easier. More.",
    description: "From a 30-day process to a 3-minute match and a lifetime relationship.",
    images: [{ url: `${basePath}/og.png`, width: 1536, height: 1024, alt: "Next GEM holographic gem identity" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next GEM — Greater. Easier. More.",
    description: "From a 30-day process to a 3-minute match and a lifetime relationship.",
    images: [`${basePath}/og.png`],
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
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
