"use client";

import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Switch } from "@/components/Switch";

import "react-toastify/dist/ReactToastify.css";

import { classesMerge } from "@/utils/component-classes";

import { useThemeStore } from "@/stores/theme";

import { useEffect } from "react";
import { ThemeName } from "@/types/theme";
import { Button } from "@/components/Button";
import { logoutApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const themeName = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initTheme = useThemeStore((state) => state.initTheme);

  const router = useRouter();

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

  async function logout() {
    await logoutApi();
    router.replace("/auth");
  }

  return (
    <>
      <header className="py-5 flex">
        <h1 className="font-serif text-4xl font-bold text-text-1">
          Shopping List
        </h1>

        <span className="ml-auto"></span>

        <Switch
          setState={(theme: string | number) => setTheme(theme as ThemeName)}
          state={themeName}
          stepsValues={{ start: "light", middle: "system", end: "dark" }}
          label={themeName}
        ></Switch>

        <Button className="ml-3" onClick={logout}>
          Logout
        </Button>
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
