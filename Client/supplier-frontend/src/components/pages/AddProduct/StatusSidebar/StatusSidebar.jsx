import styles from "./StatusSidebar.module.css";

function ContentStatus() {
  return (
    <div className={styles.contentStatus}>
      <p>ContentStatus</p>
    </div>
  );
}

function GuideCard() {
  return (
    <div className={styles.guideCard}>
      <p>GuideCard</p>
    </div>
  );
}

function StatusSidebar({
  guideCardProps,
  contentStatusProps,
  showContentStatus = true,
  showGuideCard = true,
}) {
  return (
    <aside className={`${styles.statusSidebar} flex flex-col`}>
      {showContentStatus && <ContentStatus {...contentStatusProps} />}
      {showGuideCard && <GuideCard {...guideCardProps} />}
    </aside>
  );
}

export default StatusSidebar;
