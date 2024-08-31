import styles from "./ShowcaseGrid.module.css";
import ShowcaseHeader from "../ShowcaseHeader/ShowcaseHeader";
import ShowcaseContent from "../ShowcaseContent/ShowcaseContent";
import classNames from "classnames";

function ShowcaseGrid({
  showcaseHeaderProps,
  showcaseContentProps,
  showShowcaseHeader = true,
  customClass,
}) {
  return (
    <section
      className={classNames(`${styles.showcaseGrid} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      {showShowcaseHeader && (
        <ShowcaseHeader showcaseHeaderProps={showcaseHeaderProps} />
      )}
      <ShowcaseContent showcaseContentProps={showcaseContentProps} />
    </section>
  );
}

export default ShowcaseGrid;
