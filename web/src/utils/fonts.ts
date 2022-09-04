const makeFullFont = (font: string) =>
  `family=${font}:wght@200;300;400;500;600;700;800`;

export const commonFonts = [
  // Geometrics
  // "Rubik",
  "Manrope",
  "Poppins",
  "DM Sans",
  // more straight
  "Inter",
  // "Heebo",
  "Karla",
  "Archivo",
  "Quicksand",
  // "Arimo",
  // serifs
  "Merriweather",
];
export const makeGoogleFontsURL = (fontFamilies: string[] = commonFonts) =>
  `https://fonts.googleapis.com/css2?${makeFullFont(fontFamilies[0])}${
    fontFamilies.length > 1
      ? fontFamilies
          .slice(1)
          .map((f) => "&" + makeFullFont(f))
          .join("")
      : ""
  }&display=swap`;
