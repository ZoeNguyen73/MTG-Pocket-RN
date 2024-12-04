import { breakpoints } from "../tailwind.config";

export const getBreakpoint = (width) => {
  if (width < breakpoints.sm) return "sm";
  if (width < breakpoints.md) return "md";
  if (width < breakpoints.lg) return "lg";
  if (width < breakpoints.xl) return "xl";
  return "2xl";
};