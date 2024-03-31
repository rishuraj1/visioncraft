"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import LogoText from "./logo-text";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import LinkItem from "./link-item";
import { Button } from "../ui/button";
import { ToggleTheme } from "../toggle-theme";
import { navLinks } from "@/constants";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className="flex justify-between items-center shadow-md lg:hidden">
      <Link href={"/"} className="flex gap-2 items-center md:py-2">
        <LogoText size="medium" />
      </Link>

      <nav className="flex gap-3">
        <ToggleTheme size="icon" className="flex-center bg-transparent" />
        <SignedIn>
          <Sheet>
            <SheetTrigger>
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent className="focus:ring-0 focus-visible:ring-transparent focus:ring-offset-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-none !important sm:w-64">
              <>
                <LogoText size="small" />

                <ul className=" mt-8 flex w-full flex-col items-start gap-5">
                  {navLinks?.map((link) => {
                    const isActive = link?.route === pathname;
                    return (
                      <li
                        key={link?.route}
                        className={`w-full flex-col items-start gap-2 rounded-md md:flex group ${isActive ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                      >
                        <LinkItem isActive={isActive} link={link} />
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
          <UserButton afterSignOutUrl="/" />
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
    </header>
  );
};

export default MobileNav;
