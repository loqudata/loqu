const wd2n = (w) => parseInt(w.substr(1, 100));

export const sortByWikidataID = (a, b) => {
  if (a.wikidataID && b.wikidataID) {
    return wd2n(a.wikidataID) < wd2n(b.wikidataID) ? -1 : 1;
  }
  return 0;
};
