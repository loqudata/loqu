# Field Types

There are lots of field types. There are some from the `vega`, `compassql`, and `tableschema-js` packages.

Then I've also created the `Field` interface in `services/tableSchema` based on tableSchema specs.

We also have the `DuckDBField` type.

At the core we need a name, description, and the Vega type (nominal, quantitative, temporal)


The Table Schema spec has a `title` field in addition to `name`. That might be confusing for users to see different names, and let's encourage people to provide descriptive field names, so let's leave it as one `name`. If there is a use for it we'll revisit.

## Compassql schema

computes a bunch of summary statistics, need to do this via SQL