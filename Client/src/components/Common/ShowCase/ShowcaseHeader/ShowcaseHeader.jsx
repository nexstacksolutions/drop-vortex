import styles from "./ShowcaseHeader.module.css";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import FilterTabs from "../../FilterTabs/FilterTabs";
import DealTimer from "../../DealTimer/DealTimer";
import classNames from "classnames";

function ShowcaseHeader({ showcaseHeaderProps }) {
  const { showcaseName, customClass, dealTimerProps, showFilterTabs } =
    showcaseHeaderProps || {};

  const { showDealTimer, endTime } = dealTimerProps || {};

  return (
    <header
      className={classNames(
        `${styles.showcaseHeader} flex justify-between align-center`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <h2>{showcaseName}</h2>
      {showDealTimer && <DealTimer endTime={endTime} />}
      {showFilterTabs ? (
        <FilterTabs />
      ) : (
        <Link className="flex-center">
          View All
          <FaArrowRightLong />
        </Link>
      )}
    </header>
  );
}

export default ShowcaseHeader;
