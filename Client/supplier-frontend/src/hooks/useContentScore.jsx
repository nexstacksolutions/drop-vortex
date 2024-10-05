import { get } from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";

const useContentScore = (formState, emptyFields, requiredFields) => {
  const [contentScore, setContentScore] = useState(0);

  const additionalEmptyFields = useMemo(
    () => [
      "shipping.dimensions.height",
      "shipping.dimensions.length",
      "shipping.dimensions.width",
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
      const filteredFields = {};

      Object.keys(emptyFields).forEach((field) => {
        if (
          requiredFields[field] !== undefined &&
          !additionalEmptyFields.includes(field)
        ) {
          filteredFields[field] = emptyFields[field];
        }
      });

      return filteredFields;
    },
    [additionalEmptyFields]
  );

  const filteredEmptyFields = useMemo(
    () => excludeFields(emptyFields, requiredFields),
    [emptyFields, requiredFields, excludeFields]
  );

  const calculateScore = useCallback(() => {
    let totalFields = 0;
    let filledFields = 0;

    Object.keys(filteredEmptyFields).forEach((field) => {
      totalFields++;
      if (!filteredEmptyFields[field]) filledFields++; // Counting filled fields (false means filled)
    });

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
