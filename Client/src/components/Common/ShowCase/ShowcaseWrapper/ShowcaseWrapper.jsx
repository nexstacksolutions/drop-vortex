import { useCallback, useRef } from "react";
import styles from "./ShowcaseWrapper.module.css";
import NavBtns from "../../Navigation/NavBtns/NavBtns";
import classNames from "classnames";

function ShowcaseWrapper({ showcaseList, wrapContent, showcaseWrapperProps }) {
  const { customClass, ShowcaseCard, FeatureBannerV2, showcaseCardProps } =
    showcaseWrapperProps || {};
  const containerRef = useRef(null);

  const handleNext = useCallback(() => {
    const containerWidth = containerRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.18;
    containerRef.current.scrollLeft += scrollAmount;
  }, []);

  const handlePrev = useCallback(() => {
    const containerWidth = containerRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.18;
    containerRef.current.scrollLeft -= scrollAmount;
  }, []);

  return (
    <div
      className={classNames(`flex justify-between align-start`, {
        [styles.showcaseWrapper]: wrapContent,
        [styles.showcaseContent]: !wrapContent,
        [customClass]: customClass,
      })}
      ref={containerRef}
    >
      {FeatureBannerV2 && <FeatureBannerV2 />}

      {showcaseList?.map((item, index) => (
        <ShowcaseCard
          key={index}
          cardData={item}
          showcaseCardProps={showcaseCardProps}
        />
      ))}
      {showcaseList?.length > 5 && (
        <NavBtns handleNext={handleNext} handlePrev={handlePrev} />
      )}
    </div>
  );
}

export default ShowcaseWrapper;
