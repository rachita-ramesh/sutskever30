import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Concepts by Ilya Sutskever: A Chat-Based Tutor",
  description: "An interactive AI tutor that makes Ilya Sutskever's essential AI reading list accessible through personalized chat conversations.",
  keywords: ["AI", "Machine Learning", "Deep Learning", "Sutskever", "AI Tutor", "Interactive Learning", "Chat", "Education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
