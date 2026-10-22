"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { classesMerge } from "@/utils/component-classes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  const links = [
    {
      text: "Lists",
      link: "/",
    },
    {
      text: "Groups",
      link: "/groups",
    },
  ];

  const pathname = usePathname();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full max-w-6xl mx-auto flex flex-col bg-neutral-0 text-text-0 ">
        <p>Buying List</p>

        <nav className="bg-neutral-1 rounded-xl p-1 hidden lg:block">
          <ul className="font-medium text-sm flex justify-evenly gap-5">
            {links.map((link) => (
              <li className="w-full text-center" key={link.link}>
                <Link
                  href={link.link}
                  className={classesMerge(
                    "block py-1 w-full rounded-lg",
                    pathname === link.link ? "bg-neutral-2 text-text-1" : "",
                  )}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {children}

        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
