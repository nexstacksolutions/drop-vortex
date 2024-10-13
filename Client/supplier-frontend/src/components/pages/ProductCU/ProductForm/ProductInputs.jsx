import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import classNames from "classnames";
import ReactQuill from "react-quill";
import { memo, useCallback, useState, useRef, useEffect, useMemo } from "react";
import { get } from "lodash";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { FaPlus, FaAngleDown, FaAsterisk } from "react-icons/fa6";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import { useProductForm } from "../../../../context/ProductForm";

// **Utility Hook**: Prevent default Enter key behavior
const useHandleInputKeyDown = (callback) =>
  useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        callback?.(e);
      }
    },
    [callback]
  );

// **Reusable Component**: Guidelines list
const Guidelines = memo(({ content, customClass }) =>
  content.length ? (
    <div className={classNames(styles.guideContainer, customClass)}>
      <ul>
        {content.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  ) : null
);

// **Reusable Component**: Media preview for image/video
const MediaPreviewItem = memo(({ file, fileType, onRemove }) => {
  const src = URL.createObjectURL(file);
  const MediaTag = fileType === "image" ? "img" : "video";

  return (
    <div className={`${styles.mediaPreviewItem} flex flex-center`}>
      <MediaTag
        src={src}
        controls={fileType !== "image"}
        className="object-cover"
      />
      <div className={`${styles.mediaPreviewActions} flex justify-between`}>
        <button type="button" className={styles.editMediaBtn}>
          <RiEdit2Line />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeMediaBtn}
        >
          <RiDeleteBin5Line />
        </button>
      </div>
    </div>
  );
});

// **Input Header and Footer**: Handles label, error display
const InputHeader = ({
  id,
  label,
  isRequired,
  hideValidation,
  AdditionalJsx,
  additionalJsxProps,
}) => (
  <div className={classNames(styles.inputHeader, "flex flex-col")}>
    <label htmlFor={id} className="flex align-center">
      {!hideValidation && isRequired && (
        <FaAsterisk className={styles.requiredFieldIcon} />
      )}
      {typeof label === "string" ? <span>{label}</span> : label}
    </label>
    {AdditionalJsx && <AdditionalJsx {...additionalJsxProps} />}
  </div>
);

const InputFooter = ({ errorMessage }) =>
  errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>;

// **Generic Input Wrapper**
const InputWrapper = ({ children, AdditionalJsx, customClass }) => (
  <div
    className={classNames(
      styles.formInputWrapper,
      "flex align-center",
      customClass
    )}
  >
    {children}
    {AdditionalJsx && <AdditionalJsx />}
  </div>
);

// **InputContainer**: Wraps input with label, error, and validation
function InputContainer({
  id,
  name,
  label,
  children,
  hideLabel,
  hideValidation,
  inputHeaderProps,
  inputWrapperProps,
  customClass,
  AdditionalJsx,
}) {
  const { requiredFields, formErrors, updateGuideContent } = useProductForm();
  const isRequired = get(requiredFields, name);
  const errorMessage = get(formErrors, name);

  const handleClick = () => updateGuideContent(name, label);

  return (
    <div
      className={classNames(styles.formInputContainer, "flex flex-col", {
        [customClass]: customClass,
        [styles.invalidInput]: errorMessage,
      })}
      onClick={handleClick}
    >
      {!hideLabel && label && (
        <InputHeader
          {...{ id, label, isRequired, hideValidation, ...inputHeaderProps }}
        />
      )}
      {AdditionalJsx && <AdditionalJsx />}
      <InputWrapper {...inputWrapperProps}>{children}</InputWrapper>
      {!hideValidation && errorMessage && (
        <InputFooter errorMessage={errorMessage} />
      )}
    </div>
  );
}

// **Form Input Types Mapping**
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

// **Reusable FormInput**: Handles different input types with optional wrapping
function FormInput({
  type = "default",
  name,
  value,
  label,
  id,
  onKeyDown,
  wrapInput = true,
  hideLabel,
  customClass,
  suffixDisplay,
  hideValidation,
  inputWrapperProps,
  ...rest
}) {
  const inputId = id || `${name}-form-input`;
  const handleKeyDown = useHandleInputKeyDown(onKeyDown);
  const InputComponent = inputComponents[type] || inputComponents.default;

  const inputElement = (
    <div
      className={classNames(
        styles.inputWrapper,
        "flex align-center justify-between"
      )}
    >
      <InputComponent
        {...{
          type,
          name,
          value,
          id: inputId,
          onKeyDown: handleKeyDown,
          ...rest,
        }}
      />
      {suffixDisplay && (
        <div className={`${styles.suffixDisplay} flex`}>
          {suffixDisplay.maxValue && (
            <>
              <span>{value?.length || 0}</span> /{" "}
              <span>{suffixDisplay.maxValue}</span>
            </>
          )}
          {suffixDisplay.icon}
          {suffixDisplay.AdditionalJsx}
        </div>
      )}
    </div>
  );

  return wrapInput ? (
    <InputContainer
      {...{
        name,
        label,
        hideLabel,
        id: inputId,
        customClass,
        hideValidation,
        inputWrapperProps,
      }}
    >
      {inputElement}
    </InputContainer>
  ) : (
    inputElement
  );
}

