import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster, toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MiniRoute",
  description: "Generate short and long URLs with just a few clicks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#1a1a1a]`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
