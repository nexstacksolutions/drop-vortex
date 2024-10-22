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

  const buildField = (fieldPath, label, placeholder, extra = {}) => ({
    ...extra,
    fieldPath,
    inputProps: {
      type: extra.inputProps?.type || commonAttributes.type,
      placeholder,
      ...extra.inputProps,
    },
    inputHeaderProps: { ...extra.inputHeaderProps },
    hideValidation: commonAttributes.hideValidation,
    label,
  });

  const baseCommonFields = useMemo(
    () => [
      buildField("pricing.original.amount", "Price", "Price"),
      buildField("pricing.special", "Special Price", "Special Price", {
        showMoreBtnProps: { section: "productDetails" },
        promotionDateProps: {
          label: "Promotion Date",
          type: "text",
          placeholder: "Set Promotion Date",
          disableInput: true,
          options: ["Set Date"],
        },
      }),
      buildField("stock", "Stock", "Stock", {
        guidelinesProps: {
          instructions: [
            "Stock here refers to the total stock that seller has in the main warehouse only, including those reserved for campaigns.",
          ],
        },
      }),
      buildField("sku", "Seller SKU", "Seller SKU", {
        inputProps: { type: "text" },
        suffixDisplay: { maxValue: 200 },
      }),
      buildField("freeItems", "Free Items", "Free Items"),
      buildField("availability", "Availability", "Availability", {
        inputProps: { type: "switch" },
      }),
    ],
    [commonAttributes]
  );

  const baseVariantFields = useMemo(() => {
    if (variantShipping && variantValues) {
      return [
        buildField("packageWeight.value", "Package Weight", "0.001 - 300"),
        buildField(
          "dimensions",
          "Package Dimensions(cm): Length * Width * Height",
          "0.01 - 300",
          {
            groupType: "input",
          }
        ),
      ];
    }
    return [];
  }, [variantShipping, variantValues]);

  const additionalFields = useMemo(
    () => [
      ...baseCommonFields.slice(0, 3),
      ...baseVariantFields,
      ...baseCommonFields.slice(3),
    ],
    [baseCommonFields, baseVariantFields]
  );

  return { commonFields: baseCommonFields, additionalFields };
};

export default useAdditionalFields;
