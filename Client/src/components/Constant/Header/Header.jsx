import styles from "./Header.module.css";
import logo from "../../../assets/images/logo.svg";
import navigation from "../../../constant/navigation";
import { NavLink } from "react-router-dom";
import { CiCamera } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { BsMortarboardFill } from "react-icons/bs";
import classNames from "classnames";

// SubHeader Component
function SubHeader() {
  return (
    <div className={`${styles.subHeader} flex justify-between`}>
      <div className={styles.featureMsg}></div>
      <nav className={`${styles.subHeaderLinks} flex`}>
        {navigation.subHeader.map(
          ({ label, path, icon, FeatureDot, subLinks }, index) => (
            <div key={index} className={`${styles.navItem} flex flex-center`}>
              <NavLink to={path} className={`flex flex-center`}>
                {label} {icon && icon}
              </NavLink>

              {FeatureDot && <FeatureDot customClass={styles.featureDot} />}
              {subLinks && (
                <div className={`${styles.subMenu} flex flex-wrap`}>
                  {subLinks.map(({ label, path, icon, featureIcon }, idx) => (
                    <NavLink
                      key={idx}
                      to={path}
                      className={`${styles.subLink} flex align-center`}
                    >
                      {icon && (
                        <div className={`${styles.icon} flex flex-center`}>
                          <img src={icon} alt={label} />
                        </div>
                      )}

                      <div
                        className={`${styles.content} flex justify-start align-center`}
                      >
                        {label}
                        {featureIcon && featureIcon}
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </nav>
    </div>
  );
}

// QuickLinks Component
function QuickLinks() {
  const quickLinks = navigation.mainHeader.quickLinks;
  const lastLink = quickLinks[quickLinks.length - 1];
  const mainLinks = quickLinks.slice(0, quickLinks.length - 1);

  return (
    <nav className={`${styles.quickLinks} flex justify-between`}>
      <div className={`${styles.left} flex`}>
        {mainLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`${styles.quickLink} flex flex-center`}
          >
            {link.label}
            {link.featureIcon && link.featureIcon}
          </NavLink>
        ))}
      </div>
      <div className={styles.right}>
        <NavLink
          to={lastLink.path}
          className={`${styles.quickLink} flex flex-center`}
        >
          <BsMortarboardFill />
          {lastLink.label}
        </NavLink>
      </div>
    </nav>
  );
}

// MainHeader Component
function MainHeader() {
  return (
    <div className={`${styles.mainHeader} flex justify-between`}>
      <div className={`${styles.logo} flex justify-start align-center`}>
        <img src={logo} alt="" />
      </div>
      <form className={`${styles.searchBar} flex justify-between align-center`}>
        <input type="text" placeholder="Search Dropshipping Products to Sell" />
        <div className={`${styles.searchBtns} flex align-center justify-end`}>
          <CiCamera />
          <button type="submit">
            <IoSearchOutline />
          </button>
        </div>
      </form>
      <div className={`${styles.actionBtns} flex justify-end align-center`}>
        <NavLink to={"/"} className={styles.mainLink}>
          Login
        </NavLink>
        <NavLink to={"/"} className={`${styles.mainLink} secondary-btn`}>
          Register Now
        </NavLink>
      </div>
    </div>
  );
}

// Header Component
function Header({ customClass }) {
  return (
    <header
      className={classNames(`${styles.header} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      <SubHeader />
      <div className={`${styles.headerWrapper} flex flex-col`}>
        <MainHeader />
        <QuickLinks />
      </div>
    </header>
  );
}

export default Header;
