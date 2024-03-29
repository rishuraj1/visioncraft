import MobileNav from "@/components/common/mobile-nav";
import Sidebar from "@/components/common/sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <Sidebar />
      <MobileNav />

      <div className="mt-8 flex-1 overflow-auto lg:mt-0 lg:max-h-screen lg:py-7">
        <div className="max-w-5xl mx-auto md:px-10 w-full text-dark-400 font-normal text-[16px] leading-[140%]">
          {children}
        </div>
      </div>

      <Toaster />
    </main>
  );
};

export default Layout;
