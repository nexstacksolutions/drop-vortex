/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useProductFormUI } from "../../../../contexts/ProductForm";

const useAdditionalFields = () => {
  const { variantShipping, variantValues } = useProductFormUI();

  const commonAttributes = useMemo(
    () => ({
      hideValidation: true,
      type: "number",
    }),
    []
  );

  const applyCommonAttributes = (fields) =>
    fields.map((field) => ({
      ...commonAttributes,
      ...field,
    }));

  const baseCommonFields = useMemo(
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
        suffixDisplay: { maxValue: 200 },
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

  const baseVariantFields = useMemo(() => {
    if (variantShipping && variantValues) {
      return [
        {
          fieldPath: "packageWeight.value",
          label: "Package Weight",
          groupType: "input",
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

  const commonFields = useMemo(
    () => applyCommonAttributes(baseCommonFields),
    [baseCommonFields, commonAttributes]
  );

  const variantFields = useMemo(
    () => applyCommonAttributes(baseVariantFields),
    [baseVariantFields, commonAttributes]
  );

  const additionalFields = useMemo(() => {
    const allFields = [
      ...commonFields.slice(0, 3),
      ...variantFields,
      ...commonFields.slice(3),
    ];
    return allFields;
  }, [variantFields, commonFields]);

  return { commonFields, additionalFields };
};

export default useAdditionalFields;
