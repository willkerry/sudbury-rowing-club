"use client";

import { useContext, useRef } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { AnimatePresence, type Variants, motion } from "framer-motion";

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

const variants: Variants = {
  hidden: { y: -10, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
};

export const PageTransitionEffect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const key = usePathname() ?? "";

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key}
        layoutId={key}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "spring" }}
        className="overflow-hidden"
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};
