import styles from "./ShowcaseContent.module.css";
import ShowcaseWrapper from "../ShowcaseWrapper/ShowcaseWrapper";
import classNames from "classnames";

function ShowcaseContent({ showcaseContentProps, customClass }) {
  const {
    showcaseList,
    ShowcaseCard,
    FeatureCard,
    wrapContent,
    FeatureBanner,
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
          customClass={styles.featureCard}
        />
      )}

      <ShowcaseWrapper
        ShowcaseCard={ShowcaseCard}
        showcaseList={updatedShowcaseList}
        customClass={styles.showcaseWrapper}
        wrapContent={wrapContent}
        showcaseCardProps={{ customClass: styles.productCardV2 }}
      />
    </section>
  ) : (
    <ShowcaseWrapper
      ShowcaseCard={ShowcaseCard}
      showcaseList={showcaseList}
      FeatureBanner={FeatureBanner}
      customClass={classNames({ [styles.showcaseWrapper]: wrapContent })}
      wrapContent={wrapContent}
    />
  );
}

export default ShowcaseContent;
