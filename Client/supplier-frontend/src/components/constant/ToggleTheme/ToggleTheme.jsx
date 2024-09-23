import styles from "./ToggleTheme.module.css";
import { useTheme } from "../../../context/ThemeContext";
import { CiLight, CiDark } from "react-icons/ci";
import classNames from "classnames";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={classNames(
        styles.switchBtn,
        "flex align-center justify-start",
        { [styles.switchBtnOn]: theme === "dark" }
      )}
    >
      <CiLight />
      <span></span>
      <CiDark />
    </button>
  );
};

export default ToggleTheme;
