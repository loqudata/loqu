# Typesense Loader

This tool reads the JSON files, converts them to a structure that Typesense will accept, and puts them into the Typesense collection.

Fist run
Started: `2021/04/03 20:47:08`
Ended `2021/04/03 20:52:27`
Time ~ 5:30

Typesense says `num_documents` is 15693.

That's 15693 / 22742 on disk.

This is because of issues like `2021/04/03 20:52:19 json: cannot unmarshal array into Go struct field Dataset.dimensions_values_labels of type map[string]string`.

```
2021/04/03 20:47:52 json: cannot unmarshal array into Go struct field Dataset.dimensions_values_labels of type map[string]string
2021/04/03 20:47:52 Submitted dataset BACI_HS17
2021/04/03 20:47:52 json: cannot unmarshal array into Go struct field Dataset.dimensions_values_labels of type map[string]string
```

^ help for debugging

## TODOs

- Increase Performance
    - Batch requests -> do several (40) conversions at once, accumulate in list, then make request to Typesense
    - Disable logging, or decrease to every 100 or 1,000 submitted, so it doesn't take CPU
- Fix the issues that prevent all datasets from being submitted.