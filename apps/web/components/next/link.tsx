"use client";

import NextLink from "next/dist/client/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export const Link: typeof NextLink = (({ children, ...props }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  return (
    <NextLink
      ref={linkRef}
      prefetch={true}
      onMouseDown={(e) => {
        const url = new URL(props.href.toString(), window.location.href);
        if (
          url.origin === window.location.origin &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          router.push(props.href.toString());
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}) as typeof NextLink;

export default Link;
