"use client";

import Link from "next/link";
import React from "react";
import LogoText from "./logo-text";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import LinkItem from "./link-item";
import { Button } from "../ui/button";

export const navLinks = [
  {
    label: "Home",
    route: "/",
    icon: "Home",
  },
  {
    label: "Image Restore",
    route: "/transformations/add/restore",
    icon: "Image",
  },
  {
    label: "Generative Fill",
    route: "/transformations/add/fill",
    icon: "Sparkles",
  },
  {
    label: "Object Remove",
    route: "/transformations/add/remove",
    icon: "ScanEye",
  },
  {
    label: "Object Recolor",
    route: "/transformations/add/recolor",
    icon: "Settings2",
  },
  {
    label: "Background Remove",
    route: "/transformations/add/removeBackground",
    icon: "Camera",
  },
  {
    label: "Profile",
    route: "/profile",
    icon: "User",
  },
  {
    label: "Buy Credits",
    route: "/credits",
    icon: "CreditCard",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden h-screen w-72 bg-white p-5 shadow-md shadow-purple-200/50 lg:flex">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="flex items-center gap-2">
          <LogoText />
        </Link>

        <nav className="h-full flex-1 flex-col justify-between md:flex md:gap-4">
          <SignedIn>
            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              {navLinks?.slice(0, 6)?.map((link) => {
                const isActive = link?.route === pathname;
                return (
                  <li
                    key={link?.route}
                    className={`hidden w-full flex-col items-start gap-2 rounded-md md:flex group ${isActive ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                  >
                    <LinkItem link={link} isActive={isActive} />
                  </li>
                );
              })}
            </ul>

            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              {navLinks?.slice(6)?.map((link) => {
                const isActive = link?.route === pathname;
                return (
                  <li
                    key={link?.route}
                    className={`hidden w-full flex-col items-start gap-2 rounded-md md:flex group ${isActive ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                  >
                    <LinkItem link={link} isActive={isActive} />
                  </li>
                );
              })}
              <li className="flex items-center justify-center cursor-pointer gap-2 p-2">
                <UserButton afterSignOutUrl="/" showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button
              asChild
              className="bg-purple-gradient bg-cover py-4 px-6 flex-center gap-3 rounded-full p-16-semibold focus-visible:ring-offset-0 focus-visible:ring-transparent !important"
            >
              <Link href={"/sign-in"}>Sign In</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
