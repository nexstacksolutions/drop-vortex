import styles from "./VendorCard.module.css";
import VendorInfo from "../VendorInfo/VendorInfo";
import VendorProducts from "../VendorProducts/VendorProducts";

function VendorCard({ cardData }) {
  return (
    <div className={`${styles.vendorCard} flex flex-col`}>
      <VendorInfo {...cardData} />
      <VendorProducts {...cardData} />
    </div>
  );
}

export default VendorCard;
