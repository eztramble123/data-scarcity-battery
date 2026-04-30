import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Greek Energy Receipt Network",
  description:
    "Athens pilot for verified business demand data, receipt-token proof, and downstream battery intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  );
}
