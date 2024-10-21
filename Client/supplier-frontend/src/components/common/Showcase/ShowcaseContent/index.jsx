import styles from "./index.module.css";
import ShowcaseWrapper from "../ShowcaseWrapper";
import classNames from "classnames";
import { memo } from "react";

function ShowcaseContent({
  customClass,
  showcaseList,
  wrapContent = false,
  showcaseWrapperProps,
}) {
  return wrapContent ? (
    <div
      className={classNames(styles.showcaseContent, {
        [customClass]: customClass,
      })}
    >
      <ShowcaseWrapper
        wrapContent={wrapContent}
        showcaseList={showcaseList}
        {...showcaseWrapperProps}
      />
    </div>
  ) : (
    <ShowcaseWrapper
      wrapContent={wrapContent}
      showcaseList={showcaseList}
      {...showcaseWrapperProps}
    />
  );
}

export default memo(ShowcaseContent);
