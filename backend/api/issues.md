
## MediaWiki User-Agent

Logs:
```
Listening on 7000
Listening on 7000
/app/node_modules/sparql-http-client/lib/checkResponse.js:6
  const err = new Error(res.statusText)
              ^

Error: Scripted requests from your IP have been blocked, please see https://meta.wikimedia.org/wiki/User-Agent_policy. In case of further questions, please contact noc@wikimedia.org.
    at checkResponse (/app/node_modules/sparql-http-client/lib/checkResponse.js:6:15)
    at ParsingQuery.select (/app/node_modules/sparql-http-client/StreamQuery.js:73:5)
    at processTicksAndRejections (node:internal/process/task_queues:94:5)
    at async ParsingQuery.select (/app/node_modules/sparql-http-client/ParsingQuery.js:41:20) {
  status: 429
}
```

1. Should provide a descriptive User-Agent
2. Should wrap in try-catch so an error isn't fatal
3. Should investigate caching WikiData responses