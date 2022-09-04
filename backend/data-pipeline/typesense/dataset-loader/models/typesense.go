package models

type TypeSenseModel struct {
	// Currently, this will just be the order in which the
	// files were read. This is not deterministic, so we should at some point
	// write a hash or index from the Provider/Dataset code to an integer
	// This allows updating the records
	Index uint64 `json:"idx"`

	// TODO: maybe add a Updated field that is a Unix timestamp
	// of when last updated, as an integer could be sorting field

	// faceted
	ProviderCode string   `json:"provider_code"`
	Code         string   `json:"code"`
	Dimensions   []string `json:"dimensions"`

	// nonfaceted
	ProviderName string  `json:"provider_name"`
	Name         string  `json:"name"`
	Description  *string `json:"description,omitempty"`

	// For all the following, we take the values of the maps,
	// e.g. the human readable names. Theses have spaces
	// and should be easier to search for.

	// For dimensions we are including the actual keys (see array above)
	// Attributes are probably less important

	DimensionLabels []string `json:"dimension_labels"`
	DimensionValues []string `json:"dimension_values"`

	// e.g. [Percent] (no PCT?)
	AttributeLabels []string `json:"attribute_labels"`
	// e.g. [Unit] (does this mean no UnitCode)
	AttributeValues []string `json:"attribute_values"`
}
