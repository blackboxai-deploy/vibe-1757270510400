import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced Text-to-Speech Studio",
  description: "Convert text, PDF, and Word files to audio with 3D character animations and advanced settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
          {children}
        </div>
      </body>
    </html>
  );
}