import _ from "lodash";

import enriched from "data/enriched.json";
import { countryCodeToName } from "../utils/countryCodeToName";

import { sortByWikidataID } from "../utils/sort";

export interface DataSource {
  code: string;
  indexed_at: Date;
  name: string;
  region: string;
  normalizedRegion: string;
  slug: string;
  terms_of_use?: string;
  website: string;
  wikidataID?: string;
  description?: string;
  logoImage?: string;
  converted_at?: Date;
  created_at?: Date;
  json_data_commit_ref?: string;
}

const d = enriched as any as DataSource[];
const [wd, normal] = _.partition(d, (v) => !!v.wikidataID);

const [withImages, withoutImages] = _.partition(
  wd.filter((s) => s.wikidataID !== "Q95").sort(sortByWikidataID),
  (v) => !!v.logoImage
);

export const dataSources = [...withImages, ...withoutImages, ...normal].map(
  (d) => {
    const cname = countryCodeToName(d.region);
    if (cname != "") {
      d.normalizedRegion = cname;
    } else {
      d.normalizedRegion = d.region.toLowerCase();
    }
    return d;
  }
);
// console.log(dataSources);

// .filter((s) => !!s.logoImage)
//   .filter((s) => s.wikidataID !== "Q95")
//   .sort(sortByWikidataID)
