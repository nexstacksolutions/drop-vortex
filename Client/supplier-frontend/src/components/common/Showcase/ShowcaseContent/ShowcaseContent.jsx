import styles from "./ShowcaseContent.module.css";
import ShowcaseWrapper from "../ShowcaseWrapper/ShowcaseWrapper";
import classNames from "classnames";

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

export default ShowcaseContent;
