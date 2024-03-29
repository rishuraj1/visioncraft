"use client";

import Link from "next/link";
import {
  Home,
  ImageIcon,
  Sparkles,
  ScanEye,
  Settings2,
  Camera,
  User,
  CreditCard,
} from "lucide-react";

interface LinkItemProps {
  link: {
    label: string;
    route: string;
    icon: string;
  };
  isActive: boolean;
}

const Icon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "Home":
      return <Home />;
    case "Image":
      return <ImageIcon />;
    case "Sparkles":
      return <Sparkles />;
    case "ScanEye":
      return <ScanEye />;
    case "Settings2":
      return <Settings2 />;
    case "Camera":
      return <Camera />;
    case "User":
      return <User />;
    case "CreditCard":
      return <CreditCard />;
    default:
      return <Home />;
  }
};

const LinkItem = ({ link, isActive }: LinkItemProps) => {
  return (
    <Link
      href={link?.route}
      className={`${isActive ? "dark:text-zinc-300" : "dark:text-zinc-500"} dark:hover:text-zinc-300 flex items-center gap-2 p-2 rounded-md w-full`}
    >
      <Icon icon={link?.icon} />
      {link?.label}
    </Link>
  );
};

export default LinkItem;
