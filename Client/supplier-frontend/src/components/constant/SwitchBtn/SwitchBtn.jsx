import styles from "./SwitchBtn.module.css";
import { useState } from "react";
import classNames from "classnames";

function SwitchBtn({ currState, name, onChange, customClickHandler }) {
  const [isSwitchOn, setIsSwitchOn] = useState(currState);

  const handleToggleSwitch = () => {
    const newSwitchState = !isSwitchOn;
    setIsSwitchOn(newSwitchState);
    if (onChange) {
      onChange({ target: { name, value: newSwitchState } });
    }
  };

  const handleClick = () => {
    if (customClickHandler) {
      customClickHandler();
    } else {
      handleToggleSwitch();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={classNames(styles.switchBtn, "justify-start", {
        [styles.switchBtnOn]: customClickHandler ? currState : isSwitchOn,
      })}
    >
      <span></span>
    </button>
  );
}

export default SwitchBtn;
