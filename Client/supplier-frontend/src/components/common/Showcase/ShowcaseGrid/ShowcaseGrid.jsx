import styles from "./ShowcaseGrid.module.css";
import ShowcaseHeader from "../ShowcaseHeader/ShowcaseHeader";
import ShowcaseContent from "../ShowcaseContent/ShowcaseContent";
import classNames from "classnames";
import { memo } from "react";

function ShowcaseGrid({
  customClass,
  showShowcaseHeader = true,
  showcaseHeaderProps,
  showcaseContentProps,
}) {
  return (
    <section
      className={classNames(`${styles.showcaseGrid} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      {showShowcaseHeader && <ShowcaseHeader {...showcaseHeaderProps} />}
      <ShowcaseContent {...showcaseContentProps} />
    </section>
  );
}

export default memo(ShowcaseGrid);
