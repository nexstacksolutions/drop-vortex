import styles from "./ProductForm.module.css";
import classNames from "classnames";
import { memo } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { useProductFormUI } from "../../../../context/ProductForm";

const ShowMoreBtn = memo(({ section, btnText = "Show More" }) => {
  const { additionalFields, toggleAdditionalFields } = useProductFormUI();

  return (
    <button
      type="button"
      onClick={() => toggleAdditionalFields(section)}
      className={classNames(styles.showMoreBtn, {
        [styles.showMoreBtnActive]: additionalFields[section],
      })}
    >
      <span> {!additionalFields[section] ? btnText : "Show Less"}</span>
      <FaAngleDown />
    </button>
  );
});
ShowMoreBtn.displayName = "ShowMoreBtn";

export { ShowMoreBtn };
