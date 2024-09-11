import styles from "./Footer.module.css";
import classNames from "classnames";

function Footer({ customClass }) {
  return (
    <footer
      className={classNames(`${styles.footer} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      <h1></h1>
    </footer>
  );
}

export default Footer;
