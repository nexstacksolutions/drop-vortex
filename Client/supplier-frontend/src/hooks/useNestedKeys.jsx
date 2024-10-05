const getNestedKeys = (obj, parent = "") =>
  Object.entries(obj).reduce((keys, [key, value]) => {
    const fullKey = parent ? `${parent}.${key}` : key;
    return typeof value === "object" && value && !Array.isArray(value)
      ? [...keys, ...getNestedKeys(value, fullKey)]
      : [...keys, fullKey];
  }, []);

export default getNestedKeys;
