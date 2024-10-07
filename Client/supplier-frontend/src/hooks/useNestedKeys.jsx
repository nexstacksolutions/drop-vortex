const useObjectKeys = () => {
  const getNestedKeys = (obj, parentKey = "") => {
    return Object.entries(obj).reduce((collectedKeys, [key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return [...collectedKeys, ...getNestedKeys(value, newKey)];
      }

      return [...collectedKeys, newKey];
    }, []);
  };

  return { getNestedKeys };
};

export default useObjectKeys;
