import { useMemo } from "react";
import { useProductFormUI } from "../../../../contexts/ProductForm";

const useAdditionalFields = () => {
  const { variantShipping, variantValues } = useProductFormUI();

  // Memoize the common attributes
  const commonAttributes = useMemo(
    () => ({
      hideLabel: true,
      hideValidation: true,
    }),
    []
  );

  // Memoize common fields
  const commonFields = useMemo(
    () => [
      {
        fieldPath: "pricing.original.amount",
        label: "Price",
        placeholder: "Price",
      },
      {
        fieldPath: "pricing.special",
        label: "Special Price",
        placeholder: "Special Price",
        showMoreBtnProps: { section: "productDetails" },
        promotionDateProps: {
          label: "Promotion Date",
          type: "text",
          placeholder: "Set Promotion Date",
          disableInput: true,
          options: ["Set Date"],
        },
      },
      {
        fieldPath: "stock",
        label: "Stock",
        placeholder: "Stock",
        guidelinesProps: {
          instructions: [
            "Stock here refers to the total stock that seller has in the main warehouse only, including those reserved for campaigns.",
          ],
        },
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
    ],
    []
  );

  // Memoize variant fields
  const variantFields = useMemo(() => {
    if (variantShipping && variantValues) {
      return [
        {
          fieldPath: "packageWeight.value",
          label: "Package Weight",
          placeholder: "0.001 - 300",
        },
        {
          fieldPath: "dimensions",
          label: "Package Dimensions(cm): Length * Width * Height",
          placeholder: "0.01 - 300",
        },
      ];
    }
    return [];
  }, [variantShipping, variantValues]);

  // Memoize additional fields
  const additionalFields = useMemo(() => {
    const allFields = [
      ...commonFields.slice(0, 3),
      ...variantFields,
      ...commonFields.slice(3),
    ];

    // Apply common attributes
    return allFields.map((field) => ({
      ...commonAttributes,
      ...field,
    }));
  }, [variantFields, commonFields, commonAttributes]);

  return { commonFields, additionalFields };
};

export default useAdditionalFields;
