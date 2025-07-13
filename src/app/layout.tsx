import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sutskever30 - Learn AI with an AI Tutor",
  description: "Interactive AI tutor that teaches concepts from Ilya Sutskever's essential reading list. Choose a topic and start learning in a personalized chat conversation.",
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
