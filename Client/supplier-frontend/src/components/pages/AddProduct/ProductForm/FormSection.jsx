import styles from "./ProductForm.module.css";
import classNames from "classnames";
import { FaAngleDown } from "react-icons/fa6";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { useProductForm } from "../../../../context/ProductForm";
import { get } from "lodash";

function ShowMoreBtn({ btnText = "Show More", section }) {
  const { state, toggleAdditionalFields } = useProductForm();
  const additionalFields = get(state, "uiState.additionalFields");

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

function AdditionalJsx(props) {
  return (
    <div className={`${styles.additionalJsx} flex align-center`}>
      <SwitchBtn {...props} />
      <p>
        Switch on if you need different dimension & weight for different product
        variants
      </p>
    </div>
  );
}

function FormSection({
  title,
  message,
  children,
  customClass,
  showMoreBtnProps,
  additionalJsxProps,
}) {
  return (
    <section
      className={classNames(styles.formSection, customClass, "flex flex-col")}
    >
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {additionalJsxProps && <AdditionalJsx {...additionalJsxProps} />}
      </div>
      <div className={classNames(styles.sectionContent, "flex flex-col")}>
        {children}
      </div>
      {showMoreBtnProps && <ShowMoreBtn {...showMoreBtnProps} />}
    </section>
  );
}

export default FormSection;
