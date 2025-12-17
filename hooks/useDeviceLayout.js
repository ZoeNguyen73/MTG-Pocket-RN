import { Platform, useWindowDimensions } from "react-native";
import { useMemo } from "react";

import { getBreakpoint, getBreakpointPx } from "../utils/Breakpoints";

const useDeviceLayout = () => {
  const { width, height } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isNative = !isWeb;

  const bp = getBreakpointPx();
  const breakpoint = getBreakpoint();
  const isMobileWidth = width < bp.md; // tailwind md = 768px

  const canHover = isWeb &&
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
  
  // desktop web = wide + hover-capable
  const isDesktopWeb = isWeb && !isMobileWidth && canHover;

  // mobile web = narrow OR touch-first web
  const isMobileWeb = isWeb && (!canHover || isMobileWidth);

  // compact = native app + mobile web
  const isCompact = isNative || isMobileWeb;
  const isWide = isDesktopWeb;  

    return useMemo(
    () => ({
      // platform
      isWeb,
      isNative,

      // layout
      isCompact,
      isWide,

      // web specifics
      isDesktopWeb,
      isMobileWeb,

      // interaction
      canHover,
      isTouch: !canHover,

      // dimensions
      width,
      height,
      breakpoint,
    }),
    [isWeb, isNative, isCompact, isWide, isDesktopWeb, isMobileWeb, canHover, width, height, breakpoint]
  );

};

export default useDeviceLayout;