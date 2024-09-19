import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";
import { FaAngleRight } from "react-icons/fa6";

function Breadcrumbs() {
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Manage Products", path: "/products/manage" },
    { label: "Add Product" },
  ];

  return (
    <nav className={styles.breadcrumbs}>
      <ul className="flex-row">
        {breadcrumbs.map(({ label, path }, index) => (
          <li key={index}>
            <Link to={path} className="align-center">
              {label} {index < breadcrumbs.length - 1 && <FaAngleRight />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Breadcrumbs;
