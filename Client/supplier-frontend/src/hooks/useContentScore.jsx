import { get } from "lodash";
import { useState, useEffect, useCallback } from "react";

const useContentScore = (formState, emptyFields, validateField) => {
  const [contentScore, setContentScore] = useState(0);

  const isFieldEmpty = useCallback(
    async (fieldPath) => {
      return validateField(formState, fieldPath, null, false);
    },
    [formState, validateField]
  );

  // Calculate the base score
  const calculateBaseScore = (totalFields, filledFields) => {
    return Math.round((filledFields / totalFields) * 75);
  };

  const calculateAdditionalScore = (formState, emptyFields) => {
    let additionalScore = 0;

    if (emptyFields.basicInfo) {
      const productImages = get(formState, "basicInfo.media.productImages");
      if (productImages.length > 2) additionalScore += 10;
    }

    if (emptyFields.description) {
      const descriptionMain = get(formState, "description.main");
      if (descriptionMain.length > 40) additionalScore += 10;
      if (descriptionMain.includes("<img")) additionalScore += 5;
    }

    return additionalScore;
  };

  // Main score calculation
  const calculateScore = useCallback(
    (emptyFields) => {
      let totalFields = 0;
      let filledFields = 0;

      for (const section in emptyFields) {
        const sectionFields = emptyFields[section];
        totalFields += Object.keys(sectionFields).length;
        filledFields += Object.values(sectionFields).filter(
          (status) => !status
        ).length;
      }

      const baseScore = calculateBaseScore(totalFields, filledFields);
      const additionalScore = calculateAdditionalScore(formState, emptyFields);
      return Math.min(baseScore + additionalScore, 100);
    },
    [formState]
  );

  // Get the empty fields and update the content score
  useEffect(() => {
    const fetchEmptyFields = async () => {
      const groupedFields = {};
      const firstLevelKeys = Object.keys(formState);

      for (const field of emptyFields) {
        const [firstKey] = field.split(".");
        const fieldStatus = await isFieldEmpty(field);
        if (firstLevelKeys.includes(firstKey)) {
          if (!groupedFields[firstKey]) groupedFields[firstKey] = {};
          groupedFields[firstKey][field] = fieldStatus;
        }
      }

      setContentScore(calculateScore(groupedFields));
    };

    fetchEmptyFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, isFieldEmpty, calculateScore]);

  // Return the necessary functions and score
  return { contentScore, isFieldEmpty };
};

export default useContentScore;
