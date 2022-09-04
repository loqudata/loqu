# Loqu API


This simple Node.JS/Express API provides a restricted API surface area for clients, which potentially allows better caching.

Several of the API methods are implemented with SPARQL `SELECT` but probably should be `CONSTRUCT` so the results are RDF (JSON-LD).

I might replace this entirely with a GraphQL-LD based API, or just a public SPARQL endpoint.

## Endpoints

`/version`
`/countries`
`/countries/:iso`
`/countries/:iso/datasets`
`/entity/:iri/datasets`

## Deployment

A docker container is provided. 

Build: `docker build . -t loqu-api`

You must pass the `LOQU_SPARQL_ENDPOINT`, otherwise the container will have no connection to the SPARQL service, and will throw an error.

You can pass the `PORT` environment variable to have the service listen there.

You should run with:

```
docker run --init -p 7000:7000 -e LOQU_SPARQL_ENDPOINT=$ENDPOINT loqu-api
```

(init seems to be required)

Or inside a Docker Compose config.