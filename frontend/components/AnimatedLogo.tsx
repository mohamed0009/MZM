"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function AnimatedLogo({ size = "md", showText = false }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("relative rounded-full bg-blue-600 flex items-center justify-center", sizeClasses[size])}>
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-60"></div>
        <div className="relative">
          <Heart 
            className="text-white" 
            fill="white" 
            size={size === "sm" ? 18 : size === "md" ? 24 : 30} 
          />
          <svg 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
            width={size === "sm" ? 12 : size === "md" ? 16 : 20} 
            height={size === "sm" ? 8 : size === "md" ? 10 : 12} 
            viewBox="0 0 16 8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0 4H3L4 1L6 7L8 4L9 5L11 2L13 4H16" 
              stroke="blue" 
              strokeWidth="1.5"
              className="heartbeat-line"
            />
          </svg>
        </div>
      </div>
      {showText && (
        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          PharmaFlow
        </span>
      )}
      <style jsx global>{`
        .heartbeat-line {
          stroke-dasharray: 24;
          animation: heartbeat-pulse 1.5s infinite linear;
        }
        @keyframes heartbeat-pulse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -48; }
        }
      `}</style>
    </div>
  );
} 