import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-displaynames/locale-data/en"; // locale-data for en

export const countryCodeToName = (code: string) => {
  //@ts-ignore
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  try {
    return regionNames.of(code);
  } catch (error) {
    // console.log(code);

    // console.warn(error);
    return "";
  }
};
