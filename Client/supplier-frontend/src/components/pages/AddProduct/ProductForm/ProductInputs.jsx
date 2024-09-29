import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import classNames from "classnames";
import ReactQuill from "react-quill";
import { get } from "lodash";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { FaPlus, FaAngleDown, FaAsterisk } from "react-icons/fa6";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import { useCallback, useState, useRef, useEffect } from "react";
import { useProductForm } from "../../../../context/ProductForm";

function Guidelines({ content, customClass }) {
  if (!content.length) return null;
  return (
    <div className={classNames(styles.guideContainer, customClass)}>
      <ul>
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function InputWrapper({
  id,
  name,
  label,
  children,
  customClass,
  hideValidation,
  formInputWrapperProps,
}) {
  const { requiredFields, formErrors } = useProductForm();

  const isRequired = get(requiredFields, name);
  const errorMessage = get(formErrors, name);

  return (
    <div
      className={classNames(styles.formInputContainer, "flex flex-col", {
        [customClass]: customClass,
        [styles.invalidInput]: errorMessage,
      })}
    >
      {label && (
        <label htmlFor={id} className="flex align-center">
          {!hideValidation && isRequired && <FaAsterisk />}
          <span>{label}</span>
        </label>
      )}

      <div
        className={classNames(
          styles.formInputWrapper,
          "flex align-center justify-between",
          formInputWrapperProps?.customClass
        )}
      >
        {children}
      </div>

      {!hideValidation && errorMessage && (
        <p className={styles.errorMsg}>{errorMessage}</p>
      )}
    </div>
  );
}

function GenerateInputByType({
  type,
  name,
  value,
  checked,
  id,
  suffixDisplay,
  placeholder,
  fileType,
  multiple,
  inputRef,
  isSwitch,
  onChange,
  onFocus,
  onBlur,
  handleQuillChange,
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
      return (
        <ReactQuill
          value={value}
          id={id}
          onChange={handleQuillChange}
          className={styles.reactQuillInput}
        />
      );
    default:
      return (
        <div
          className={classNames(
            styles.inputWrapper,
            "flex align-center justify-between"
          )}
        >
          <input
            type={type}
            name={name}
            id={id}
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
  name,
  label,
  onChange,
  customClass,
  wrapInput = true,
  hideValidation = false,
  ...rest
}) {
  const id = `${name}-form-input`;
  const handleQuillChange = useCallback(
    (content) => onChange(null, name, content),
    [name, onChange]
  );

  const generateInputProps = { id, name, onChange, ...rest, handleQuillChange };

  return wrapInput ? (
    <InputWrapper {...{ label, id, name, customClass, hideValidation }}>
      {GenerateInputByType(generateInputProps)}
    </InputWrapper>
  ) : (
    GenerateInputByType(generateInputProps)
  );
}
function MultiInputGroup({
  customClass,
  value,
  options,
  name,
  onChange,
  type,
  groupType,
  label,
}) {
  const id = `${name}-multi-input-group`;

  return (
    <InputWrapper {...{ label, id, name, customClass }}>
      {groupType === "input"
        ? Object.keys(value).map((dimension, index) => (
            <FormInput
              key={index}
              name={dimension}
              value={value[dimension]}
              type={type}
              wrapInput={false}
              placeholder={
                dimension.charAt(0).toUpperCase() + dimension.slice(1)
              }
              onChange={(e) =>
                onChange(null, name, { ...value, [dimension]: e.target.value })
              }
            />
          ))
        : options?.map((option, index) => (
            <label
              key={index}
              htmlFor={`${name}${index}`}
              className={classNames(styles.radioItem, "flex flex-center")}
            >
              <GenerateInputByType
                {...{ type, name }}
                id={`${name}${index}`}
                value={option}
                checked={value === option}
                onChange={onChange}
              />

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
      {...{ file, fileType }}
      onRemove={() => handleRemoveFile(index)}
    />
  ));
}

function MediaInput({
  label,
  name,
  maxFiles,
  type = "file",
  fileType,
  value,
  onChange,
  resetTrigger,
  customClass,
  guidelinesProps,
}) {
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

  const id = `${name}-file-upload`;

  return (
    <InputWrapper
      {...{ label, id, name }}
      customClass={classNames(styles.mediaInputContainer, customClass)}
    >
      <div className={`${styles.mediaPreviewWrapper} flex`}>
        {renderMediaFiles(mediaFiles, fileType, handleRemoveFile)}
        {mediaFiles.length < maxFiles && (
          <FormInput
            label={<FaPlus />}
            {...{ name, type, fileType }}
            multiple={maxFiles && maxFiles > 1 ? true : false}
            inputRef={fileInputRef}
            onChange={handleFileChange}
            hideValidation={true}
            customClass={styles.addMediaWrapper}
          />
        )}
      </div>
      {guidelinesProps && <Guidelines {...guidelinesProps} />}
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
function DropdownInput(props) {
  const { customClass, label, name, options, value, onChange } = props || {};
  const [isFocused, setIsFocused] = useState(false);
  const id = `${name}-dropdown-input`;

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
      {...{ label, id, name }}
      customClass={classNames(styles.dropdownInputContainer, customClass, {
        [styles.dropdownInputFocused]: isFocused,
      })}
    >
      <FormInput
        {...props}
        wrapInput={false}
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

export {
  FormInput,
  MultiInputGroup,
  InputWrapper,
  DropdownInput,
  MediaInput,
  GenerateInputByType,
};
