Let's take the example of dimensions_code_order:

We could convert to something like this:

```json
{ "dimensions_codes_order": { "industry": 0, "FREQ": 1 } }
```

Or better

```json
{ "qb:dimension": [{ "@id": "industry", "qb:order": 0 }] }
```

```json
{
  "dimensions_codes_order": {
    "@id": "qb:order",
    "@type": "@id",
    "@context": {
      "@base": "https://datavio.org/dimensions"
    }
  }
}
```


## New

Not sure what this does:
```json
{
    "qb:codeList": {
      "@type": "@id"
    },
    "qb:dimension": {
      "@type": "@id"
    },
    "rdfs:subClassOf": {
      "@type": "@id"
    },
    "rdfs:domain": {
      "@type": "@id"
    },
    "rdfs:range": {
      "@type": "@id"
    }
}
```