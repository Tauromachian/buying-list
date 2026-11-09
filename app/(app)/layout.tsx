"use client";

import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Switch } from "@/components/Switch";

import "react-toastify/dist/ReactToastify.css";

import { classesMerge } from "@/utils/component-classes";

import { useThemeStore } from "@/stores/theme";

import { useEffect } from "react";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const themeName = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initTheme = useThemeStore((state) => state.initTheme);

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
    <>
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
    </>
  );
}
