import styles from "./ShowcaseContent.module.css";
import ShowcaseWrapper from "../ShowcaseWrapper/ShowcaseWrapper";
import classNames from "classnames";

function ShowcaseContent({
  customClass,
  showcaseList,
  FeatureCard,
  wrapContent,
  featureCardProps,
  showcaseWrapperProps,
}) {
  const updatedShowcaseList = wrapContent
    ? showcaseList.slice(1, Math.min(7, showcaseList.length))
    : showcaseList;

  return wrapContent ? (
    <section
      className={classNames(styles.showcaseContent, {
        [customClass]: customClass,
      })}
    >
      {wrapContent && FeatureCard && (
        <FeatureCard cardData={showcaseList[0]} {...featureCardProps} />
      )}

      <ShowcaseWrapper
        showcaseList={updatedShowcaseList}
        wrapContent={wrapContent}
        {...showcaseWrapperProps}
      />
    </section>
  ) : (
    <ShowcaseWrapper
      showcaseList={showcaseList}
      wrapContent={wrapContent}
      {...showcaseWrapperProps}
    />
  );
}

export default ShowcaseContent;
