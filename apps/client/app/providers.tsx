"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { motion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { useDrawerStore } from "@/store/drawerStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { isDrawerOpen } = useDrawerStore();

  const contentVariants = {
    initial: {
      scale: 1,
      borderRadius: "0px",
    },
    closed: {
      scale: 1,
      borderRadius: "0px",
    },
    open: {
      scale: 0.98,
      borderRadius: "10px",
    },
  };

  const contentTransition = {
    duration: 0.2,
  };

  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <motion.div
          className="content-wrapper"
          animate={isDrawerOpen ? "open" : "closed"}
          variants={contentVariants}
          transition={contentTransition}
          style={{
            originX: 0.5,
            originY: 0.5,
            overflow: "hidden",
          }}
        >
          {children}
        </motion.div>
      </ThemeProvider>
    </ClerkProvider>
  );
}
