import styles from "./index.module.css";
import ShowcaseGrid from "../../../../components/common/Showcase/ShowcaseGrid";
import OrderCard from "../../../../components/common/Showcase/ShowcaseCard/OrderCard";

function OrdersSection() {
  const showcaseList = [
    {
      cardValue: 0,
      cardTitle: "Pending Orders",
    },
    {
      cardValue: 1,
      cardTitle: "Unpaid Orders",
    },
    {
      cardValue: 2,
      cardTitle: "To Be Reviewed",
    },
  ];

  return (
    <ShowcaseGrid
      customClass={styles.ordersSection}
      showcaseHeaderProps={{
        customClass: styles.showcaseHeader,
        showcaseName: "My Order",
        showOptBtn: true,

        optBtnProps: {
          customClass: styles.optBtn,
          btnText: "Submit a Claim",
          path: "/submit-claim",
        },
      }}
      showcaseContentProps={{
        customClass: styles.showcaseContent,
        showcaseList: showcaseList,

        showcaseWrapperProps: {
          customClass: styles.showcaseWrapper,
          ShowcaseCard: OrderCard,

          showcaseCardProps: {
            customClass: styles.orderCard,
          },
        },
      }}
    />
  );
}

export default OrdersSection;
