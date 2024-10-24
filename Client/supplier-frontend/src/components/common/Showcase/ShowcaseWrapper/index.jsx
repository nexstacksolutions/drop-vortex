import classNames from "classnames";
import styles from "./index.module.css";
import { memo } from "react";

function ShowcaseWrapper({
  wrapContent,
  customClass,
  showcaseList,
  ShowcaseCard,
  showcaseCardProps,
}) {
  return (
    <div
      className={classNames(`flex justify-between align-start`, {
        [styles.showcaseWrapper]: wrapContent,
        [styles.showcaseContent]: !wrapContent,
        [customClass]: customClass,
      })}
    >
      {showcaseList?.map((item, index) => (
        <ShowcaseCard key={index} cardData={item} {...showcaseCardProps} />
      ))}
    </div>
  );
}

export default memo(ShowcaseWrapper);
