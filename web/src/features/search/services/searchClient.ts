import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const apiKey = process.env.NEXT_PUBLIC_TYPESENSE_READ_API_KEY || (import.meta as any).VITE_TYPESENSE_READ_API_KEY
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    // This is the public read-only API key
    apiKey: apiKey,
    nodes: [
      {
        host: "search.loqudata.org",
        port: "443",
        protocol: "https",
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    // queryBy: "name,description,dimension_values,dimension_labels",
    // group_by: "provider_code",
    // group_limit: 2,

    exclude_fields: "dimension_values",
  },

  collectionSpecificSearchParameters: {
    datasets_2: {
      queryBy: "name,description,portal_source",
    },
  },
});
export const searchClient = typesenseInstantsearchAdapter.searchClient;
