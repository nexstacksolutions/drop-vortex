import { useState } from "react";
import ProductFormTips from "../../../api/ProductFormTips.json";

const defaultGuidance = ProductFormTips["defaultGuidance"];

const useFormGuide = () => {
  const [inputGuidance, setInputGuidance] = useState(defaultGuidance);

  const updateInputGuidance = (name, title = "Tips") => {
    const newGuidance = ProductFormTips[name] || defaultGuidance.content;

    if (inputGuidance.content !== newGuidance) {
      setInputGuidance({ title, content: newGuidance });
    }
  };

  return { inputGuidance, updateInputGuidance };
};

export default useFormGuide;
