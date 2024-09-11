import styles from "./ToggleTheme.module.css";
import { useTheme } from "../../../context/ThemeContext";
import { CiLight, CiDark } from "react-icons/ci";
import classNames from "classnames";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={classNames(`${styles.toggleTheme} flex flex-center`, {
        [styles.lightActive]: theme === "light",
        [styles.darkActive]: theme === "dark",
      })}
    >
      <button
        className={classNames(styles.btnLight, {
          [styles.activeBtn]: theme === "light",
        })}
      >
        <CiLight />
      </button>
      <button
        className={classNames(styles.btnDark, {
          [styles.activeBtn]: theme === "dark",
        })}
      >
        <CiDark />
      </button>
    </div>
  );
};

export default ToggleTheme;
