import styles from "./Footer.module.css";
import { Link, NavLink } from "react-router-dom";
import navigation from "../../../constant/navigation";
import logo from "../../../assets/images/logo.svg";
import { FaAngleRight } from "react-icons/fa6";
import SocialIcons from "../../Common/SocialIcons/SocialIcons";
import classNames from "classnames";

function FooterLinks() {
  return (
    <div className={`${styles.footerLinks} flex justify-between align-start`}>
      {navigation.footer.map((item, index) => (
        <div key={index} className={`${styles.footerCard} flex flex-col`}>
          <h2 className={styles.cardTitle}>{item.title}</h2>
          <div className={`${styles.cardContent} flex flex-col`}>
            {item.subLinks.map((subLink, idx) => (
              <Link key={idx} to={subLink.path}>
                {subLink.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FooterInfo(params) {
  return (
    <div className={`${styles.footerCard} flex flex-col`}>
      <Link className={styles.footerLogo}>
        <img src={logo} alt="" />
      </Link>
      <p>
        Doba is the industry-leading dropshipping platform for aspiring and
        established e-commerce entrepreneurs alike. Bridge the gap between
        retailers and wholesale suppliers, establishing the necessary
        relationship for dropshipping success.
      </p>
      <Link className="flex align-center">
        View More <FaAngleRight />
      </Link>
      <SocialIcons />
    </div>
  );
}

function FooterBottom() {
  return (
    <div className={`${styles.footerBottom} flex justify-center`}>
      <p>© 2024 Focus Technology Co., Ltd. All Rights Reserved</p>
    </div>
  );
}

function Footer({ customClass }) {
  return (
    <footer
      className={classNames(`${styles.footer} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      <div
        className={`${styles.footerWrapper} flex justify-between align-start`}
      >
        <FooterInfo />
        <FooterLinks />
      </div>
      <FooterBottom />
    </footer>
  );
}

export default Footer;
