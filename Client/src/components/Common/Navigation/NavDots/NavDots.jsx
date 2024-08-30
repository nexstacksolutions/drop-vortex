import styles from "./NavDots.module.css";
import classNames from "classnames";

function NavDots({ cardData, activeImageIndex, customClass }) {
  const { imageUrls } = cardData;

  return (
    <div className={`${styles.navDots} ${customClass} flex flex-center`}>
      {imageUrls.map((_, index) => (
        <button
          key={index}
          className={classNames(styles.navDot, {
            [styles.active]: index === activeImageIndex,
          })}
        />
      ))}
    </div>
  );
}

export default NavDots;
