import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yartong",
  description:
    "A local marketplace prototype connecting customers with workers, contractors, labourers and construction-material suppliers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
