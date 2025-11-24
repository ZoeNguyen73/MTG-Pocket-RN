import tailwindConfig from "../tailwind.config";

export const getFonts = () => {
  return {
    sans: tailwindConfig.theme.fontFamily.sans[0],
    sansLight: tailwindConfig.theme.fontFamily["sans-light"][0],
    sansSemibold: tailwindConfig.theme.fontFamily["sans-semibold"][0],
    sansBold: tailwindConfig.theme.fontFamily["sans-bold"][0],
    sansItalic: tailwindConfig.theme.fontFamily["sans-italic"][0],
    sansLightItalic: tailwindConfig.theme.fontFamily["sans-light-italic"][0],
    sansSemiboldItalic: tailwindConfig.theme.fontFamily["sans-semibold-italic"][0],
    sansBoldItalic: tailwindConfig.theme.fontFamily["sans-bold-italic"][0],
    serif: tailwindConfig.theme.fontFamily["serif"][0],
    serifSemibold: tailwindConfig.theme.fontFamily["serif-semibold"][0],
    serifBold: tailwindConfig.theme.fontFamily["serif-bold"][0],
    serifBlack: tailwindConfig.theme.fontFamily["serif-black"][0],
    mono: tailwindConfig.theme.fontFamily["mono"][0],
    monoLight: tailwindConfig.theme.fontFamily["mono-light"][0],
    monoSemibold: tailwindConfig.theme.fontFamily["mono-semibold"][0],
    monoBold: tailwindConfig.theme.fontFamily["mono-bold"][0],
    monoBlack: tailwindConfig.theme.fontFamily["mono-black"][0],
  }
};