// **Media Input Handling**
function MediaInput({
  label,
  name,
  maxFiles,
  fileType,
  value = [],
  onChange,
  resetTrigger,
  customClass,
  guidelinesProps,
}) {
  const [mediaFiles, setMediaFiles] = useState(value);
  const [uploadOption, setUploadOption] = useState("Upload Video");
  const fileInputRef = useRef();

  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const updatedFiles = [...mediaFiles, ...files].slice(0, maxFiles);
      setMediaFiles(updatedFiles);
      onChange?.(null, name, updatedFiles);
    },
    [mediaFiles, maxFiles, name, onChange]
  );

  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
    onChange?.(null, name, updatedFiles);
  };

  useEffect(() => {
    if (resetTrigger) {
      setMediaFiles([]);
      onChange?.(null, name, []);
    }
  }, [resetTrigger, name, onChange]);

  const renderMediaPreview = (files) =>
    files.map((file, index) => (
      <MediaPreviewItem
        key={index}
        file={file}
        fileType={fileType}
        onRemove={() => handleRemoveFile(index)}
      />
    ));

  const AddMediaActions = () => (
    <div className={`${styles.addMediaActions} flex flex-col`}>
      <button onClick={handleUpload}>Upload</button>
      <button>Media Center</button>
    </div>
  );

  const handleUpload = () => fileInputRef.current.click();

  const additionalJsxProps = {
    options: ["Upload Video", "Youtube Link"],
    type: "radio",
    name: "upload-option",
    value: uploadOption,
    onChange: (e) => setUploadOption(e.target.value),
    customClass: styles.uploadVideoOptions,
  };

  return (
    <InputContainer
      label={label}
      name={name}
      customClass={classNames(styles.mediaInputContainer, customClass)}
      inputHeaderProps={
        fileType === "video" && {
          AdditionalJsx: MultiInputGroup,
          additionalJsxProps,
        }
      }
    >
      {uploadOption !== "Youtube Link" && (
        <div className={`${styles.mediaPreviewWrapper} flex`}>
          {renderMediaPreview(mediaFiles)}
          {mediaFiles.length < maxFiles && (
            <FormInput
              label={<FaPlus />}
              name={name}
              type="file"
              inputRef={fileInputRef}
              multiple={maxFiles > 1}
              hideValidation={true}
              customClass={styles.addMediaWrapper}
              inputWrapperProps={{
                AdditionalJsx: AddMediaActions,
              }}
              onChange={handleFileChange}
              accept={fileType === "image" ? "image/*" : "video/*"}
            />
          )}
        </div>
      )}

      {uploadOption === "Youtube Link" && fileType === "video" && (
        <FormInput
          name={name}
          wrapInput={false}
          type="text"
          hideValidation={true}
          customClass={classNames(
            styles.addMediaWrapper,
            styles.linkInputWrapper
          )}
          onChange={onChange}
          placeholder="Paste Youtube URL link here"
        />
      )}

      {uploadOption !== "Youtube Link" && guidelinesProps && (
        <Guidelines {...guidelinesProps} />
      )}
    </InputContainer>
  );
}

// **DropdownInput**: Handles focus and filtering of options
function DropdownInput({ customClass, name, options, onChange, ...rest }) {
  const [isFocused, setIsFocused] = useState(false);
  const id = `${name}-dropdown-input`;

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.toLowerCase().includes(rest.value.toLowerCase())
      ),
    [options, rest.value]
  );

  const handleOptionClick = (e) => {
    const { innerText } = e.target;
    if (onChange) {
      onChange(null, name, innerText);
    }
  };

  return (
    <InputContainer
      {...{ id, name, ...rest }}
      customClass={classNames(styles.dropdownWrapper, customClass, {
        [styles.dropdownInputFocused]: isFocused,
      })}
    >
      <FormInput
        {...{ id, name, onChange, ...rest }}
        wrapInput={false}
        suffixDisplay={{ icon: <FaAngleDown /> }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && (
        <ul className={classNames(styles.dropdownList, customClass)}>
          {filteredOptions.length ? (
            filteredOptions.map((opt, idx) => (
              <li
                key={idx}
                onMouseDown={handleOptionClick}
                className={styles.dropdownOption}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className={styles.noOptions}>No options found</li>
          )}
        </ul>
      )}
    </InputContainer>
  );
}

// ** MultiInputGroup**: Handles multiple input fields within a single container
function MultiInputGroup({
  customClass,
  value,
  options,
  name,
  onChange,
  type,
  groupType,
  label,
  hideLabel = false,
  hideValidation = false,
}) {
  const id = `${name}-multi-input-group`;

  return (
    <InputContainer
      label={label}
      id={id}
      name={name}
      hideLabel={hideLabel}
      hideValidation={hideValidation}
      customClass={classNames(styles.multiInputGroup, customClass)}
    >
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
                type={type}
                name={name}
                id={`${name}${index}`}
                value={option}
                wrapInput={false}
                checked={value === option}
                onChange={onChange}
              />
              <span
                className={classNames(styles.customRadio, {
                  [styles.radioItemChecked]: value === option,
                })}
              />
              <span>{option}</span>
            </label>
          ))}
    </InputContainer>
  );
}

// define the component's displayName for better debugging
Guidelines.displayName = "Guidelines";
MediaPreviewItem.displayName = "MediaPreviewItem";

export {
  FormInput,
  InputContainer,
  InputHeader,
  InputFooter,
  InputWrapper,
  MediaInput,
  DropdownInput,
  MultiInputGroup,
};
