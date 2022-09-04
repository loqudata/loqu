# Loqu

[Loqu](https://loqudata.org/) is an open source tool for data exploration and visualization on open datasets.

It aims to aggregate data from data portals (running CKAN, Socrata, etc) and other authoritative sources (e.g. central banks and national statistical agencies) via SDMX/DBNomics.

It provides search functionality, and automatically recommends visualizations based on the data. Eventually, we would like users to be able to annotate the data to improve its structure and link it to semantic web entities, so computers can better understand it.

## Screenshots

![search](web/src/assets/loqu_search.png)

![visualize](web/src/assets/loqu_visualize.png)

## Contributing

The folder structure is as follows
```
├── backend
│   ├── data-catalogs - the scrapers and conversion/normalization for CKAN and Socrata in Python, and to load their datasets into Typesense
│   ├── api - a limited API over the SPARQL database
│   └── data-pipeline - pipeline to convert DBNomics into RDF triple data, load into Virtouso triple store, and link with concepts like countries. Will probably be rewritten.
└── web
```

## License

The source code is available under the Apache 2.0 License. Data is available under the Open Database License.
