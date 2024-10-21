import styles from "./index.module.css";
import ShowcaseGrid from "../../../../components/common/Showcase/ShowcaseGrid";
import EduCard from "../../../../components/common/Showcase/ShowcaseCard/EduCard";
import { TbReload } from "react-icons/tb";

function VortexAcademy() {
  const showcaseList = [
    {
      category: "Policies & Guidelines",
      cardTitle: "Vortex Marketing Solutions | Terms and Conditions",
      cardImage: "/images/academy/image-1.webp",
      cardViews: "12,000",
    },
    {
      category: "Listing Products",
      cardTitle: "FBD: Creating An Outbound Order",
      cardImage: "/images/academy/image-2.webp",
      cardViews: "8,000",
    },
    {
      category: "Listing Products",
      cardTitle: "FBD: Creating an Inbound Order",
      cardImage: "/images/academy/image-3.webp",
      cardViews: "5,000",
    },
    {
      category: "Listing Products",
      cardTitle: "Vortex Image Guidelines",
      cardImage: "/images/academy/image-4.webp",
      cardViews: "3,000",
    },
  ];

  return (
    <ShowcaseGrid
      customClass={styles.vortexAcademy}
      showcaseHeaderProps={{
        customClass: styles.showcaseHeader,
        showcaseName: "Vortex University",
        showOptBtn: true,

        optBtnProps: {
          customClass: styles.optBtn,
          icon: <TbReload />,
          btnText: "Load New Recommendation",
        },
      }}
      showcaseContentProps={{
        customClass: styles.showcaseContent,
        showcaseList: showcaseList,

        showcaseWrapperProps: {
          customClass: styles.showcaseWrapper,
          ShowcaseCard: EduCard,

          showcaseCardProps: {
            customClass: styles.eduCard,
          },
        },
      }}
    />
  );
}

export default VortexAcademy;
