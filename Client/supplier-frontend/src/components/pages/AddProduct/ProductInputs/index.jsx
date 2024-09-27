import styles from "./index.module.css";
import "react-quill/dist/quill.snow.css";
import classNames from "classnames";
import ReactQuill from "react-quill";
import { get } from "lodash";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { FaPlus, FaAngleDown, FaAsterisk } from "react-icons/fa6";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import { useCallback, useState, useRef, useEffect } from "react";
import { useProductForm } from "../../../../context/ProductForm";

function Guidelines({ content, guideType }) {
  if (!content.length) return null;
  return (
    <div className={classNames(styles.guideContainer, styles[guideType])}>
      <ul>
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function InputWrapper({ name, label, id, children, customClass }) {
  const { requiredFields, formErrors } = useProductForm();

  const isRequired = get(requiredFields, name);
  const errorMessage = get(formErrors, name);

  return (
    <div
      className={classNames(
        styles.formInputContainer,
        "flex flex-col",
        customClass
      )}
    >
      {label && (
        <label htmlFor={id} className="flex align-center">
          {isRequired && <FaAsterisk />}
          <span>{label}</span>
        </label>
      )}

      <div
        className={classNames(
          styles.formInputWrapper,
          "flex align-center justify-between"
        )}
      >
        {children}
      </div>

      {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
    </div>
  );
}

function GenerateInputByType({
  id,
  name,
  type,
  value,
  checked,
  suffixDisplay,
  placeholder,
  fileType,
  multiple,
  inputRef,
  isSwitch,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}) {
  const { icon, maxValue } = suffixDisplay || {};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (onKeyDown) {
        onKeyDown(e);
      }
    }
  };

  if (isSwitch)
    return <SwitchBtn currState={value} name={name} onChange={onChange} />;

  switch (type) {
    case "textarea":
      return <ReactQuill value={value} id={id} onChange={onChange} />;
    default:
      return (
        <div
          className={classNames(
            styles.inputWrapper,
            "flex align-center justify-between"
          )}
        >
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            checked={checked}
            placeholder={placeholder}
            accept={fileType && (fileType === "image" ? "image/*" : "video/*")}
            multiple={multiple}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
          {suffixDisplay && (
            <div className={`${styles.suffixDisplay} flex`}>
              {maxValue && (
                <>
                  <span>{value?.length}</span> / <span>{maxValue}</span>
                </>
              )}
              {icon && icon}
            </div>
          )}
        </div>
      );
  }
}

function FormInput({
  id,
  name,
  label,
  type,
  value,
  onChange,
  customClass,
  wrapInput = true,
  useCustomizer = false,
  ...rest
}) {
  const { state, handleInputChange, handleDebouncedChange } = useProductForm();

  const handleQuillChange = useCallback(
    (content) => handleDebouncedChange(null, name, content),
    [name, handleDebouncedChange]
  );

  if (id === undefined && !useCustomizer) {
    ({ id } = { id: `${name}-form-input` });
  }

  if (value === undefined && !useCustomizer) {
    ({ value } = { value: get(state, name) });
  }

  if (onChange === undefined && !useCustomizer) {
    if (type === "textarea") {
      ({ onChange } = { onChange: handleQuillChange });
    } else {
      ({ onChange } = { onChange: handleInputChange });
    }
  }

  return wrapInput ? (
    <InputWrapper {...{ label, name, id, customClass }}>
      {GenerateInputByType({ ...rest, name, id, onChange, value, type })}
    </InputWrapper>
  ) : (
    GenerateInputByType({ ...rest, name, id, onChange, value, type })
  );
}

function MultiInputGroup({
  name,
  label,
  type,
  options,
  groupType,
  customClass,
}) {
  const { state, handleInputChange: onChange } = useProductForm();
  const value = get(state, name);
  const id = `${name}-form-input`;

  return (
    <InputWrapper label={label} formInputId={id} customClass={customClass}>
      {groupType === "input"
        ? Object.keys(value).map((dimension, index) => (
            <GenerateInputByType
              key={index}
              name={dimension}
              value={value[dimension]}
              type={type}
              placeholder={
                dimension.charAt(0).toUpperCase() + dimension.slice(1)
              }
              useCustomizer={true}
              onChange={(e) =>
                onChange(null, name, {
                  ...value,
                  [dimension]: e.target.value,
                })
              }
            />
          ))
        : options?.map((option, index) => (
            <label
              key={index}
              htmlFor={`${name}.${option}`}
              className={classNames(styles.radioItem, "flex flex-center")}
            >
              {
                <FormInput
                  type={type}
                  id={`${name}.${option}`}
                  name={name}
                  value={option}
                  useCustomizer={true}
                  checked={value === option}
                  onChange={onChange}
                  wrapInput={false}
                />
              }

              <span>{option}</span>
            </label>
          ))}
    </InputWrapper>
  );
}

function renderMediaFiles(mediaFiles, fileType, handleRemoveFile) {
  return mediaFiles.map((file, index) => (
    <MediaPreviewItem
      key={index}
      file={file}
      fileType={fileType}
      onRemove={() => handleRemoveFile(index)}
    />
  ));
}

function MediaInput({
  name,
  label,
  maxFiles,
  type = "file",
  fileType,
  resetTrigger,
  customClass,
  guidelinesProps,
}) {
  const { state, handleInputChange: onChange } = useProductForm();
  const value = get(state, name);
  const [mediaFiles, setMediaFiles] = useState(value || []);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (mediaFiles.length + files.length <= maxFiles) {
        const updatedFiles = [...mediaFiles, ...files];
        setMediaFiles(updatedFiles);
        onChange(null, name, updatedFiles);
        if (fileInputRef.current) fileInputRef.current.value = null;
      }
    },
    [mediaFiles, name, maxFiles, onChange]
  );

  const handleRemoveFile = useCallback(
    (index) => {
      const updatedFiles = mediaFiles.filter((_, i) => i !== index);
      setMediaFiles(updatedFiles);
      onChange(null, name, updatedFiles);
      if (fileInputRef.current) fileInputRef.current.value = null;
    },
    [mediaFiles, name, onChange]
  );

  useEffect(() => {
    return () => {
      mediaFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [mediaFiles]);

  useEffect(() => {
    if (resetTrigger) {
      setMediaFiles([]);
      onChange(null, name, []);
    }
  }, [resetTrigger, name, onChange]);

  const fileInputId = `${name}-file-upload`;

  return (
    <InputWrapper
      label={label}
      formInputId={fileInputId}
      customClass={classNames(styles.mediaInputContainer, customClass)}
    >
      <div className={`${styles.mediaInputWrapper} flex align-center`}>
        <div className={`${styles.mediaPreviewWrapper} flex`}>
          {renderMediaFiles(mediaFiles, fileType, handleRemoveFile)}
          {mediaFiles.length < maxFiles && (
            <FormInput
              label={<FaPlus />}
              name={name}
              type={type}
              fileType={fileType}
              multiple={maxFiles && maxFiles > 1 ? true : false}
              inputRef={fileInputRef}
              onChange={handleFileChange}
              useCustomizer={true}
              customClass={styles.addMediaWrapper}
            />
          )}
        </div>
        {guidelinesProps && <Guidelines {...guidelinesProps} />}
      </div>
    </InputWrapper>
  );
}

function MediaPreviewItem({ file, fileType, onRemove }) {
  return (
    <div className={`${styles.mediaPreviewItem} flex flex-center`}>
      {fileType === "image" ? (
        <img
          src={URL.createObjectURL(file)}
          alt="Media preview"
          className={styles.mediaImage}
        />
      ) : (
        <video
          src={URL.createObjectURL(file)}
          controls
          className={styles.mediaVideo}
        />
      )}
      <div className={`${styles.mediaActionsContainer} flex justify-between`}>
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeMediaBtn}
        >
          <RiDeleteBin5Line />
        </button>
        <button type="button" className={styles.editMediaBtn}>
          <RiEdit2Line />
        </button>
      </div>
    </div>
  );
}

