import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { EMAIL } from "@/lib/constants";

export const DisabledOverlay = ({ form }: { form: ReactNode }) => (
  <div className="relative">
    <div className="absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="flex items-center gap-2 font-semibold text-gray-600 text-lg">
        <AlertCircle className="text-yellow-500" />
        Contact form temporarily disabled
      </p>
      <div className="prose">
        <p>
          Contact us on <Obfuscate email={EMAIL} /> instead.
        </p>
      </div>
    </div>
    <div className="select-none blur-[2px]">{form}</div>
  </div>
);
