import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrainForge AI — AI-Powered Quiz Excellence",
  description: "Unleash your academic success with BrainForge's AI Exam Excellence Platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
