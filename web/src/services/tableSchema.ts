export interface TableSchema {
  /**
   * An `array` of Table Schema Field objects.
   */
  fields: Field[];
  foreignKeys?: TableSchemaForeignKey[];
  /**
   * Values that when encountered in the source, should be considered as `null`, 'not
   * present', or 'blank' values.
   */
  missingValues?: string[];
  /**
   * A primary key is a field name or an array of field names, whose values `MUST` uniquely
   * identify each row in the table.
   */
  primaryKey?: string[] | string;
}

/**
 * A field
 */
export interface Field {
  /**
   * A name for this field.
   */
  name: string;

  /**
   * A human-readable title.
   */
  title?: string;
  /**
   * A text description. Markdown is encouraged.
   */
  description?: string;

  type?: Type;
  /**
   * The format keyword options for `string` are `default`, `email`, `uri`, `binary`, and
   * `uuid`.
   *
   * There are no format keyword options for `number`: only `default` is allowed.
   *
   * There are no format keyword options for `integer`: only `default` is allowed.
   *
   * The format keyword options for `date` are `default`, `any`, and `{PATTERN}`.
   *
   * The format keyword options for `time` are `default`, `any`, and `{PATTERN}`.
   *
   * The format keyword options for `datetime` are `default`, `any`, and `{PATTERN}`.
   *
   * There are no format keyword options for `year`: only `default` is allowed.
   *
   * There are no format keyword options for `yearmonth`: only `default` is allowed.
   *
   * There are no format keyword options for `boolean`: only `default` is allowed.
   *
   * There are no format keyword options for `object`: only `default` is allowed.
   *
   * The format keyword options for `geopoint` are `default`,`array`, and `object`.
   *
   * The format keyword options for `geojson` are `default` and `topojson`.
   *
   * There are no format keyword options for `array`: only `default` is allowed.
   *
   * There are no format keyword options for `duration`: only `default` is allowed.
   */
  format?: any;
  /**
   * The RDF type for this field.
   */
  rdfType?: string;

  constraints?: Constraints;
  /**
   * a boolean field with a default of `true`. If `true` the physical contents of this field
   * must follow the formatting constraints already set out. If `false` the contents of this
   * field may contain leading and/or trailing non-numeric characters (which implementors MUST
   * therefore strip). The purpose of `bareNumber` is to allow publishers to publish numeric
   * data that contains trailing characters such as percentages e.g. `95%` or leading
   * characters such as currencies e.g. `€95` or `EUR 95`. Note that it is entirely up to
   * implementors what, if anything, they do with stripped text.
   */
  bareNumber?: boolean;
  /**
   * A string whose value is used to represent a decimal point within the number. The default
   * value is `.`.
   */
  decimalChar?: string;
  /**
   * A string whose value is used to group digits within the number. The default value is
   * `null`. A common value is `,` e.g. '100,000'.
   */
  groupChar?: string;
  falseValues?: string[];
  trueValues?: string[];
}

/**
 * Not all constraints are supported for each field type
 */
export interface Constraints {
  enum?: any[];
  /**
   * An integer that specifies the maximum length of a value.
   */
  maxLength?: number;
  /**
   * An integer that specifies the minimum length of a value.
   */
  minLength?: number;
  /**
   * A regular expression pattern to test each value of the property against, where a truthy
   * response indicates validity.
   */
  pattern?: string;
  /**
   * Indicates whether a property must have a value for each instance.
   */
  required?: boolean;
  /**
   * When `true`, each value for the property `MUST` be unique.
   */
  unique?: boolean;
  maximum?: number | string;
  minimum?: number | string;
}

/**
 * The type of the field
 */
export enum Type {
  Array = "array",
  Boolean = "boolean",
  Date = "date",
  Datetime = "datetime",
  Duration = "duration",
  Geojson = "geojson",
  Geopoint = "geopoint",
  Integer = "integer",
  Number = "number",
  Object = "object",
  String = "string",
  Time = "time",
  Year = "year",
  Yearmonth = "yearmonth",
}

/**
 * Table Schema Foreign Key
 */
export interface TableSchemaForeignKey {
  /**
   * Fields that make up the primary key.
   */
  fields: string[] | string;
  reference: Reference;
}

export interface Reference {
  fields: string[] | string;
  resource: string;
}
