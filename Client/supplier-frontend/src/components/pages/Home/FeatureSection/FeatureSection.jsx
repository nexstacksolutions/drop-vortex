import styles from "./FeatureSection.module.css";
import ShowcaseGrid from "../../../common/Showcase/ShowcaseGrid/ShowcaseGrid";
import FeatureCard from "../../../common/Showcase/ShowcaseCard/FeatureCard/FeatureCard";
import mediaExport from "../../../../assets/mediaExport/mediaExport";

function FeatureSection() {
  const { featureIcons } = mediaExport || {};

  const showcaseList = [
    {
      icon: featureIcons.icon1,
      title: "Marketing Solutions",
    },
    {
      icon: featureIcons.icon2,
      title: "Regular Voucher",
    },
    {
      icon: featureIcons.icon3,
      title: " Free Shipping",
    },
    {
      icon: featureIcons.icon4,
      title: "Education Livestream",
    },
  ];

  return (
    <ShowcaseGrid
      customClass={styles.featureSection}
      showcaseHeaderProps={{
        customClass: styles.showcaseHeader,
        showcaseName: "Popular Toolkit",
      }}
      showcaseContentProps={{
        customClass: styles.showcaseContent,
        showcaseList: showcaseList,

        showcaseWrapperProps: {
          customClass: styles.showcaseWrapper,
          ShowcaseCard: FeatureCard,

          showcaseCardProps: {
            customClass: styles.featureCard,
          },
        },
      }}
    />
  );
}

export default FeatureSection;
