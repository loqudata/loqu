// Returns a blob:// URL which points
// to a javascript file which will call
// importScripts with the given URL
export function getWorkerURL(crossOriginURL) {
  const content = `importScripts( "${crossOriginURL}" );`;
  return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
}
