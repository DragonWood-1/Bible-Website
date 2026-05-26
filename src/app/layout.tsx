import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F1B3D",
};

export const metadata: Metadata = {
  title: {
    default: "FaithLifted — Daily Bible Verses, Affirmations & Christian Encouragement",
    template: "%s | FaithLifted",
  },
  description:
    "Experience daily Bible verses, faith-based affirmations, AI-powered encouragement, prayer prompts, scripture meditation, and Christian wellness support.",
  keywords: [
    "daily bible verse",
    "christian affirmations",
    "bible affirmations for anxiety",
    "morning prayer and affirmation",
    "scripture for strength",
    "faith based affirmations",
    "bible verses by topic",
    "christian encouragement",
    "prayer generator",
    "scripture meditation",
    "christian mental wellness",
  ],
  openGraph: {
    type: "website",
    siteName: "FaithLifted",
    title: "FaithLifted — Daily Bible Verses & Christian Encouragement",
    description: "Your daily source of biblical strength, faith affirmations, and AI-powered Christian encouragement.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
