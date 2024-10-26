const useInputChange = (updateHandler) => {
  const onChange = (e, name, value, customizer) => {
    if (e) ({ name, value } = e.target);
    updateHandler(name, customizer ? customizer(value) : value);
  };

  return onChange;
};

export default useInputChange;
