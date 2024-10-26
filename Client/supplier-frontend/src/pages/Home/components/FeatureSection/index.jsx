import styles from "./index.module.css";
import ShowcaseGrid from "../../../../components/common/Showcase/ShowcaseGrid";
import FeatureCard from "../../../../components/common/Showcase/ShowcaseCard/FeatureCard";
import useMedia from "../../../../hooks/useMedia";

function FeatureSection() {
  const { FeatureIcon1, FeatureIcon2, FeatureIcon3, FeatureIcon4 } = useMedia();
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
