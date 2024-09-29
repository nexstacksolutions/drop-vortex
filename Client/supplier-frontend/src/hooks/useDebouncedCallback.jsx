import { useMemo, useEffect } from "react";
import debounce from "lodash/debounce";

const useDebouncedCallback = (callback, delay) => {
  const debounced = useMemo(() => debounce(callback, delay), [callback, delay]);
  useEffect(() => () => debounced.cancel(), [debounced]);
  return debounced;
};

export default useDebouncedCallback;
