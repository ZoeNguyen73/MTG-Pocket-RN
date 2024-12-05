import tailwindConfig from "../tailwind.config";

export const getBreakpoint = (width) => {

  const breakpoints = Object.fromEntries(
    Object.entries(tailwindConfig.theme.screens).map(([key, value]) => [
      key,
      parseInt(value, 10) // convert breakpoints in screens to number
    ])
  );
  
  if (width < breakpoints.sm) return "sm";
  if (width < breakpoints.md) return "md";
  if (width < breakpoints.lg) return "lg";
  if (width < breakpoints.xl) return "xl";
  return "2xl";
};