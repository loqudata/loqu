# Next Generation Design

- Recommend visualizations with CompassQL
- Support larger dataset sizes with DuckDB or Apache Arrow via WebAssembly. 
  - DuckDB seems better because allows mutating the data, and has manipulation functions via SQL, which is needed for data cleaning (e.g. OpenRefine-type)
  - Investigate Vaex (or startup using it) that are creating an interface for that
- SQL code editor
  - Monaco/VSCode
    - Language Service
      - Bridge to use LS fully in Browser: https://github.com/TypeFox/monaco-languageclient/blob/master/examples/browser/src/client.ts
      - JS: https://github.com/joe-re/sql-language-server
      - Go: https://github.com/lighttiger2505/sqls
      - JS, for T-SQL: https://github.com/microsoft/vscode-mssql/tree/main/src/languageservice
    - Formatter
      - JS: https://github.com/zeroturnaround/sql-formatter
    - Highlighter
      - JS (may eventually do autocomplete): https://github.com/DTStack/monaco-sql-languages

Good examples:
- https://sqliteonline.com/ - just shows column name and type

Investigating existing repos that combine Monaco and SQL: "monaco sql" search on Github
- https://github.com/lisirrx/monaco-sql Good - uses `monaco-languageclient` and `joe-re/sql-language-server`, might support more complex stuff
- https://github.com/luobotang/monaco-sql-editor/ - very simple, custom completion logic and data structure
- https://github.com/DiscoverForever/monaco-sqlpad/blob/master/src/core/snippets.js - custom logic, vue
- https://github.com/raycursive/monaco-sql-parser/ - custom parser

Learning about Monaco Editor

- Different keybindings based on browser - e.g. in Firefox `Ctrl-K` is delete to right, in Chrome there isn't a shortcut for that command.
- Ctrl left and right works for navigation, not deleting words in Firefox. no Chrome test.


Apache Arrow Test Data:

- https://gist.githubusercontent.com/TheNeuralBit/64d8cc13050c9b5743281dcf66059de5/raw/c146baf28a8e78cfe982c6ab5015207c4cbd84e3/scrabble.arrow (43MB)
- https://gist.githubusercontent.com/domoritz/e2bb9f8d366832f4934cd0c687792b52/raw/f1cc2a9cbf47529c836ab23e8e0105c22b814c41/flights-1m.arrow (15MB)