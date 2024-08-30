import styles from "./SocialIcons.module.css";
import classNames from "classnames";
import {
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa6";

function SocialIcons({ customClass }) {
  return (
    <div
      className={classNames(
        `${styles.socialIcons} flex justify-start align-center`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <button>
        <FaFacebookF />
      </button>
      <button>
        <FaXTwitter />
      </button>
      <button>
        <FaPinterestP />
      </button>
      <button>
        <FaWhatsapp />
      </button>
      <button>
        <FaLinkedinIn />
      </button>
    </div>
  );
}

export default SocialIcons;
