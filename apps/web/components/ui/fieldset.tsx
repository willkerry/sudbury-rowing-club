import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const Legend = forwardRef<
  HTMLLegendElement,
  ComponentPropsWithoutRef<typeof motion.legend>
>(({ children, ...props }, ref) => (
  <motion.legend layout="position" ref={ref} {...props}>
    {children}
  </motion.legend>
));

export const Fieldset = forwardRef<
  HTMLFieldSetElement,
  ComponentPropsWithoutRef<typeof motion.fieldset> & {
    legend: React.ReactNode;
    children: React.ReactNode;
  }
>(({ children, legend, className, ...props }, ref) => (
  <motion.fieldset
    layout="position"
    ref={ref}
    {...props}
    className={cn("my-12 space-y-6", className)}
  >
    <Legend>{legend}</Legend>
    {children}
  </motion.fieldset>
));
