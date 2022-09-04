import { FieldSchema } from "compassql/build/src/schema";
import { FormState } from "models/chartEditor";
import { FieldDef, isFieldDef } from "vega-lite/build/src/channeldef";
import { TopLevelSpec } from "vega-lite/build/src/spec";

function createField(field: any, fs: FieldSchema[]) {
  // FieldDef<string>
  
  if (!field || !isFieldDef(field)) return;

  const f = fs.filter((c) => c.name == field.field)[0];
  if (!f) {
    console.warn("No field found in schema for", field);
    return field;
  }
  return Object.assign({}, field, {
    type: f.vlType //typeToVega(f.type),
  });
}

export function createSpec(f: FormState & {data: any, fieldSchema: FieldSchema[]}): TopLevelSpec {
  if (!f) return;
  const s = {
    $schema:
      "https://vega.github.io/schema/vega-lite/v5.json",
    data: f.data,
    mark: {
      type: f.mark,
      tooltip: f.tooltip.enabled
        ? f.tooltip.allFields
          ? { content: "data" as "data" }
          : true
        : false,
    },
    encoding: {
      x: createField(f.x, f.fieldSchema),
      y: createField(f.y, f.fieldSchema),
      color: createField(f.color, f.fieldSchema),
      size: createField(f.size, f.fieldSchema),
      shape: createField(f.shape, f.fieldSchema),
    },
  };
  return s;
}
