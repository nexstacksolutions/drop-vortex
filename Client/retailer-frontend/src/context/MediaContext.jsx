import React, { createContext, useContext, useMemo, useCallback } from "react";

const MediaContext = createContext();

function MediaProvider({ children }) {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

  const handleSearch = useCallback((e, query, navigate) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, []);

  const values = useMemo(
    () => ({ handleSearch, IMAGE_BASE_URL }),
    [handleSearch]
  );

  return (
    <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
  );
}

export function useMedia() {
  return useContext(MediaContext);
}

export default MediaProvider;
