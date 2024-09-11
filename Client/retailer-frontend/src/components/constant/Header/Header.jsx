import styles from "./Header.module.css";
import classNames from "classnames";

// Header Component
function Header({ customClass }) {
  return (
    <header
      className={classNames(`${styles.header} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      <h1></h1>
    </header>
  );
}

export default Header;
