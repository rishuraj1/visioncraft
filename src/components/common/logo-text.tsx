import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoTextProps {
  size?: "small" | "medium";
}

const LogoText = ({ size }: LogoTextProps) => {
  return (
    <div className="flex gap-2 items-center justify-center text-center">
      <Image
        src={"/logo.png"}
        alt="logo"
        width={size === "small" ? 40 : 60}
        height={size === "small" ? 40 : 60}
        className="object-center relative bottom-1"
      />
      <span
        className={cn(
          "text-center tracking-wide font-bold text-purple-500",
          size === "small" && "text-lg",
          size === "medium" && "text-xl",
        )}
      >
        VISIONCRAFT
      </span>
    </div>
  );
};

export default LogoText;
