import tailwindConfig from "../tailwind.config";

const breakpoints = Object.fromEntries(
  Object.entries(tailwindConfig.theme.screens).map(([key, value]) => [
    key,
    parseInt(value, 10) // convert breakpoints in screens to number
  ])
);

export const getBreakpoint = (width) => {
  if (width < breakpoints.sm) return "sm"; //640px
  if (width < breakpoints.md) return "md"; //768px
  if (width < breakpoints.lg) return "lg"; //1024px
  if (width < breakpoints.xl) return "xl"; //1280px
  return "2xl"; //1536px
};

export const getBreakpointPx = () => breakpoints;