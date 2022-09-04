/** Takes a file import loaded with Vite or NextJS, which have different conventions, and returns the URL pointing to the image */
export function processImportedFile(
  f: string | { url: string } | { src: string } | { default: string }
): string {
  if (typeof f == "string") {
    return f;
  } else if ("url" in f) {
    return f.url;
  } else if ("src" in f) {
    return f.src;
  } else if ("default" in f) {
    return f.default;
  }
}
