# Contributing

## Setup guide


### Install dependencies

I use pnpm. The repo should work with other package managers like yarn or npm, but it hasn't been tested. I think npm didn't work once.

In the project folder, run the following commands, which install pnpm, install the dependencies of this project, and then start the development server:

```
npm i -g pnpm

pnpm install

pnpm run dev
```

### Setup required API keys

Currently, the Typesense key is the only one required, needed for the `/search` page.

Copy the `.env` file to `.env.local` so it won't be tracked by Git and accidentally committed.

Then put the Typesense API key after the `=`. Restart the dev server.

## Conventional Commits

`<type>(<optional scope>): <subject>`

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

### Scope

These are fluid and probably will change.

- **search** - Search page
- **home** - Home page
- **workspace** - Workspace
- **chart** - Main chart editor and view
- **recs** - Recommendation generation or plotting
- **data** - data loading interface, from file
- **<socrata,dbnomics,ckan>** - data loading related to specific data catalog
- **sql** - SQL editor (code & visual)
- **query** - Querying duckdb via sql, Vega aggregation and CompasSQL statistics SQL generation 

### Subject (commit message)

Use the imperative, present tense: "change" not "changed" nor "changes"

See examples: https://www.conventionalcommits.org/en/v1.0.0/#examples

Ideally, you'll be implementing/fixing something in [the TODOs](./z-docs/todos.md), and you can just copy and modify the TODO description.