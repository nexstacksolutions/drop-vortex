import { useMemo } from "react";
import { useProductFormUI } from "../../../../contexts/ProductForm";

const useAdditionalFields = () => {
  const { variantShipping, variantValues } = useProductFormUI();

  const buildField = (fieldPath, label, placeholder, options = {}) => ({
    label,
    fieldPath,
    inputProps: {
      type: "number",
      placeholder,
      ...options.inputProps,
    },
    hideValidation: true,
    ...options.extra,
  });

  const commonFields = useMemo(() => {
    const inputHeaderProps = {
      guidelinesProps: {
        instructions: [
          "Stock here refers to the total stock that seller has in the main warehouse only, including those reserved for campaigns.",
        ],
      },
    };

    return [
      buildField("pricing.original.amount", "Price", "Price"),
      buildField("pricing.special", "Special Price", "Special Price", {
        extra: {
          showMoreBtnProps: { section: "productDetails" },
          promotionDateProps: {
            label: "Promotion Date",
            type: "text",
            placeholder: "Set Promotion Date",
            disableInput: true,
            options: ["Set Date"],
          },
        },
      }),
      buildField("stock", "Stock", "Stock", { extra: { inputHeaderProps } }),
      buildField("sku", "Seller SKU", "Seller SKU", {
        inputProps: { type: "text" },
        extra: { suffixDisplay: { maxValue: 200 } },
      }),
      buildField("freeItems", "Free Items", "Free Items"),
      buildField("availability", "Availability", "Availability", {
        inputProps: { type: "switch" },
      }),
    ];
  }, []);

  const variantFields = useMemo(() => {
    if (!variantShipping || !variantValues) return [];

    return [
      buildField("packageWeight.value", "Package Weight", "0.001 - 300"),
      buildField(
        "dimensions",
        "Package Dimensions (cm): Length * Width * Height",
        "0.01 - 300",
        { extra: { groupType: "input" } }
      ),
    ];
  }, [variantShipping, variantValues]);

  const additionalFields = useMemo(
    () => [
      ...commonFields.slice(0, 3),
      ...variantFields,
      ...commonFields.slice(3),
    ],
    [commonFields, variantFields]
  );

  return { commonFields, additionalFields };
};

export default useAdditionalFields;
