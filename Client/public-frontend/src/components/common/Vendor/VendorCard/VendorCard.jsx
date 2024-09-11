import styles from "./VendorCard.module.css";
import VendorInfo from "../VendorInfo/VendorInfo";
import StoreInfo from "../StoreInfo/StoreInfo";
import VendorProducts from "../VendorProducts/VendorProducts";
import classNames from "classnames";
import { Link } from "react-router-dom";

function VendorCard({
  cardData,
  customClass,
  showVendorInfo = true,
  showStoreInfo = false,
  showVendorProducts = true,
  showStoreLink = false,
}) {
  return (
    <div
      className={classNames(`${styles.vendorCard} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      {showVendorInfo && <VendorInfo {...cardData} />}
      {showVendorProducts && <VendorProducts {...cardData} />}
      {showStoreInfo && <StoreInfo />}
      {showStoreLink && <Link className={styles.storeLink}>Visit Store</Link>}
    </div>
  );
}

export default VendorCard;
