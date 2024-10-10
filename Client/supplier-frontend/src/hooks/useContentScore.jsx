import { get } from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";
import useFormValidation from "./useFormValidation";

const useContentScore = (formState, emptyFields, requiredFields) => {
  const [contentScore, setContentScore] = useState(0);

  const { validateForm } = useFormValidation();

  const additionalEmptyFieldSuffixes = useMemo(
    () => [
      "shipping.dimensions.width",
      "shipping.dimensions.length",
      "shipping.dimensions.height",
      "].stock",
      "].pricing.original",
    ],
    []
  );

  const calculateBaseScore = useCallback((totalFields, filledFields) => {
    return Math.round((filledFields / totalFields) * 75);
  }, []);

  const calculateAdditionalScore = useCallback((formState) => {
    let additionalScore = 0;

    const productImages = get(formState, "basicInfo.media.productImages", []);
    if (productImages.length > 2) additionalScore += 10;

    const descriptionMain = get(formState, "description.main", "");
    if (descriptionMain.length > 40) additionalScore += 10;
    if (descriptionMain.includes("<img")) additionalScore += 5;

    return additionalScore;
  }, []);

  const excludeFields = useCallback(
    (emptyFields, requiredFields) => {
      return Object.keys(emptyFields).reduce((filteredFields, field) => {
        const endsWithAnySuffix = additionalEmptyFieldSuffixes
          .slice(3, additionalEmptyFieldSuffixes.length)
          .some((suffix) => field.endsWith(suffix));

        const isRequiredField = requiredFields[field] !== undefined;
        const isAdditionalEmptyField =
          additionalEmptyFieldSuffixes.includes(field);

        if ((isRequiredField && !isAdditionalEmptyField) || endsWithAnySuffix) {
          filteredFields[field] = emptyFields[field];
        }

        return filteredFields;
      }, {});
    },
    [additionalEmptyFieldSuffixes]
  );

  const filteredEmptyFields = useMemo(
    () => excludeFields(emptyFields, requiredFields),
    [emptyFields, requiredFields, excludeFields]
  );

  const calculateScore = useCallback(() => {
    let totalFields = 0;
    let filledFields = 0;

    for (const field in filteredEmptyFields) {
      totalFields++;
      if (!filteredEmptyFields[field]) filledFields++;
    }

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
    setContentScore(calculateScore());
  }, [formState, emptyFields, requiredFields, calculateScore]);

  return { contentScore };
};

export default useContentScore;
