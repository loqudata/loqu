import { DuckDBSingleton } from "./init";

import SqlString from "sqlstring";
import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { arrowToJSON } from "features/sqlEditor/services/arrowToJSON";
import { some } from "lodash";

export const escapeString = SqlString.escape


export async function getTables(connDB?: AsyncDuckDBConnection) {
  const res = await query(`SELECT * FROM information_schema.tables;`, connDB)
  const fields = arrowToJSON(res as any)// as DuckDBField[];
  return fields;
}

export async function loadCSVFile(file: File, tableName: string) {
  const globalDB = await DuckDBSingleton.getInstance();
  const connDB = await globalDB.connect();

  const tables = await getTables(connDB)
  console.log(tables);
  if (some(tables, (table) => table.table_name == tableName)) {
    console.warn(`File must have been loaded before because a table with the same name "${tableName}" exists.`);
    return
  }
  

  await globalDB.registerFileHandle(
    file.name,
    file
    // "http://localhost:8080/small.csv"
  );
  
  //SqlString adds the quotes for us
  const tbQuery = `CREATE TABLE ${SqlString.escape(tableName)} AS SELECT * FROM read_csv_auto(${SqlString.escape(file.name)}, SAMPLE_SIZE=-1);`
  console.log(tbQuery);
  
  await connDB.query(
    tbQuery
  );
}

export async function query(query: string, connDB?: AsyncDuckDBConnection) {
  if (!connDB) {
    const globalDB = await DuckDBSingleton.getInstance();
    connDB = await globalDB.connect();
  }

  const result = await connDB.query(query);
  
  console.log(`Query resulted in ${result.numCols} cols, ${result.length} rows`); 

  return result
}
