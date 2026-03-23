"use client"
import { Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export default function Logo({ size = "md", clickable = true }: LogoProps) {
  const navigate = useRouter();
  const sizes = {
    sm: { box: "h-8 w-8", icon: "h-3.5 w-3.5", text: "text-lg" },
    md: { box: "h-9 w-9", icon: "h-4 w-4", text: "text-xl" },
    lg: { box: "h-12 w-12", icon: "h-6 w-6", text: "text-2xl" },
  };
  const s = sizes[size];

  const {theme} =  useTheme();

  const logoUrl = useMemo(()=>{
     return `/logos/${theme}-logo.svg`;
  },[theme])

  return (
    <div
      className={`flex items-center gap-2.5 ${clickable ? "cursor-pointer" : ""}`}
      onClick={clickable ? () => navigate.push("/") : undefined}
    >
      
     <img src={logoUrl} alt="" className="w-[180px]" />
    </div>
  );
}
