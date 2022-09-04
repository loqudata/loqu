## ReactPreview

```
error loading dynamically imported module
```
That's all. And it's even on components that are just display like AboutPage

```
GEThttp://localhost:8120/preview/src/*/models
[HTTP/1.1 404 Not Found 8ms]

Loading module from “http://localhost:8120/preview/src/*/models” was blocked because of a disallowed MIME type (“text/html”).
preview
Loading failed for the module with source “http://localhost:8120/preview/src/*/models”. preview:15:1
Loading failed for the module with source “http://localhost:8120/preview/src/queries/index.ts”. preview:15:1
Loading failed for the module with source “http://localhost:8120/preview/src/selectors/index.ts”. preview:15:1
TypeError: error loading dynamically imported module
```

