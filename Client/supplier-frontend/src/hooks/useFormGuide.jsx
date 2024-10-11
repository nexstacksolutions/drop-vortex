import { useState } from "react";
import ProductFormTips from "../api/ProductFormTips.json";

const defaultContent = {
  title: "Tips",
  guide:
    "Please ensure to upload product images, fill in the product name, and select the correct category to publish your product.",
};

const useFormGuide = () => {
  const [guideContent, setGuideContent] = useState(defaultContent);

  const updateGuideContent = (name, title = "Tips") => {
    const content = ProductFormTips[name] || defaultContent.guide;
    setGuideContent({ title, content });
  };

  return { guideContent, updateGuideContent };
};

export default useFormGuide;
