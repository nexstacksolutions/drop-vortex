import styles from "./FeatureSection.module.css";
import classNames from "classnames";
import FeatureCard from "../../../Common/ShowCase/ShowcaseCard/FeatureCard/FeatureCard";

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
        <FeatureCard key={index} cardData={item} />
      ))}
    </section>
  );
}

export default FeatureSection;
