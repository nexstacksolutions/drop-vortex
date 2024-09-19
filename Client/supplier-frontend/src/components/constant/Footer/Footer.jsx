import styles from "./Footer.module.css";
import classNames from "classnames";
import { Link } from "react-router-dom";

function Footer({ customClass }) {
  return (
    <footer
      className={classNames(styles.footer, "flex justify-between", {
        [customClass]: customClass,
      })}
      aria-label="Footer"
    >
      <p>&copy; 2024 DropVortex. All rights reserved.</p>

      <nav className={styles.quickLinks} aria-label="Quick Links">
        <ul className="flex-row">
          <li>
            <Link to="#">About</Link>
          </li>
          <li>
            <Link to="#">Contact</Link>
          </li>
          <li>
            <Link to="#">Help</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
