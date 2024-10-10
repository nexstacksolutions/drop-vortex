const useAdditionalFields = (variantShipping, hasVariationRows) => {
  const commonAttributes = {
    hideLabel: true,
    hideValidation: true,
  };

  const commonFields = [
    {
      fieldPath: "pricing.original",
      label: "Price",
      placeholder: "Price",
    },
    {
      fieldPath: "pricing.current",
      label: "Special Price",
      placeholder: "Special Price",
    },
    {
      fieldPath: "stock",
      label: "Stock",
      placeholder: "Stock",
    },
    {
      fieldPath: "sku",
      label: "Seller SKU",
      placeholder: "Seller SKU",
      type: "text",
      maxValue: 200,
    },
    {
      fieldPath: "freeItems",
      label: "Free Items",
      placeholder: "Free Items",
    },
    {
      fieldPath: "availability",
      label: "Availability",
      placeholder: "Availability",
      type: "switch",
    },
  ];

  const variantFields =
    variantShipping && hasVariationRows
      ? [
          {
            fieldPath: "packageWeight",
            label: "Package Weight",
            placeholder: "0.001 - 300",
          },
          {
            fieldPath: "dimensions",
            label: "Package Dimensions(cm): Length * Width * Height",
            placeholder: "0.01 - 300",
          },
        ]
      : [];

  // Merge common attributes into each field
  const applyDefaults = (fields) =>
    fields.map((field) => ({
      ...commonAttributes,
      ...field,
    }));

  const totalAdditionalFields = [
    ...commonFields.slice(0, 3),
    ...variantFields,
    ...commonFields.slice(3, commonFields.length),
  ];

  return applyDefaults(totalAdditionalFields);
};

export default useAdditionalFields;
