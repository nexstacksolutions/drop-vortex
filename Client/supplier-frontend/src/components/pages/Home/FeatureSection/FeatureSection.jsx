import styles from "./FeatureSection.module.css";
import ShowcaseGrid from "../../../common/Showcase/ShowcaseGrid/ShowcaseGrid";
import FeatureCard from "../../../common/Showcase/ShowcaseCard/FeatureCard/FeatureCard";
import useMediaExport from "../../../../hooks/global/useMediaExport";

function FeatureSection() {
  const { FeatureIcon1, FeatureIcon2, FeatureIcon3, FeatureIcon4 } =
    useMediaExport();
  const showcaseList = [
    {
      Icon: FeatureIcon1,
      title: "Marketing Solutions",
    },
    {
      Icon: FeatureIcon2,
      title: "Regular Voucher",
    },
    {
      Icon: FeatureIcon3,
      title: " Free Shipping",
    },
    {
      Icon: FeatureIcon4,
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
