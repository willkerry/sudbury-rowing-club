import type React from "react";
import { env } from "@/env";

export const whenEnv = <ReturnType>({
  ifPreview,
  ifProd,
  ifDev,
}: {
  ifPreview: () => ReturnType;
  ifProd: () => ReturnType;
  ifDev: () => ReturnType;
}) => {
  const normalizedEnv = env.VERCEL_ENV ?? env.NODE_ENV;

  switch (normalizedEnv) {
    case "preview":
      return ifPreview();
    case "production":
      return ifProd();
    case "development":
      return ifDev();
  }
};

type WhenEnvProps = {
  children: React.ReactNode;
};

export const WhenPreview = ({ children }: WhenEnvProps) =>
  whenEnv({
    ifPreview: () => children,
    ifProd: () => null,
    ifDev: () => null,
  });

export const WhenProd = ({ children }: WhenEnvProps) =>
  whenEnv({
    ifPreview: () => null,
    ifProd: () => children,
    ifDev: () => null,
  });

export const WhenDev = ({ children }: WhenEnvProps) =>
  whenEnv({
    ifPreview: () => null,
    ifProd: () => null,
    ifDev: () => children,
  });
