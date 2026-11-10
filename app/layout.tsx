import { DM_Sans, DM_Serif_Display } from "next/font/google";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { TanstackQuery } from "@/components/TanstackQuery";

const dmSans = DM_Sans({
  variable: "--dm-sans",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--dm-serif-display",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full max-w-6xl mx-auto flex flex-col bg-neutral-0 text-text-0 ">
        <TanstackQuery>{children}</TanstackQuery>
      </body>
    </html>
  );
}
