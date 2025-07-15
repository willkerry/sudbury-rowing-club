"use client";

import Image from "next/image";
import { useState } from "react";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";
import { cn } from "@/lib/utils";

const BLADE_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABGCAAAAAALVDIRAAACrElEQVR4AWL4PyjBqLPwglFnjTpr1Fl3d93ZsX3Stglb+tJ6UqwtzU2NDfV1tTXVVZUVFeRkpCTERIQE+Hi4ONhYmJg4BSQU1PXN7dx8y2ublx/fcHYngFm75psiiMEAHhwqOuRzBHd3KympBmtwd3fq4O7uNLgT3N3d3Qmw71uhu5PJMjmpTv6/J+fPndp14enzu+FZlxDRUXJgYkk7zEwF13KI6BCp4+LLBx8HY60g0Q8xO3LoEADdtBG7H7/QsqaSBB2mJEBA7L/9kT+rMYvJMJNDSHSPPVigF6TQVdl4xo6l0BG41HMtN5ZIBtZdkDcYH+sNyKsIWS9AnkfIegfyMELWZ5CNLj7WR5AjGB/rFghFmNaJOFl7QeZgLihGJE4OhWfTph+deWzO3BMLFp5afHrZ8rMrV59be2H9xoubt14+JCBXMQ8UwZwrWZKVOzmwCOvfFsnEeoL2KtgskpH1wFmrEG9KZtYn47QYBnh9Oi1hrNooXqyytqrt4seqaKraL56sdmzHwvHiy2pvx6Iy4s3qQHYrvOfPWu+sWK6r+LM2O7uwFKydGF1YAsnJZvCoilWEjXb4XMVqYMUSFWso2bBQx1qPJixSsnbFyRLgGJco1WxY5ZWsAU4sprGStRYNUES9lKybwKFNDioPvaVkSWUKSGJCqLzsZoDOZ6gLFxNC99WJSc/ajcFiGro7YEMGrCY5KIwpIKs+6Uk3wveJq1GxOOg+JiGFZ90E9gkJodqAtTcM29fKlE1EP0QTr1uXwsswLSjJqPXaXbl01beB04CwSPeh66+/yK9Cr09/9rBDhEoNvoOe5t3s74Ffe96CFhVqtFh5cef/+sNBMS4sJZNlIRSt02zwynWb9Y9qHWsMfBsQcDr71Mf2bL///P3o8oxRZ406a9RZAGMbyBVU00+pAAAAAElFTkSuQmCC";

export const Blade = ({ src, alt }: { src: string | null; alt: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-3 w-6 overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          loaded ? "opacity-0" : "opacity-100",
        )}
      >
        <img
          src={BLADE_PLACEHOLDER}
          alt=""
          className="h-full w-full animate-pulse"
        />
      </div>

      <Image
        src={src ?? BLADE_PLACEHOLDER}
        alt={alt}
        width={24}
        height={12}
        className={cn(
          "mix-blend-multiply transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        loader={cloudflareLoader}
      />

      {!src && (
        <div
          className="absolute inset-0 ml-1 flex select-none items-center font-semibold text-[0.5em]"
          aria-hidden
        >
          ?
        </div>
      )}
    </div>
  );
};
