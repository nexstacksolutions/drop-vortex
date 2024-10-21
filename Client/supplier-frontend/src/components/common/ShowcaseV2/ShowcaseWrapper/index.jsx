import { memo } from "react";
import classNames from "classnames";
import styles from "./index.module.css";

function ShowcaseWrapper({
  wrapContent,
  customClass,
  ShowcaseContainer,
  showcaseContainerProps,
}) {
  return (
    <div
      className={classNames(`flex justify-between align-start`, {
        [styles.showcaseWrapper]: wrapContent,
        [styles.showcaseContent]: !wrapContent,
        [customClass]: customClass,
      })}
    >
      <ShowcaseContainer {...showcaseContainerProps} />
    </div>
  );
}

export default memo(ShowcaseWrapper);
