import { arrowToJSON } from "features/sqlEditor/services/arrowToJSON";
import { query } from "./index";
import SqlString from "sqlstring";

// export interface DuckDBField {
//     name: string
//     type: string
// }

export interface DuckDBField {
  cid: number;
  name: string;
  type: Type;
  notnull: boolean;
  /** Default value */
  dflt_value: null;
  /** Is a primary key? */
  pk: boolean;
}

export enum Type {
  Bigint = "BIGINT",
  Double = "DOUBLE",
  Integer = "INTEGER",
  Timestamp = "TIMESTAMP",
  Varchar = "VARCHAR",
}

export const DuckDBToVegaTypes = {
  BIGINT: "quantitative",
  DOUBLE: "quantitative",
  INTEGER: "quantitative",
  DATE: "temporal",
  TIMESTAMP: "temporal",
  VARCHAR: "nominal",
};

export async function getFields(table: string) {
  const q = `PRAGMA table_info(${SqlString.escape(table)});`;
  console.log(q);

  const res = await query(q);
  const fields = arrowToJSON(res as any) as DuckDBField[];
  return fields;
}
