"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { classesMerge } from "@/utils/component-classes";

import { useThemeStore } from "@/stores/theme";

import { Switch } from "@/components/Switch";
import { ThemeName } from "@/types/theme";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  const themeName = useThemeStore((state) => state.theme);
  const initTheme = useThemeStore((state) => state.initTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    initTheme();
  }, []);

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
        <header className="pt-5 flex justify-between">
          <h1 className="font-serif text-4xl font-bold text-text-1">
            Buying List
          </h1>

          <Switch
            setState={(theme: string | number) => setTheme(theme as ThemeName)}
            state={themeName}
            stepsValues={{ start: "light", middle: "system", end: "dark" }}
            label={themeName}
          ></Switch>
        </header>

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

        <main className="mt-10">{children}</main>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
