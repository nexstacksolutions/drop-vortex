import styles from "./Sidebar.module.css";
import navigation from "../../../constant/navigation";
import classNames from "classnames";
import { useTheme } from "../../../context/ThemeContext";
import useMediaExport from "../../../hooks/useMediaExport";
import { useState, useCallback, useMemo } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Divider from "../Divider/Divider";

function NavSubLinks({ subLinks, isActive }) {
  if (!subLinks?.length) return null;

  return (
    <CSSTransition
      in={isActive}
      timeout={300}
      classNames="subLink"
      unmountOnExit
    >
      <ul className={styles.subLinks} aria-hidden={!isActive}>
        {subLinks.map(({ label, to }, subIndex) => (
          <li key={subIndex} className={styles.subLinkWrapper}>
            <NavLink to={to} className={styles.subLink}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </CSSTransition>
  );
}

// NavItems component
function NavItems({
  activeIndex,
  expandSideBar,
  handleMouseEnter,
  handleToggleSubLinks,
}) {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <ul className={styles.navWrapper}>
        {navigation.sidebar.map(({ icon, label, subLinks }, index) => (
          <li
            key={index}
            className={classNames(styles.navItemWrapper, "flex-col", {
              [styles.activeNavItemWrapper]: activeIndex === index,
            })}
          >
            <div
              className={`${styles.navItem} flex align-center`}
              onClick={() => handleToggleSubLinks(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              aria-expanded={activeIndex === index}
            >
              {icon}
              {expandSideBar && <span>{label}</span>}
              {expandSideBar && <FaAngleDown />}
            </div>
            <NavSubLinks subLinks={subLinks} isActive={activeIndex === index} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RenderLogo({ expandSideBar, showDivider = false, customClass }) {
  const { theme } = useTheme();
  const { LogoLight, LogoDark, MiniLogoLight, MiniLogoDark } = useMediaExport();

  const Logo = expandSideBar
    ? theme === "light"
      ? LogoLight
      : LogoDark
    : theme === "light"
    ? MiniLogoLight
    : MiniLogoDark;

  return (
    <Link className={classNames("flex", customClass)}>
      {showDivider && <Divider />}
      <Logo />
    </Link>
  );
}

function ToggleSidebarBtn({ toggleSideBar }) {
  return (
    <button className={styles.toggleSidebarBtn} onClick={toggleSideBar}>
      <FaAngleRight />
    </button>
  );
}

function Sidebar() {
  const [expandSideBar, setExpandSideBar] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSideBar = useCallback(() => {
    setExpandSideBar((prev) => !prev);
    setActiveIndex(null); // Reset active index when collapsing sidebar
  }, []);

  const toggleSubLinks = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? null : index)); // Toggle sublinks
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!expandSideBar) setActiveIndex(null); // Reset when not expanded
  }, [expandSideBar]);

  const handleMouseEnter = useCallback(
    (index) => {
      if (!expandSideBar) setActiveIndex(index);
    },
    [expandSideBar]
  );

  return (
    <aside
      onMouseLeave={handleMouseLeave}
      className={classNames(styles.sidebar, "flex flex-col", {
        [styles.expanded]: expandSideBar,
        [styles.collapsed]: !expandSideBar,
      })}
    >
      <ToggleSidebarBtn toggleSideBar={toggleSideBar} />

      <RenderLogo
        handleToggleSideBar={toggleSideBar}
        expandSideBar={expandSideBar}
        customClass={styles.topLogo}
      />

      <NavItems
        activeIndex={activeIndex}
        expandSideBar={expandSideBar}
        handleMouseEnter={handleMouseEnter}
        handleToggleSubLinks={toggleSubLinks}
      />

      <RenderLogo
        handleToggleSideBar={toggleSideBar}
        expandSideBar={expandSideBar}
        showDivider
        customClass={`${styles.bottomLogo} flex-col justify-end`}
      />
    </aside>
  );
}

export default Sidebar;
