import styles from "./index.module.css";
import classNames from "classnames";
import { Divider } from "antd";
import { useTheme } from "../../../contexts/Theme";
import navigation from "../../../constants/navigation";
import { CSSTransition } from "react-transition-group";
import useMedia from "../../../hooks/useMedia";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useState, useCallback, useEffect, useMemo, memo } from "react";

const NavSubLinks = memo(({ subLinks, isActive }) => {
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
            <NavLink
              to={to}
              className={({ isActive }) =>
                classNames(styles.subLink, { [styles.subLinkActive]: isActive })
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </CSSTransition>
  );
});
NavSubLinks.displayName = "NavSubLinks";

const NavItems = memo(
  ({ activeSubLinks, expandSideBar, handleMouseEnter, toggleSubLinks }) => {
    const location = useLocation();

    useEffect(() => {
      navigation.sidebar.forEach(({ subLinks }, index) => {
        if (subLinks.some((link) => link.to === location.pathname)) {
          toggleSubLinks(index, true);
        }
      });
    }, [location.pathname, toggleSubLinks]);

    return (
      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navWrapper}>
          {navigation.sidebar.map(({ icon, label, subLinks }, index) => {
            const isExpanded = activeSubLinks.toggleIndex === index;
            const isActive = activeSubLinks.routeIndex === index;
            const keepExpanded = isActive && activeSubLinks.keepActive;

            return (
              <li
                key={index}
                className={classNames(styles.navItemWrapper, "flex-col", {
                  [styles.activeNavItemWrapper]: isExpanded || keepExpanded,
                })}
              >
                <div
                  className={classNames(styles.navItem, "flex flex-center", {
                    [styles.navItemActive]: isActive,
                  })}
                  onClick={() => toggleSubLinks(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  aria-expanded={isExpanded || isActive}
                >
                  {icon}
                  {expandSideBar && <span>{label}</span>}
                  {expandSideBar && <FaAngleDown />}
                </div>

                <NavSubLinks
                  subLinks={subLinks}
                  isActive={isExpanded || keepExpanded}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
);
NavItems.displayName = "NavItems";

const RenderLogo = memo(
  ({ expandSideBar, showDivider = false, customClass }) => {
    const { theme } = useTheme();
    const { LogoLight, LogoDark, MiniLogoLight, MiniLogoDark } = useMedia();

    const Logo = useMemo(() => {
      const logos = {
        light: expandSideBar ? LogoLight : MiniLogoLight,
        dark: expandSideBar ? LogoDark : MiniLogoDark,
      };
      return logos[theme];
    }, [
      expandSideBar,
      theme,
      LogoLight,
      LogoDark,
      MiniLogoLight,
      MiniLogoDark,
    ]);

    return (
      <Link
        className={classNames("flex", customClass, {
          "flex-center": !expandSideBar,
        })}
      >
        {showDivider && <Divider />}
        <Logo />
      </Link>
    );
  }
);
RenderLogo.displayName = "RenderLogo";

const ToggleSidebarBtn = memo(({ toggleSideBar }) => {
  return (
    <button className={styles.toggleSidebarBtn} onClick={toggleSideBar}>
      <FaAngleRight />
    </button>
  );
});
ToggleSidebarBtn.displayName = "ToggleSidebarBtn";

function Sidebar() {
  const [expandSideBar, setExpandSideBar] = useState(false);
  const [activeSubLinks, setActiveSubLinks] = useState({
    toggleIndex: null,
    routeIndex: null,
    keepActive: false,
  });

  const toggleSideBar = useCallback(() => {
    setExpandSideBar((prev) => !prev);
    setActiveSubLinks((prev) => ({
      ...prev,
      toggleIndex: null,
      keepActive: !prev.keepActive && prev.routeIndex === null,
    }));
  }, []);

  const toggleSubLinks = useCallback(
    (index, isRouteActive) => {
      setActiveSubLinks((prev) => ({
        toggleIndex: isRouteActive
          ? null
          : prev.toggleIndex === index
          ? null
          : index,
        routeIndex: isRouteActive ? index : prev.routeIndex,
        keepActive: isRouteActive && expandSideBar,
      }));
    },
    [expandSideBar]
  );

  const handleMouseLeave = useCallback(() => {
    if (!expandSideBar)
      setActiveSubLinks((prev) => ({ ...prev, toggleIndex: null }));
  }, [expandSideBar]);

  const handleMouseEnter = useCallback(
    (index) => {
      if (!expandSideBar)
        setActiveSubLinks((prev) => ({ ...prev, toggleIndex: index }));
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
      <RenderLogo expandSideBar={expandSideBar} customClass={styles.topLogo} />
      <NavItems
        {...{ activeSubLinks, expandSideBar, handleMouseEnter, toggleSubLinks }}
      />
      <RenderLogo
        expandSideBar={expandSideBar}
        customClass={`${styles.bottomLogo} flex-col justify-end`}
      />
    </aside>
  );
}

export default Sidebar;
