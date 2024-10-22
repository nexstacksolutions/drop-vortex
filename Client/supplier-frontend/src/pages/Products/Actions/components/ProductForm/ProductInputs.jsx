import "react-quill/dist/quill.snow.css";
import styles from "./index.module.css";
import { get } from "lodash";
import classNames from "classnames";
import ReactQuill from "react-quill";
import { CgCloseO, CgInfo } from "react-icons/cg";
import SwitchBtn from "../../../../../components/UI/SwitchBtn";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import { FaPlus, FaAngleDown, FaAsterisk } from "react-icons/fa6";
import { useProductFormUI } from "../../../../../contexts/ProductForm";
import { memo, useCallback, useState, useRef, useEffect, useMemo } from "react";
import { useTooltip } from "../../../../../contexts/Tooltip";

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

const GuidanceTooltip = memo(
  ({
    title,
    imgSrc,
    instructions = [],
    popupBtn = <CgInfo />,
    enablePopup = true,
    place = "top",
  }) => {
    const { handleTooltipTrigger } = useTooltip();

    const content = useMemo(
      () => (
        <div
          className={classNames("flex align-center", styles.guidanceWrapper)}
        >
          {imgSrc && <img src={imgSrc} alt="Guidance Visual" />}
          {instructions.length > 0 && (
            <ul className={styles.guidanceList}>
              {instructions.map((item, idx) => (
                <li key={idx}>
                  {instructions.length > 1 && `${idx + 1}.`} {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
      [imgSrc, instructions]
    );

    const tooltipProps = useMemo(
      () => ({ content, place, customClass: styles.guidanceTooltip }),
      [content, place]
    );

    if (!enablePopup) return content;

    return (
      <div className={classNames(styles.guidanceHeader, "flex")}>
        {title && <span>{title}</span>}
        <button
          id="global-tooltip"
          onMouseOver={() => handleTooltipTrigger(tooltipProps)}
        >
          {popupBtn}
        </button>
      </div>
    );
  }
);
GuidanceTooltip.displayName = "GuidanceTooltip";

const MediaPreviewItem = memo(
  ({ file, fileType, onRemove, showMediaPreview, enablePopup }) => {
    const { handleTooltipTrigger } = useTooltip();
    const src = useMemo(() => URL.createObjectURL(file), [file]);
    const MediaTag = fileType === "image" ? "img" : "video";

    const content = useMemo(
      () => (
        <div
          className={classNames(
            styles.actionWrapper,
            "flex flex-col justify-center"
          )}
        >
          {showMediaPreview && <img src={src} alt="" />}

          <div
            className={classNames(styles.mediaAction, "flex justify-between")}
          >
            <button type="button">
              <RiEdit2Line />
            </button>
            <button type="button" onClick={onRemove}>
              <RiDeleteBin5Line />
            </button>
          </div>
        </div>
      ),
      [src, showMediaPreview, onRemove]
    );

    const tooltipProps = useMemo(
      () => ({
        content,
        customClass: styles.mediaPreviewTooltip,
      }),
      [content]
    );

    const renderMediaTag = () => (
      <MediaTag
        src={src}
        controls={fileType !== "image"}
        {...(enablePopup && {
          id: "global-tooltip",
          onMouseOver: () => handleTooltipTrigger(tooltipProps),
        })}
      />
    );

    return (
      <div className={classNames(styles.mediaPreviewItem, "flex flex-center")}>
        {renderMediaTag()}
        {!enablePopup && content}
      </div>
    );
  }
);
MediaPreviewItem.displayName = "MediaPreviewItem";

const InputHeader = memo(
  ({
    id,
    name,
    label,
    customClass,
    featureLabel,
    hideValidation,
    filterTabsProps,
    guidelinesProps,
  }) => {
    const { requiredFields } = useProductFormUI();
    const isRequired = get(requiredFields, name);

    if (!label) return;

    return (
      <div className={classNames(styles.inputHeader, "flex ", customClass)}>
        <label htmlFor={id} className="flex align-center">
          {!hideValidation && isRequired && (
            <FaAsterisk className={styles.requiredFieldIcon} />
          )}
          {typeof label === "string" ? <span>{label}</span> : label}
        </label>
        {featureLabel}
        {guidelinesProps && <GuidanceTooltip {...guidelinesProps} />}
        {filterTabsProps && <MultiInputGroup {...filterTabsProps} />}
      </div>
    );
  }
);
InputHeader.displayName = "InputHeader";

const InputFooter = memo(({ errorMessage }) => (
  <div className={styles.validationWrapper}>
    {<p className={styles.errorMsg}>{errorMessage}</p>}
  </div>
));
InputFooter.displayName = "InputFooter";

const InputWrapper = memo(({ children, InputActions, customClass }) => (
  <div
    className={classNames(
      styles.inputControl,
      "flex align-center",
      customClass
    )}
  >
    {children}
    {InputActions}
  </div>
));
InputWrapper.displayName = "InputWrapper";

const InputContainer = memo(
  ({
    name,
    label,
    children,
    hideFormGuide,
    hideValidation,
    inputWrapperProps,
    inputHeaderProps,
    customClass,
    ...rest
  }) => {
    const { updateInputGuidance, formErrors } = useProductFormUI();
    const errorMessage = get(formErrors, name);

    const handleClick = () =>
      hideFormGuide ? null : updateInputGuidance(name, label);

    return (
      <div
        className={classNames(
          styles.inputContainer,
          "flex flex-col",
          customClass,
          { [styles.invalidInput]: errorMessage }
        )}
        onClick={handleClick}
      >
        <InputHeader
          {...{ name, label, hideValidation, ...inputHeaderProps, ...rest }}
        />

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
  ({ id, inputProps, onKeyDown, wrapInput = true, suffixDisplay, ...rest }) => {
    const { name, value, type } = inputProps;
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
          {...inputProps}
          id={inputId}
          onKeyDown={handleKeyDown}
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
          id: inputId,
          ...inputProps,
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
    maxFiles,
    fileType,
    resetTrigger,
    customClass,
    inputProps,
    inputHeaderProps,
    guidelinesProps,
    mediaPreviewProps,
    ...rest
  }) => {
    const { name, value, onChange } = inputProps;
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
            {...mediaPreviewProps}
            onRemove={() => handleRemoveFile(index)}
          />
        )),
      [fileType, handleRemoveFile, mediaPreviewProps]
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
            inputProps={{
              name,
              type: "text",
              onChange,
              placeholder: "Paste Youtube URL link here",
            }}
            hideValidation={true}
            hideFormGuide={true}
            wrapInput={false}
          />
        );
      }

      return (
        <div className={`${styles.mediaPreviewWrapper} flex`}>
          {renderMediaPreview(mediaFiles)}
          {mediaFiles.length < maxFiles && (
            <FormInput
              inputProps={{
                name,
                type: "file",
                inputRef: fileInputRef,
                multiple: maxFiles > 1,
                onChange: handleFileChange,
                accept: fileType === "image" ? "image/*" : "video/*",
              }}
              label={<FaPlus />}
              hideValidation={true}
              hideFormGuide={true}
              customClass={styles.addMediaWrapper}
              inputWrapperProps={{ InputActions: <AddMediaActions /> }}
            />
          )}
        </div>
      );
    };

    return (
      <InputContainer
        {...{ name, ...rest }}
        customClass={classNames(styles.mediaInputContainer, customClass)}
        inputHeaderProps={{
          ...inputHeaderProps,
          ...(fileType === "video" && {
            filterTabsProps: {
              inputProps: {
                name,
                type: "radio",
                value: uploadOption,
                onChange: (e) => setUploadOption(e.target.value),
              },
              hideFormGuide: true,
              customClass: styles.filterTabs,
              options: ["Upload Video", "Youtube Link"],
            },
          }),
        }}
      >
        {renderInputField()}
        {uploadOption !== "Youtube Link" && guidelinesProps && (
          <GuidanceTooltip {...guidelinesProps} />
        )}
      </InputContainer>
    );
  }
);
MediaInput.displayName = "MediaInput";

const DropdownInput = memo(
  ({ customClass, options, inputProps, disableInput, ...rest }) => {
    const { name, value, onChange } = inputProps;
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef();
    const id = `${name}-dropdown-input`;

    const updatedInputProps = {
      ...inputProps,
      inputRef,
      readOnly: disableInput,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    };

    const filteredOptions = useMemo(
      () =>
        options.filter((opt) =>
          opt.toLowerCase().includes(value.trim().toLowerCase())
        ),
      [options, value]
    );

    // Handle option selection from the dropdown
    const handleOptionClick = (e) => {
      const { innerText } = e.target;
      if (onChange) {
        onChange(null, name, innerText);
      }
      setIsFocused(false); // Hide dropdown after selection
    };

    // Clear the input field
    const handleClearInput = () => {
      onChange(null, name, "");
      inputRef.current.focus();
    };

    // Determine which icon to display
    const suffixIcon =
      value.length > 0 ? (
        <CgCloseO className={styles.suffixIcon} onClick={handleClearInput} />
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
          {...{ id, ...rest }}
          wrapInput={false}
          suffixDisplay={{ suffixIcon }}
          inputProps={{ ...updatedInputProps }}
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
  ({ options, groupType, customClass, inputProps, ...rest }) => {
    const { name, value, onChange } = inputProps;
    const id = `${name}-multi-input-group`;

    return (
      <InputContainer
        {...{ id, name, ...rest }}
        customClass={classNames(styles.multiInputGroup, customClass)}
      >
        {groupType === "input"
          ? Object.keys(value).map((dimension, index) => (
              <FormInput
                key={index}
                wrapInput={false}
                inputProps={{
                  ...inputProps,
                  name: `${name}.${dimension}`,
                  value: value[dimension],
                  placeholder:
                    dimension.charAt(0).toUpperCase() + dimension.slice(1),
                  onChange: (e) =>
                    onChange(null, name, {
                      ...value,
                      [dimension]: e.target.value,
                    }),
                }}
              />
            ))
          : options?.map((option, index) => (
              <label
                key={index}
                htmlFor={`${name}-option-${index}`}
                className={classNames(styles.radioItem, "flex flex-center")}
              >
                <FormInput
                  wrapInput={false}
                  id={`${name}-option-${index}`}
                  inputProps={{
                    ...inputProps,
                    value: option,
                    checked: value === option,
                  }}
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
  GuidanceTooltip,
};
