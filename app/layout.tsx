import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SnapScribe Studio",
  description: "Boho-inspired captions for images and keywords",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} bg-boho-bg text-boho-text font-body min-h-screen`}>
        <div className="leaf-fall" aria-hidden="true">
          {[...Array(16)].map((_, idx) => (
            <span key={`leaf-${idx}`} />
          ))}
        </div>
        <div className="app-shell relative z-10 bg-transparent">{children}</div>
      </body>
    </html>
  );
}
