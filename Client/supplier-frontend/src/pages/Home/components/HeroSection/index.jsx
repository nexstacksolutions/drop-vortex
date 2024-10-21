import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineCampaign } from "react-icons/md";

function ProfileCard() {
  return (
    <div className={`${styles.profileCard} flex align-center`}>
      <img src="/images/store/logo.webp" alt="Profile Pic" />
      <Link>Mehak Fusion Finds</Link>
    </div>
  );
}

function ServicePanel() {
  return (
    <div className={`${styles.servicePanel} flex flex-col`}>
      <h3>Service Panel</h3>
    </div>
  );
}

function AnnouncementCard() {
  const notificationList = [
    {
      type: "Campaign",
      date: "09/09/2024",
      message: "Hope you have a great 9.9!",
    },
    {
      type: "Order",
      date: "07/07/2024",
      message: "We've received a new order!",
    },
  ];

  return (
    <div className={`${styles.announcementCard} flex flex-col`}>
      <div
        className={`${styles.notificationHeader} flex justify-between align-center`}
      >
        <h3>Important Notification</h3>
        <Link to="#" className="flex align-center">
          <span>More</span>
          <FaAngleRight />
        </Link>
      </div>
      {notificationList.slice(0, 1).map(({ type, date, message }, index) => (
        <div key={index} className={`${styles.notificationItem} flex flex-col`}>
          <div className={`${styles.notificationMeta} flex align-center`}>
            <MdOutlineCampaign />
            <span>{type}</span>
            <span>{date}</span>
          </div>
          <p>{message}</p>
        </div>
      ))}
    </div>
  );
}

function HeroContent() {
  return (
    <div className={`${styles.heroContent} flex justify-between`}>
      <ProfileCard />
      <ServicePanel />
      <AnnouncementCard />
    </div>
  );
}

function AnnouncementBanner() {
  return (
    <figure className={styles.announcementBanner}>
      <img src="/announcement-banner.webp" alt="New Announcement" />
    </figure>
  );
}

function HeroSection() {
  return (
    <section className={`${styles.heroSection} flex flex-col`}>
      <HeroContent />
      <AnnouncementBanner />
    </section>
  );
}

export default HeroSection;
