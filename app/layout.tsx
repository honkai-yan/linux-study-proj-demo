import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linux高可用集群练习",
  description: "High availability cluster practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
