import { Geist, Geist_Mono } from "next/font/google";

// Define each font once here and import it where needed. Every call to a
// next/font loader hosts a separate copy of the font.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
