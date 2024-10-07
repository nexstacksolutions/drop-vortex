import { useState } from "react";
import ProductFormTips from "../api/ProductFormTips.json";

const defaultGuideContent = {
  title: "Tips",
  content:
    "Please ensure to upload product images, fill in the product name, and select the correct category to publish your product.",
};

const useFormGuide = () => {
  const [guideContent, setGuideContent] = useState(defaultGuideContent);

  const updateGuideContent = (name, title) => {
    const updatedTips = ProductFormTips[name] || {};

    setGuideContent({
      title,
      content: updatedTips.content || defaultGuideContent.content,
    });
  };

  return { guideContent, updateGuideContent };
};

export default useFormGuide;
