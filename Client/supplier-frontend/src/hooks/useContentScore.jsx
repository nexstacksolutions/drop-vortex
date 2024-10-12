import { get } from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useProductForm } from "../context/ProductForm";

const useContentScore = (formState, emptyFields, requiredFields) => {
  const [contentScore, setContentScore] = useState(0);

  const {
    uiState: { variantShipping, variantPricing },
  } = useProductForm();

  // Memoize the field check function
  const fieldEndsWithSuffix = useCallback(
    (field, suffixes) => suffixes.some((suffix) => field.endsWith(suffix)),
    []
  );

  // Memoize additional empty field suffixes based on variantShipping and variantPricing
  const additionalEmptyFieldSuffixes = useMemo(() => {
    const baseSuffixes = [
      "].stock",
      "].pricing.original",
      ...(variantShipping ? ["].dimensions", "].packageWeight"] : []),
      "shipping.dimensions.width",
      "shipping.dimensions.length",
      "shipping.dimensions.height",
    ];

    if (variantShipping) {
      baseSuffixes.push("shipping.packageWeight", "shipping.dimensions");
    }

    if (variantPricing) {
      baseSuffixes.push(
        "productDetails.pricing",
        "productDetails.stock",
        "productDetails.pricing.current",
        "productDetails.pricing.original"
      );
    }

    return baseSuffixes;
  }, [variantShipping, variantPricing]);

  // Calculate the base score
  const calculateBaseScore = useCallback(
    (totalFields, filledFields) =>
      Math.round((filledFields / totalFields) * 75),
    []
  );

  // Calculate the additional score
  const calculateAdditionalScore = useCallback((formState) => {
    let additionalScore = 0;

    const productImages = get(formState, "basicInfo.media.productImages", []);
    if (productImages.length > 2) additionalScore += 10;

    const descriptionMain = get(formState, "description.main", "");
    if (descriptionMain.length > 40) additionalScore += 10;
    if (descriptionMain.includes("<img")) additionalScore += 5;

    return additionalScore;
  }, []);

  // Filter out unnecessary empty fields
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

  // Main score calculation
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

  // Update content score on relevant changes
  useEffect(() => {
    setContentScore(calculateScore);
  }, [calculateScore]);

  return { contentScore };
};

export default useContentScore;
