import { get } from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";

const useContentScore = (
  formState,
  emptyFields,
  requiredFields,
  variantShipping,
  variantPricing
) => {
  const [contentScore, setContentScore] = useState(0);

  const fieldEndsWithSuffix = useCallback(
    (field, suffixes) => suffixes.some((suffix) => field.endsWith(suffix)),
    []
  );

  const additionalEmptyFieldSuffixes = useMemo(() => {
    const baseSuffixes = [
      "].stock",
      "].pricing.original.amount",
      ...(variantShipping ? ["].dimensions", "].packageWeight.value"] : []),
      "shipping.dimensions.width",
      "shipping.dimensions.length",
      "shipping.dimensions.height",
    ];

    if (variantShipping) {
      baseSuffixes.push("shipping.packageWeight.value", "shipping.dimensions");
    }

    if (variantPricing) {
      baseSuffixes.push(
        "productDetails.stock",
        "productDetails.pricing.original.amount"
      );
    }

    return baseSuffixes;
  }, [variantShipping, variantPricing]);

  const calculateBaseScore = useCallback(
    (totalFields, filledFields) =>
      Math.round((filledFields / totalFields) * 75),
    []
  );

  const calculateAdditionalScore = useCallback((formState) => {
    let additionalScore = 0;

    const productImages = get(formState, "basicInfo.media.productImages", []);
    if (productImages.length > 2) additionalScore += 10;

    const descriptionMain = get(formState, "description.main", "");
    if (descriptionMain.length > 40) additionalScore += 10;
    if (descriptionMain.includes("<img")) additionalScore += 5;

    return additionalScore;
  }, []);

  const filteredEmptyFields = useMemo(() => {
    return Object.keys(emptyFields).reduce((filtered, field) => {
      const isRequired = requiredFields[field] !== undefined;
      const isAdditionalField = additionalEmptyFieldSuffixes.includes(field);
      const endsWithSuffix = fieldEndsWithSuffix(
        field,
        additionalEmptyFieldSuffixes.slice(0, variantShipping ? 4 : 2)
      );

      if ((isRequired && !isAdditionalField) || endsWithSuffix) {
        filtered[field] = emptyFields[field];
      }

      return filtered;
    }, {});
  }, [
    emptyFields,
    requiredFields,
    additionalEmptyFieldSuffixes,
    fieldEndsWithSuffix,
    variantShipping,
  ]);

  const calculateScore = useMemo(() => {
    const totalFields = Object.keys(filteredEmptyFields).length;
    const filledFields = Object.values(filteredEmptyFields).filter(
      (value) => !value
    ).length;

    const baseScore = calculateBaseScore(totalFields, filledFields);
    const additionalScore = calculateAdditionalScore(formState);

    return Math.min(baseScore + additionalScore, 100);
  }, [
    filteredEmptyFields,
    calculateBaseScore,
    calculateAdditionalScore,
    formState,
  ]);

  useEffect(() => {
    setContentScore(calculateScore);
  }, [calculateScore]);

  return { contentScore: contentScore || 0 };
};

export default useContentScore;
