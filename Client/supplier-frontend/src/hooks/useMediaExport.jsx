import LogoLight from "../assets/images/logo-light.svg?react";
import LogoDark from "../assets/images/logo-dark.svg?react";
import MiniLogoLight from "../assets/images/mini-logo-light.svg?react";
import MiniLogoDark from "../assets/images/mini-logo-dark.svg?react";
import FeatureIcon1 from "../assets/images/feature-icon-1.svg?react";
import FeatureIcon2 from "../assets/images/feature-icon-2.svg?react";
import FeatureIcon3 from "../assets/images/feature-icon-3.svg?react";
import FeatureIcon4 from "../assets/images/feature-icon-4.svg?react";
import TipsIcon from "../assets/images/tips-icon.svg?react";

const mediaExport = {
  LogoLight,
  LogoDark,
  MiniLogoLight,
  MiniLogoDark,
  TipsIcon,
  FeatureIcon1,
  FeatureIcon2,
  FeatureIcon3,
  FeatureIcon4,
};

const useMediaExport = () => {
  return { ...mediaExport };
};

export default useMediaExport;
