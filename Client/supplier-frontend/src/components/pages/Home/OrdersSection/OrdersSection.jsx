import styles from "./OrdersSection.module.css";
import ShowcaseGrid from "../../../common/Showcase/ShowcaseGrid/ShowcaseGrid";
import OrderCard from "../../../common/Showcase/ShowcaseCard/OrderCard/OrderCard";

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
