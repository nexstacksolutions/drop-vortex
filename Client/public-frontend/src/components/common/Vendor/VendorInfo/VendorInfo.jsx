import styles from "./VendorInfo.module.css";
import RatingWidget from "../../RatingWidget/RatingWidget";

function VendorInfo({ vendorName, vendorImage, averageRating, products }) {
  return (
    <div className={`${styles.vendorInfo} flex align-center`}>
      <div className={`${styles.vendorImage} flex flex-center`}>
        <img src={vendorImage} alt="" />
      </div>
      <div className={styles.vendorDetails}>
        <div className={`${styles.vendorPersonal} flex`}>
          <h4 className={styles.vendorName}>{vendorName}</h4>
          <span className={styles.productCount}>{`(${products?.length})`}</span>
        </div>
        <RatingWidget averageRating={averageRating} />
      </div>
    </div>
  );
}

export default VendorInfo;
