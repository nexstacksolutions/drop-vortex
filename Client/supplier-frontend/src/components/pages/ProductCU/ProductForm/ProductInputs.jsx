import "react-quill/dist/quill.snow.css";
import styles from "./ProductForm.module.css";
import { get } from "lodash";
import classNames from "classnames";
import ReactQuill from "react-quill";
import { CgCloseO } from "react-icons/cg";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import { FaPlus, FaAngleDown, FaAsterisk } from "react-icons/fa6";
import { useProductFormUI } from "../../../../context/ProductForm";
import { memo, useCallback, useState, useRef, useEffect, useMemo } from "react";

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

const Guidelines = memo(({ content, customClass }) =>
  content?.length ? (
    <div className={classNames(styles.guideContainer, customClass)}>
      <ul>
        {content.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  ) : null
);
Guidelines.displayName = "Guidelines";

const MediaPreviewItem = memo(({ file, fileType, onRemove }) => {
  const src = URL.createObjectURL(file);
  const MediaTag = fileType === "image" ? "img" : "video";
  return (
    <div className={classNames(styles.mediaPreviewItem, "flex flex-center")}>
      <MediaTag
        src={src}
        controls={fileType !== "image"}
        className="object-cover"
      />
      <div
        className={classNames(
          styles.mediaPreviewActions,
          "flex justify-between"
        )}
      >
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
MediaPreviewItem.displayName = "MediaPreviewItem";

const InputHeader = memo(
  ({
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
  )
);
InputHeader.displayName = "InputHeader";

const InputFooter = memo(
  ({ errorMessage }) =>
    errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>
);
InputFooter.displayName = "InputFooter";

const InputWrapper = memo(({ children, AdditionalJsx, customClass }) => (
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
));
InputWrapper.displayName = "InputWrapper";

const InputContainer = memo(
  ({
    id,
    name,
    label,
    children,
    hideLabel,
    hideFormGuide,
    hideValidation,
    inputHeaderProps,
    inputWrapperProps,
    customClass,
    AdditionalJsx,
  }) => {
    const { updateGuideContent, requiredFields, formErrors } =
      useProductFormUI();
    const isRequired = get(requiredFields, name);
    const errorMessage = get(formErrors, name);

    const handleClick = () =>
      hideFormGuide ? null : updateGuideContent(name, label);

    return (
      <div
        className={classNames(
          styles.formInputContainer,
          "flex flex-col",
          customClass,
          { [styles.invalidInput]: errorMessage }
        )}
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
);
InputContainer.displayName = "InputContainer";

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

const FormInput = memo(
  ({
    type,
    name,
    value,
    label,
    id,
    onKeyDown,
    wrapInput = true,
    hideLabel,
    customClass,
    suffixDisplay,
    hideFormGuide,
    hideValidation,
    inputWrapperProps,
    ...rest
  }) => {
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
          <div className={classNames(styles.suffixDisplay, "flex")}>
            {suffixDisplay.maxValue && (
              <>
                <span>{value?.length || 0}</span> /{" "}
                <span>{suffixDisplay.maxValue}</span>
              </>
            )}
            {suffixDisplay.suffixIcon}
            {suffixDisplay.additionalJsx}
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
          hideFormGuide,
          hideValidation,
          inputWrapperProps,
          ...rest,
        }}
      >
        {inputElement}
      </InputContainer>
    ) : (
      inputElement
    );
  }
);
FormInput.displayName = "FormInput";

const MediaInput = memo(
  ({
    label,
    name,
    maxFiles,
    fileType,
    value = [],
    onChange,
    resetTrigger,
    hideFormGuide,
    customClass,
    guidelinesProps,
  }) => {
    const [mediaFiles, setMediaFiles] = useState(value);
    const [uploadOption, setUploadOption] = useState("Upload Video");
    const fileInputRef = useRef();

    const resetFiles = useCallback(() => {
      setMediaFiles([]);
      onChange?.(null, name, []);
    }, [name, onChange]);

    const handleFileChange = useCallback(
      (e) => {
        const files = Array.from(e.target.files);
        const updatedFiles = [...mediaFiles, ...files].slice(0, maxFiles);
        setMediaFiles(updatedFiles);
        onChange?.(null, name, updatedFiles);
      },
      [mediaFiles, maxFiles, name, onChange]
    );

    const handleRemoveFile = useCallback(
      (index) => {
        const updatedFiles = mediaFiles.filter((_, i) => i !== index);
        setMediaFiles(updatedFiles);
        onChange?.(null, name, updatedFiles);
      },
      [mediaFiles, name, onChange]
    );

    useEffect(() => {
      if (resetTrigger) {
        resetFiles();
      }
    }, [resetTrigger, resetFiles]);

    const renderMediaPreview = useCallback(
      (files) =>
        files.map((file, index) => (
          <MediaPreviewItem
            key={index}
            file={file}
            fileType={fileType}
            onRemove={() => handleRemoveFile(index)}
          />
        )),
      [fileType, handleRemoveFile]
    );

    const AddMediaActions = () => (
      <div className={`${styles.addMediaActions} flex flex-col`}>
        <button onClick={handleUpload}>Upload</button>
        <button>Media Center</button>
      </div>
    );

    const handleUpload = useCallback(() => fileInputRef.current.click(), []);

    const renderInputField = () => {
      if (uploadOption === "Youtube Link" && fileType === "video") {
        return (
          <FormInput
            name={name}
            wrapInput={false}
            type="text"
            hideValidation={true}
            hideFormGuide={true}
            customClass={classNames(
              styles.addMediaWrapper,
              styles.linkInputWrapper
            )}
            onChange={onChange}
            placeholder="Paste Youtube URL link here"
          />
        );
      }

      return (
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
              hideFormGuide={true}
              customClass={styles.addMediaWrapper}
              inputWrapperProps={{ AdditionalJsx: AddMediaActions }}
              onChange={handleFileChange}
              accept={fileType === "image" ? "image/*" : "video/*"}
            />
          )}
        </div>
      );
    };

    return (
      <InputContainer
        {...{ name, label, hideFormGuide }}
        customClass={classNames(styles.mediaInputContainer, customClass)}
        inputHeaderProps={
          fileType === "video" && {
            AdditionalJsx: MultiInputGroup,
            additionalJsxProps: {
              options: ["Upload Video", "Youtube Link"],
              type: "radio",
              name,
              label,
              hideLabel: true,
              hideFormGuide: true,
              value: uploadOption,
              onChange: (e) => setUploadOption(e.target.value),
              customClass: styles.uploadVideoOptions,
            },
          }
        }
      >
        {renderInputField()}
        {uploadOption !== "Youtube Link" && guidelinesProps && (
          <Guidelines {...guidelinesProps} />
        )}
      </InputContainer>
    );
  }
);
MediaInput.displayName = "MediaInput";

const DropdownInput = memo(
  ({ customClass, name, options, onChange, ...rest }) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = `${name}-dropdown-input`;

    const filteredOptions = useMemo(
      () =>
        options.filter((opt) =>
          opt.toLowerCase().includes(rest.value.trim().toLowerCase())
        ),
      [options, rest.value]
    );

    const handleOptionClick = (e) => {
      const { innerText } = e.target;
      if (onChange) {
        onChange(null, name, innerText);
      }
    };

    const suffixIcon =
      rest.value.length > 0 ? (
        <CgCloseO
          className={styles.suffixIcon}
          onClick={() => onChange(null, name, "")}
        />
      ) : (
        <FaAngleDown />
      );

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
          suffixDisplay={{ suffixIcon }}
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
);
DropdownInput.displayName = "DropdownInput";

const MultiInputGroup = memo(
  ({
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
  }) => {
    const id = `${name}-multi-input-group`;

    return (
      <InputContainer
        {...{ id, name, label, hideLabel, hideValidation }}
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
                htmlFor={`${name}-option-${index}`}
                className={classNames(styles.radioItem, "flex flex-center")}
              >
                <FormInput
                  type={type}
                  name={name}
                  id={`${name}-option-${index}`}
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
);
MultiInputGroup.displayName = "MultiInputGroup";

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
