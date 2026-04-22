"use client";

import { motion } from "framer-motion";

interface LoadingBarProps {
  isLoading: boolean;
}

export default function LoadingBar({ isLoading }: LoadingBarProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 pointer-events-none">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ 
          duration: 2, 
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
      />
    </div>
  );
}
