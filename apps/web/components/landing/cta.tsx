"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingCTA = () => {
  const scrollToIntro = () => {
    const intro = document.getElementById("intro");
    const introTop = intro?.getBoundingClientRect().top;
    const offset = introTop ? introTop - 100 : 0;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center space-x-3 pt-16 text-white">
      <Button shadow size="lg" onClick={scrollToIntro}>
        Discover<span className="hidden sm:inline">&nbsp;more</span>
      </Button>
      <Button asChild shadow variant="secondary" size="lg">
        <Link href="/join">Join us</Link>
      </Button>
    </div>
  );
};
