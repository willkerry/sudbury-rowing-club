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

const isVisibleInScrollParent = (el: HTMLElement): boolean => {
  const scrollParent = el.closest(".overflow-x-auto");
  if (!scrollParent) return true;

  const parentRect = scrollParent.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  return elRect.right > parentRect.left && elRect.left < parentRect.right;
};

export const BoatHighlightProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const registry = useRef(new Map<string, ElementPair>());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const register = useCallback(
    (
      sanitizedId: string,
      location: "table" | "list",
      el: HTMLButtonElement | null,
    ) => {
      const existing = registry.current.get(sanitizedId) ?? {
        list: null,
        table: null,
      };
      existing[location] = el;
      registry.current.set(sanitizedId, existing);
    },
    [],
  );

  const getElements = useCallback(
    (sanitizedId: string) => registry.current.get(sanitizedId),
    [],
  );

  const highlight = useCallback((sanitizedId: string) => {
    const pair = registry.current.get(sanitizedId);

    if (!pair) return;

    pair.table?.classList.add("ring-2");
    pair.list?.classList.add("ring-2");

    const { table, list } = pair;

    const wrapper = wrapperRef.current;
    const path = pathRef.current;

    if (!(table && list && wrapper && path)) return;
    if (!isVisibleInScrollParent(table)) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();

    const GAP = 3;
    const x1 = Math.round(
      tableRect.left + tableRect.width / 2 - wrapperRect.left,
    );
    const y1 = Math.round(tableRect.bottom - wrapperRect.top + GAP);
    const x2 = Math.round(
      listRect.left + listRect.width / 2 - wrapperRect.left,
    );
    const y2 = Math.round(listRect.top - wrapperRect.top - GAP);

    const dy = Math.round((y2 - y1) * 0.4);

    path.setAttribute(
      "d",
      `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`,
    );
    path.style.display = "";
  }, []);

  const unhighlight = useCallback((sanitizedId: string) => {
    const pair = registry.current.get(sanitizedId);
    if (!pair) return;
    pair.table?.classList.remove("ring-2");
    pair.list?.classList.remove("ring-2");

    const path = pathRef.current;
    if (path) {
      path.style.display = "none";
      path.removeAttribute("d");
    }
  }, []);

  const value = useMemo(
    () => ({ register, getElements, highlight, unhighlight }),
    [register, getElements, highlight, unhighlight],
  );

  return (
    <BoatHighlightContext value={value}>
      <div className="relative" ref={wrapperRef}>
        {children}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <path
            className="stroke-black"
            fill="none"
            ref={pathRef}
            strokeWidth={2}
            style={{ display: "none" }}
          />
        </svg>
      </div>
    </BoatHighlightContext>
  );
};
