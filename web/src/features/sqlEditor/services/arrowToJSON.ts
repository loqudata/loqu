import { Table } from "apache-arrow";

/** Converts an Apache Arrow table to a list of JSON objects. Take O(M x N) time, where M are rows and N are columns in the table */
export function arrowToJSON(table: Table): any {
  let result = [];
  for (let i = 0; i < table.length; i++) {
    let record = {};
    for (let j = 0; j < table.schema.fields.length; j++) {
      const field = table.schema.fields[j].name;
      record[field] = table.get(i)[field];
    }
    result.push(record);
  }
  return result;
}
