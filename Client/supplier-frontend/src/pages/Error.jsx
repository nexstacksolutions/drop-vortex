import styles from "../styles/Error.module.css";
import { Link, useNavigate, useRouteError } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1, { replace: true });
  };

  return (
    <main className={`${styles.error} flex flex-center`}>
      <section className={`${styles.errorWrapper} flex flex-col`}>
        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>
            {error?.status && error?.statusText
              ? `${error.status} ${error.statusText}`
              : "Page Not Found"}
          </h1>
          {error?.data && <p className={styles.errorMessage}>{error.data}</p>}
          <p className={styles.errorMessage}>
            We're sorry, but the page you're looking for isn't available right
            now. Please check the URL, or try refreshing the page. If the
            problem persists, feel free to return to our homepage.
          </p>
        </div>

        <div className={`${styles.actionBtns} flex flex-center`}>
          <Link onClick={handleGoBack}>Back to prevPage</Link>
          <Link to="/" className={styles.homeLink} aria-label="Go back to Home">
            Go back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ErrorBoundary;
