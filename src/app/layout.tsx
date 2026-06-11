import type { Metadata } from "next";
import { Orbitron, Orbit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const orbit = Orbit({ weight: "400", subsets: ["latin"], variable: "--font-orbit" });

export const metadata: Metadata = {
  title: "Museboxd | Your Music Hub",
  description: "Rate and review your favorite songs and albums",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      {/* min-h-screen = strona zajmuje minimum 100% wysokości ekranu
        flex flex-col = Auto Layout w pionie 
      */}
      <body className={`${orbitron.variable} ${orbit.variable} antialiased min-h-screen flex flex-col bg-brand text-text`}>
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}