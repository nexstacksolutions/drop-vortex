import styles from "./ShowcaseContent.module.css";
import { memo } from "react";
import ShowcaseWrapper from "../ShowcaseWrapper/ShowcaseWrapper";
import classNames from "classnames";

function ShowcaseContent({
  customClass,
  wrapContent = false,
  StatusSidebar,
  showcaseWrapperProps,
}) {
  return wrapContent ? (
    <section
      className={classNames(styles.showcaseContent, "flex", {
        [customClass]: customClass,
      })}
    >
      <ShowcaseWrapper wrapContent={wrapContent} {...showcaseWrapperProps} />

      {StatusSidebar && <StatusSidebar />}
    </section>
  ) : (
    <ShowcaseWrapper wrapContent={wrapContent} {...showcaseWrapperProps} />
  );
}

export default memo(ShowcaseContent);
