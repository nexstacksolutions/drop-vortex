import styles from "./index.module.css";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

function FilterButtons() {
  return (
    <div className={`${styles.filterButtons} flex align-center`}>
      <button>
        <span>Product Data</span>
      </button>
      <button>
        <span>Bulk Manage</span>
        <FaAngleDown />
      </button>
      <button>
        <FaPlus />
        <span>New Product</span>
      </button>
    </div>
  );
}

export default FilterButtons;
