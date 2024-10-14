import { memo, useMemo } from "react";
import styles from "./ProductForm.module.css";
import classNames from "classnames";
import { FaAngleDown } from "react-icons/fa6";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { useProductFormUI } from "../../../../context/ProductForm";
import { get } from "lodash";

// Memoize ShowMoreBtn component
const ShowMoreBtn = memo(
  ({
    section,
    additionalFields,
    btnText = "Show More",
    toggleAdditionalFields,
  }) => {
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
  }
);
ShowMoreBtn.displayName = "ShowMoreBtn";

// Memoize AdditionalJsx component
const AdditionalJsx = memo((props) => {
  return (
    <div className={`${styles.additionalJsx} flex align-center`}>
      <SwitchBtn {...props} />
      <p>
        Switch on if you need different dimension & weight for different product
        variants
      </p>
    </div>
  );
});
AdditionalJsx.displayName = "AdditionalJsx";

// Memoize FormSection component
function FormSection({
  title,
  message,
  children,
  sectionRef,
  customClass,
  showMoreBtnProps,
  additionalJsxProps,
}) {
  const { uiState, toggleAdditionalFields } = useProductFormUI();
  const additionalFields = get(uiState, "additionalFields");

  // Memoize additional JSX rendering
  const additionalJsx = useMemo(() => {
    if (additionalJsxProps) {
      return <AdditionalJsx {...additionalJsxProps} />;
    }
    return null;
  }, [additionalJsxProps]);

  return (
    <section
      className={classNames(styles.formSection, customClass, "flex flex-col")}
      ref={sectionRef}
    >
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {additionalJsx}
      </div>
      <div className={classNames(styles.sectionContent, "flex flex-col")}>
        {children}
      </div>
      {showMoreBtnProps && (
        <ShowMoreBtn
          {...showMoreBtnProps}
          additionalFields={additionalFields}
          toggleAdditionalFields={toggleAdditionalFields}
        />
      )}
    </section>
  );
}

export default memo(FormSection);
