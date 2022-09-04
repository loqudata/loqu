import { Schema } from "compassql/build/src/schema";
import { ResultPlot } from "models/result";
import { ShelfFieldDef } from "models/shelf";
export const transformFieldDefs = (field: ShelfFieldDef): ShelfFieldDef => {
  const f = Object.assign({}, field)
  if (f.fn && f.fn.toString().toLowerCase() == "count" && f.field == "*") {
    f.field = "COUNT(*)";
  }
  return f;
};

/** Removes plots that would be problematic to chart. For example, nominal text fields that have many distinct values.
 * This would simply crowd a chart with tiny text labels */
export const filterPlots =
  (schema: Schema) =>
  (plot: ResultPlot): boolean => {
    if (!schema.fieldSchemas) {
      console.log("what", schema);
      return true;
    }
    for (let field of plot.fieldInfos) {
      const f = field.fieldDef;
      if (!(f.type == "nominal")) {
        return true;
      }

      const m = schema.fieldSchemas.find((fs) => fs.name == f.field);
      //   console.log("is nom", f, m);
      if (m.stats.distinct / m.stats.count > 0.5) {
        // console.log("too much");

        return false;
      }
    }
    return true;
  };
