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

// Utility function to handle key-down events for input fields
const handleInputKeyDown = (e, callback) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (callback) callback(e);
  }
};

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
  hideLabel,
  hideValidation,
  formInputWrapperProps,
}) {
  const { requiredFields, formErrors, updateGuideContent } = useProductForm();

  const isRequired = get(requiredFields, name);
  const errorMessage = get(formErrors, name);

  return (
    <div
      className={classNames(styles.formInputContainer, "flex flex-col", {
        [customClass]: customClass,
        [styles.invalidInput]: errorMessage,
      })}
      onClick={() => updateGuideContent(name, label)}
    >
      {!hideLabel && label && (
        <label htmlFor={id} className="flex align-center">
          {!hideValidation && isRequired && (
            <FaAsterisk className={styles.requiredFieldIcon} />
          )}
          {label?.type ? label : <span>{label}</span>}
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

const inputComponents = {
  textarea: ({ name, onChange, ...rest }) => (
    <ReactQuill
      {...rest}
      onChange={(content) => onChange(null, name, content)}
      className={styles.reactQuillInput}
    />
  ),
  default: ({ inputRef, ...rest }) => <input ref={inputRef} {...rest} />,
  switch: ({ value, ...rest }) => <SwitchBtn currState={value} {...rest} />,
};

function FormInput({
  type = "text",
  name,
  value,
  id,
  suffixDisplay,
  onKeyDown,
  wrapInput = true,
  hideLabel,
  customClass,
  hideValidation,
  fileType,
  ...rest
}) {
  const { icon, maxValue } = suffixDisplay || {};
  const inputId = id || `${name}-form-input`;
  const handleKeyDown = (e) => handleInputKeyDown(e, onKeyDown);

  const inputProps = {
    type,
    name,
    value,
    id: inputId,
    onKeyDown: handleKeyDown,
    ...rest,
  };

  const inputWrapperProps = {
    name,
    hideLabel,
    id: inputId,
    customClass,
    hideValidation,
    fileType,
    ...rest,
  };

  const InputComponent = inputComponents[type] || inputComponents.default;

  const renderedInput = (
    <div
      className={classNames(
        styles.inputWrapper,
        "flex align-center justify-between"
      )}
    >
      <InputComponent {...inputProps} />
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

  return wrapInput ? (
    <InputWrapper {...inputWrapperProps}>{renderedInput}</InputWrapper>
  ) : (
    renderedInput
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
  hideValidation,
}) {
  const id = `${name}-multi-input-group`;

  return (
    <InputWrapper {...{ label, id, name, customClass, hideValidation }}>
      {groupType === "input"
        ? Object.keys(value).map((dimension, index) => (
            <FormInput
              key={index}
              name={`${name}.${dimension}`}
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
              <FormInput
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
      const updatedFiles = [...mediaFiles, ...files].slice(0, maxFiles);
      setMediaFiles(updatedFiles);
      onChange(null, name, updatedFiles);
      if (fileInputRef.current) fileInputRef.current.value = null;
    },
    [mediaFiles, maxFiles, name, onChange]
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

  const renderMediaPreview = (mediaFiles) =>
    mediaFiles.map((file, index) => (
      <MediaPreviewItem
        key={index}
        file={file}
        fileType={fileType}
        onRemove={() => handleRemoveFile(index)}
      />
    ));

  return (
    <InputWrapper
      {...{ label, name }}
      customClass={classNames(styles.mediaInputContainer, customClass)}
    >
      <div className={`${styles.mediaPreviewWrapper} flex`}>
        {renderMediaPreview(mediaFiles)}
        {mediaFiles.length < maxFiles && (
          <FormInput
            label={<FaPlus />}
            {...{ name, type, fileType }}
            multiple={maxFiles > 1}
            hideValidation={true}
            inputRef={fileInputRef}
            onChange={handleFileChange}
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

function DropdownInput({ customClass, name, options, onChange, ...rest }) {
  const [isFocused, setIsFocused] = useState(false);
  const id = `${name}-dropdown-input`;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(rest.value.toLowerCase())
  );

  const handleOptionClick = (e) => {
    const { innerText } = e.target;
    if (onChange) {
      onChange(null, name, innerText);
    }
  };

  return (
    <InputWrapper
      {...{ id, name, ...rest }}
      customClass={classNames(styles.dropdownWrapper, customClass, {
        [styles.dropdownInputFocused]: isFocused,
      })}
    >
      <FormInput
        type="text"
        {...{ name, onChange, ...rest }}
        wrapInput={false}
        suffixDisplay={{ icon: <FaAngleDown /> }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isFocused && (
        <ul className={classNames(styles.dropdownList, customClass)}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                onMouseDown={handleOptionClick}
                key={index}
                className={styles.dropdownOption}
              >
                {option}
              </li>
            ))
          ) : (
            <li className={styles.noOptions}>No options found</li>
          )}
        </ul>
      )}
    </InputWrapper>
  );
}

export { FormInput, MultiInputGroup, MediaInput, DropdownInput, InputWrapper };
