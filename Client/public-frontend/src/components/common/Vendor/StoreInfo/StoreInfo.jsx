import styles from "./StoreInfo.module.css";

function StoreInfo() {
  return (
    <div className={`${styles.storeInfo} flex flex-col`}>
      <div className={`${styles.storeName} flex`}>
        <span>Store Name:</span>
        <span>wolmart28 vendor2</span>
      </div>
      <div className={`${styles.storeAddress} flex`}>
        <span>Address:</span>
        <span>Balch Springs, TX 75121, United States (US)</span>
      </div>
      <div className={`${styles.storePhone} flex`}>
        <span>Phone</span>
        <span>19723332352</span>
      </div>
    </div>
  );
}

export default StoreInfo;
