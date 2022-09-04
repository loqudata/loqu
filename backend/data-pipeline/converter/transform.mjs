import jsont from "json-transforms"

const BASE_URL = "https://loqudata.org/"

// Should be array of dimension strings
// function mapDimensionOrder(dimensions) {
//   return dimensions.map((v, i) => ({
//     "@id": AGENCY_BASE + `dimensions/${v}`,
//     "qb:order": i,
//   }))
// }

export function transformDataStructure(input) {
  const agency = input.provider_code
  const dataset = input.code
  const AGENCY_BASE = BASE_URL + agency + "/"
  const DATASET_BASE = BASE_URL + agency + "/" + dataset + "/"
  const stages = [
    jsont.pathRule(".code", (d) =>
      Object.assign(d.context, {
        "@id": DATASET_BASE + "structure",
        "@type": "qb:DataStructureDefinition",
      })
    ),
    jsont.pathRule(".provider_code", (d) =>
      Object.assign(d.context, {
        "dv:provider": {
          "@id": BASE_URL + agency,
          "skos:notation": agency,
          ...(d.context.provider_name
            ? { "rdfs:label": d.context.provider_name }
            : {}),
        },
        provider_code: undefined,
        provider_name: undefined,
      })
    ),
    // These next two overlap significantly.
    // We could thus put the codeList and rdfs:range in either one
    jsont.pathRule(".dimensions_codes_order", (d) =>
      Object.assign(d.context, {
        dimensions_codes_order: (Array.isArray(d.match)
          ? d.match
          : [d.match]
        ).map((v, i) => ({
          "@id": DATASET_BASE + `component/dimension/${v}`,
          "@type": "qb:ComponentSpecification",
          "qb:order": i,
          "qb:dimension": DATASET_BASE + `dimension/${v}`,
        })),
      })
    ),
    jsont.pathRule(".dimensions_labels", (d) =>
      Object.assign(d.context, {
        dimensions_labels: Object.entries(d.match).map(([k, v]) => ({
          "@id": DATASET_BASE + `dimension/${k}`,
          "@type": ["qb:DimensionProperty", "rdf:Property"],
          "qb:codeList": DATASET_BASE + `code/${k}`,
          "rdfs:range": DATASET_BASE + `class/${k}`,
          "rdfs:label": v,
        })),
      })
    ),
    jsont.pathRule(".dimensions_values_labels", (d) =>
      Object.assign(d.context, {
        codeLists: Object.entries(d.match).map(([k, v]) => ({
          "@id": DATASET_BASE + `code/${k}`,
          "@type": "skos:ConceptScheme",
          "skos:notation": k,
          // We'll do a reverse on skos:topConceptOf and skos:inScheme for this property
          entries: Object.entries(v).map(([a, b]) => ({
            "@id": DATASET_BASE + `code/${k}/${a}`,
            "@type": "skos:Concept",
            "skos:prefLabel": b,
            "skos:notation": a,
          })),
          codeListInstanceClass: {
            "@id": DATASET_BASE + `class/${k}`,
            "@type": ["rdfs:Class", "owl:Class"],
            "rdfs:subClassOf": "skos:Concept",
            "rdfs:label": `Code list class for ${k}`,
          },
        })),
        dimensions_values_labels: undefined,
      })
    ),
    // Actually this caused CPU to ballon, so disable
    // jsont.pathRule('.."@id"', (d) => {
    //   // console.log(JSON.stringify(d, undefined, 4));
    //   const r = /['<>" {}|\\^`']/

    //   if (r.test(d.match)) {
    //     throw new Error(
    //       `@id contained invalid value ${JSON.stringify(
    //         d.match,
    //         undefined,
    //         4
    //       )}`
    //     )
    //   }
    //   return d.context
    // }),
  ]

  let transformed = input
  for (let rules of stages.map((s) => {
    let b = s
    if (!Array.isArray(s)) {
      b = [s]
    }
    return [...b, jsont.identity]
  })) {
    transformed = jsont.transform(transformed, rules)
  }
  let codeLists = transformed.codeLists
  delete transformed.codeLists

  let dimensions_labels = transformed.dimensions_labels
  delete transformed.dimensions_labels

  // This happened for CEPII and NBS.
  if (!Array.isArray(codeLists)) {
    // console.log("No codeLists for:", dataset)
    codeLists = []
  }
  if (!Array.isArray(dimensions_labels)) {
    // console.log("No dimensions_labels for:", dataset)
    dimensions_labels = []
  }
  return [transformed, ...dimensions_labels, ...codeLists]
  // console.log(transformed);
  // return transformed;
}