function DropdownInput({ label, name, options, customClass, ...rest }) {
  const { state, handleInputChange: onChange } = useProductForm();
  const [isFocused, setIsFocused] = useState(false);
  const value = get(state, name);
  const dropdownInputId = `${name}-dropdown-input`;

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Filter options based on the input value
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  const handleOptionClick = (e) => {
    const { innerText } = e.target;
    if (onChange) {
      onChange(null, name, innerText);
    }
  };

  return (
    <InputWrapper
      label={label}
      formInputId={dropdownInputId}
      customClass={classNames(styles.dropdownInputContainer, customClass, {
        [styles.dropdownInputFocused]: isFocused,
      })}
    >
      <FormInput
        {...rest}
        wrapInput={false}
        name={name}
        suffixDisplay={{ icon: <FaAngleDown /> }}
        onFocus={handleFocus} // Trigger dropdown on focus
        onBlur={handleBlur} // Close dropdown on blur
      />

      {/* Dropdown menu that shows when input is focused */}
      {isFocused && (
        <div className={`${styles.dropdownInputWrapper} flex align-center`}>
          <ul className={`${styles.dropdownList} custom-scrollbar-sm`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  onMouseDown={handleOptionClick}
                  key={index}
                  className={styles.dropdownItem}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className={styles.noOptions}>No options found</li>
            )}
          </ul>
        </div>
      )}
    </InputWrapper>
  );
}

export { FormInput, MultiInputGroup, InputWrapper, DropdownInput, MediaInput };
