import styles from "./ShowcaseContent.module.css";
import ShowcaseWrapper from "../ShowcaseWrapper/ShowcaseWrapper";
import classNames from "classnames";

function ShowcaseContent({ showcaseContentProps }) {
  const {
    customClass,
    showcaseList,
    FeatureCard,
    wrapContent,
    featureCardProps,
    showcaseWrapperProps,
  } = showcaseContentProps || {};

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
        <FeatureCard
          cardData={showcaseList[0]}
          showcaseCardProps={featureCardProps}
        />
      )}

      <ShowcaseWrapper
        showcaseList={updatedShowcaseList}
        wrapContent={wrapContent}
        showcaseWrapperProps={showcaseWrapperProps}
      />
    </section>
  ) : (
    <ShowcaseWrapper
      showcaseList={showcaseList}
      wrapContent={wrapContent}
      showcaseWrapperProps={showcaseWrapperProps}
    />
  );
}

export default ShowcaseContent;
