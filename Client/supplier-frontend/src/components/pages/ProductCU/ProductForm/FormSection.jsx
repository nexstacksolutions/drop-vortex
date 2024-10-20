import { memo } from "react";
import styles from "./ProductForm.module.css";
import classNames from "classnames";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { ShowMoreBtn } from "./FormUi";

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
  return (
    <section
      className={classNames(styles.formSection, customClass, "flex flex-col")}
      ref={sectionRef}
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

export default memo(FormSection);
