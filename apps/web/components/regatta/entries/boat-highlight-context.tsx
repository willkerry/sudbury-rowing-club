"use client";

import { createContext, use, useCallback, useMemo, useRef } from "react";

type ElementPair = {
  table: HTMLButtonElement | null;
  list: HTMLButtonElement | null;
};

type BoatHighlightContextValue = {
  register: (
    sanitizedId: string,
    location: "table" | "list",
    el: HTMLButtonElement | null,
  ) => void;
  getElements: (sanitizedId: string) => ElementPair | undefined;
  highlight: (sanitizedId: string) => void;
  unhighlight: (sanitizedId: string) => void;
};

const BoatHighlightContext = createContext<BoatHighlightContextValue | null>(
  null,
);

export const useBoatHighlight = () => {
  const context = use(BoatHighlightContext);
  if (!context) {
    throw new Error(
      "useBoatHighlight must be used within a BoatHighlightProvider",
    );
  }

  return context;
};

export const BoatHighlightProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const registry = useRef(new Map<string, ElementPair>());

  const register = useCallback(
    (
      sanitizedId: string,
      location: "table" | "list",
      el: HTMLButtonElement | null,
    ) => {
      const existing = registry.current.get(sanitizedId) ?? {
        table: null,
        list: null,
      };
      existing[location] = el;
      registry.current.set(sanitizedId, existing);
    },
    [],
  );

  const getElements = useCallback((sanitizedId: string) => {
    return registry.current.get(sanitizedId);
  }, []);

  const highlight = useCallback((sanitizedId: string) => {
    const pair = registry.current.get(sanitizedId);
    if (!pair) return;
    pair.table?.classList.add("ring-2");
    pair.list?.classList.add("ring-2");
  }, []);

  const unhighlight = useCallback((sanitizedId: string) => {
    const pair = registry.current.get(sanitizedId);
    if (!pair) return;
    pair.table?.classList.remove("ring-2");
    pair.list?.classList.remove("ring-2");
  }, []);

  const value = useMemo(
    () => ({ register, getElements, highlight, unhighlight }),
    [register, getElements, highlight, unhighlight],
  );

  return <BoatHighlightContext value={value}>{children}</BoatHighlightContext>;
};
