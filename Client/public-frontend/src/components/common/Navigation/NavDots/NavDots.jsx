import styles from "./NavDots.module.css";
import classNames from "classnames";

function NavDots({ imageUrls, activeImageIndex, customClass }) {
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
