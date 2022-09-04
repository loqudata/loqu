export interface Dataset {
  idx: number;
  code: string;
  name: string;
  description: string;

  provider_code: string;
  provider_name: string;

  dimensions: string[];

  dimension_labels: string[];
  attribute_labels: string[];
  attribute_values: string[];
}

export interface NormalDataset {
  id: string;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;
  update_frequency: string;
  formats: string[];
  portal_source: string;
  portal_type: string;
}
