import styles from "./FeatureSection.module.css";
import classNames from "classnames";
import FeatureBanner from "../../../Common/ShowCase/ShowcaseBanner/FeatureBanner/FeatureBanner";

function FeatureSection({ showcaseList, customClass }) {
  return (
    <section
      className={classNames(
        `${styles.featureSection} flex justify-between align-start`,
        {
          [customClass]: customClass,
        }
      )}
    >
      {showcaseList.map((item, index) => (
        <FeatureBanner key={index} cardData={item} />
      ))}
    </section>
  );
}

export default FeatureSection;
