import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import { set, get } from "lodash";
import ReactQuill from "react-quill";
import classNames from "classnames";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import SwitchBtn from "../../../constant/SwitchBtn/SwitchBtn";
import Divider from "../../../constant/Divider/Divider";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import productFormSchema from "../../../../schemas/productFormSchema";
import { RiDeleteBin5Line, RiEdit2Line, RiMenuFill } from "react-icons/ri";

const getFieldPath = (
  isVariationField,
  baseField,
  valueIndex,
  variationIndex = 0
) => {
  const dynamicField = `productDetails.variations[${variationIndex}].values[${valueIndex}]`;

  return isVariationField
    ? `${dynamicField}.${baseField}`
    : `productDetails.${baseField}`;
};

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

function FormSection({
  title,
  message,
  additionalJsx,
  children,
  customClass,
  showMoreBtnProps,
}) {
  return (
    <section
      className={classNames(styles.formSection, customClass, "flex flex-col")}
    >
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {additionalJsx && additionalJsx}
      </div>
      <div className={classNames(styles.sectionContent, "flex flex-col")}>
        {children}
      </div>
      {showMoreBtnProps && <ShowMoreBtn {...showMoreBtnProps} />}
    </section>
  );
}

function InputWrapper({
  children,
  label,
  formInputId,
  errorMessage,
  customClass,
}) {
  return (
    <div
      className={classNames(
        styles.formInputContainer,
        "flex flex-col",
        customClass
      )}
    >
      {label && (
        <label htmlFor={formInputId} className="flex align-center">
          {label}
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

function generateInputByType({
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
      return <ReactQuill value={value} id={id} onChange={handleQuillChange} />;
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
  customClass,
  wrapInput = true,
  label,
  name,
  onChange,
  errorMessage,
  ...rest
}) {
  const formInputId = `${name}-form-input`;
  const handleQuillChange = useCallback(
    (content) => onChange(null, name, content),
    [name, onChange]
  );

  const generateInputProps = {
    ...rest,
    name,
    onChange,
    handleQuillChange,
    id: formInputId,
  };

  return wrapInput ? (
    <InputWrapper
      label={label}
      formInputId={formInputId}
      customClass={customClass}
      errorMessage={errorMessage}
    >
      {generateInputByType(generateInputProps)}
    </InputWrapper>
  ) : (
    generateInputByType(generateInputProps)
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
  errorMessage,
}) {
  const dropdownInputId = `${name}-multi-input-group`;

  return (
    <InputWrapper
      label={label}
      formInputId={dropdownInputId}
      customClass={customClass}
      errorMessage={errorMessage}
    >
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
              {generateInputByType({
                type,
                id: `${name}${index}`,
                name,
                value: option,
                checked: value === option,
                wrapInput: false,
                onChange,
              })}

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
  label,
  name,
  maxFiles,
  type = "file",
  fileType,
  value,
  onChange,
  resetTrigger,
  customClass,
  guideComponent,
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

  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
    onChange(null, name, updatedFiles);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

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
              customClass={styles.addMediaWrapper}
            />
          )}
        </div>
        {guideComponent}
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

function DropdownInput(props) {
  const { customClass, label, name, options, value, onChange } = props || {};
  const [isFocused, setIsFocused] = useState(false);
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

function ShowMoreBtn({
  btnText = "Show More",
  handleShowMore,
  section,
  additionalFields,
}) {
  return (
    <button
      type="button"
      onClick={handleShowMore}
      className={classNames(styles.showMoreBtn, {
        [styles.showMoreBtnActive]: additionalFields[section],
      })}
    >
      <span> {!additionalFields[section] ? btnText : "Show Less"}</span>
      <FaAngleDown />
    </button>
  );
}

function AdditionalJsx(props) {
  return (
    <div className={`${styles.additionalJsx} flex align-center`}>
      <SwitchBtn {...props} />
      <p>
        Switch on if you need different dimension & weight for different product
        variants
      </p>
    </div>
  );
}

function VariantItem({
  handleAddVariantItem,
  handleRemoveVariantItem,
  variantData,
  variationIndex,
  valueIndex,
  showVariantImages,
  onChange,
}) {
  const [state, setState] = useState({
    inputValue: "",
    variantImages: [],
    resetTrigger: false,
  });

  const { inputValue, variantImages, resetTrigger } = state;

  const resetVariantImages = useCallback(() => {
    setState({
      inputValue: "",
      variantImages: [],
      resetTrigger: !resetTrigger,
    });
    setTimeout(
      () => setState((prevState) => ({ ...prevState, resetTrigger: false })),
      0
    );
  }, [resetTrigger]);

  const handleKeyDown = useCallback(() => {
    if (inputValue.trim()) {
      handleAddVariantItem(inputValue, variantImages, variationIndex);
      resetVariantImages();
    }
  }, [
    inputValue,
    variantImages,
    resetVariantImages,
    variationIndex,
    handleAddVariantItem,
  ]);

  const updatedValueIndex =
    valueIndex === undefined ? "addVariantItem" : valueIndex;

  const updatedInputName = `productDetails.variations[${variationIndex}].values[${updatedValueIndex}]`;

  return (
    <div className={`${styles.variantItem} flex align-center`}>
      <FormInput
        name={`${updatedInputName}.name`}
        type="text"
        placeholder="Please type or select"
        value={(variantData && variantData.name) || inputValue}
        onChange={
          onChange
            ? onChange
            : (e) => setState({ ...state, inputValue: e.target.value })
        }
        onKeyDown={handleKeyDown}
        customClass={styles.formInput}
      />

      {showVariantImages && (
        <MediaInput
          name={`${updatedInputName}.variantImages`}
          fileType="image"
          maxFiles={5}
          value={variantData?.variantImages || variantImages}
          resetTrigger={resetTrigger}
          onChange={
            onChange
              ? onChange
              : (_, __, newMedia) =>
                  setState((prevState) => ({
                    ...prevState,
                    variantImages: newMedia,
                  }))
          }
          customClass={styles.mediaInput}
        />
      )}

      {onChange && (
        <div className={`${styles.variantActions} flex justify-end`}>
          <button
            type="button"
            onClick={() => handleRemoveVariantItem(variationIndex, valueIndex)}
            className={styles.removeVariant}
          >
            <RiDeleteBin5Line />
          </button>
          <button type="button" className={styles.moveVariant}>
            <RiMenuFill />
          </button>
        </div>
      )}
    </div>
  );
}

function ProductVariations({
  variations,
  onChange,
  handleAddVariantItem,
  handleRemoveVariantItem,
}) {
  const [showVariantImages, setShowVariantImages] = useState(false);

  return (
    <div className={`${styles.productVariationsWrapper} flex flex-col`}>
      {variations.map(({ type, values }, variationIndex) => (
        <div
          key={variationIndex}
          className={`${styles.variationItem} flex flex-col`}
        >
          <div className={`${styles.variationHeader} flex flex-col`}>
            <span className={styles.variationTitle}>
              Variant {variationIndex + 1}
            </span>
            <div className={`${styles.variationInfo} flex flex-col`}>
              <span className={styles.variationName}>Variant Name</span>
              <span className={styles.variationType}>{type}</span>
            </div>
            <div className={`${styles.variationDetails} flex flex-col`}>
              <span>Total Variants</span>
              <div className={`${styles.showImageCheckbox} flex align-center`}>
                <FormInput
                  name="showImageCheckbox"
                  id="showImageCheckbox"
                  type="checkbox"
                  value={showVariantImages}
                  onChange={(e) => setShowVariantImages(e.target.checked)}
                />
                <label
                  htmlFor="showImageCheckbox-form-input"
                  className="flex align-center"
                >
                  <span>Add Image</span>
                  <span>Max 8 images for each variant.</span>
                </label>
              </div>
            </div>
          </div>

          <div className={`${styles.variationBody} flex flex-col`}>
            <div className={`${styles.variantWrapper} flex flex-col`}>
              {values.map((variantData, valueIndex) => (
                <VariantItem
                  key={`${variationIndex}-${variantData.id}`}
                  variantData={variantData}
                  onChange={onChange}
                  variationIndex={variationIndex}
                  valueIndex={valueIndex}
                  showVariantImages={showVariantImages}
                  handleRemoveVariantItem={handleRemoveVariantItem}
                />
              ))}
            </div>

            <VariantItem
              handleAddVariantItem={handleAddVariantItem}
              variationIndex={variationIndex}
              showVariantImages={showVariantImages}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table header component
function TableHeaders({
  hasVariationRows,
  variationColumnNames,
  additionalHeaderNames,
}) {
  return (
    <thead>
      <tr>
        {hasVariationRows &&
          variationColumnNames.map((columnName, columnIndex) => (
            <th key={columnIndex}>{columnName}</th>
          ))}
        {additionalHeaderNames.map((headerName, headerIndex) => (
          <th key={headerIndex}>{headerName}</th>
        ))}
      </tr>
    </thead>
  );
}

// Table row component
function TableRows({
  variationRows,
  variantShipping,
  hasVariationRows,
  variationColumnNames,
  additionalInputFields,
  formData,
  onChange,
}) {
  return (
    <tbody>
      {hasVariationRows ? (
        variationRows.map((rowValues, rowIndex) => (
          <tr key={`variation-row-${rowIndex}`}>
            {variationColumnNames.map((columnName, columnIndex) => (
              <td key={`variation-col-${columnIndex}`}>
                {rowValues[columnName]}
              </td>
            ))}

            {additionalInputFields.map(
              (
                { placeholder, fieldName, maxValue, inputType = "number" },
                index
              ) => (
                <td key={`additional-col-${index}`}>
                  {variantShipping && index === 4 ? (
                    <MultiInputGroup
                      name={getFieldPath(true, fieldName, rowIndex)}
                      type={inputType}
                      groupType="input"
                      placeholder={placeholder}
                      value={get(
                        formData,
                        getFieldPath(true, fieldName, rowIndex)
                      )}
                      onChange={onChange}
                    />
                  ) : (
                    <FormInput
                      name={getFieldPath(true, fieldName, rowIndex)}
                      type={inputType}
                      placeholder={placeholder}
                      suffixDisplay={{ maxValue }}
                      value={get(
                        formData,
                        getFieldPath(true, fieldName, rowIndex)
                      )}
                      onChange={onChange}
                      isSwitch={index === additionalInputFields.length - 1}
                    />
                  )}
                </td>
              )
            )}
          </tr>
        ))
      ) : (
        <tr>
          {additionalInputFields.map(
            (
              { placeholder, fieldName, maxValue, inputType = "number" },
              index
            ) => (
              <td key={`non-row-${fieldName}-${index}`}>
                <FormInput
                  name={getFieldPath(false, fieldName)}
                  type={inputType}
                  placeholder={placeholder}
                  suffixDisplay={{ maxValue }}
                  value={get(formData, getFieldPath(false, fieldName))}
                  onChange={onChange}
                  isSwitch={index === additionalInputFields.length - 1}
                />
              </td>
            )
          )}
        </tr>
      )}
    </tbody>
  );
}

function ProductPriceStockWrapper({
  variations,
  variantShipping,
  formData,
  onChange,
  handleApplyToAll,
}) {
  const variationNames = variations.map((variation) =>
    variation.values.map((v) => v.name).join(",")
  );

  const variationRows = useMemo(() => {
    if (variations.length === 0) return [];

    const maxValuesLength = Math.max(...variations.map((v) => v.values.length));

    return Array.from({ length: maxValuesLength }, (_, index) =>
      variations.reduce((acc, variation) => {
        acc[variation.type] = variation.values[index]?.name || "";
        return acc;
      }, {})
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variations, variationNames]);

  const variationColumnNames = useMemo(() => {
    return variations.map((variation) => variation.type);
  }, [variations]);

  const hasVariationRows = variationRows.length > 0;

  const additionalHeaderNames = [
    "Price",
    "Special Price",
    "Stock",
    ...(variantShipping && hasVariationRows
      ? ["Package Weight", "Package Dimensions(cm): Length * Width * Height"]
      : []),
    "Seller SKU",
    "Free Items",
    "Availability",
  ];

  const additionalInputFields = [
    { fieldName: "pricing.current", placeholder: "Price" },
    { fieldName: "pricing.original", placeholder: "Special Price" },
    { fieldName: "stock", placeholder: "Stock" },
    ...(variantShipping && hasVariationRows
      ? [
          {
            fieldName: "packageWeight",
            placeholder: "0.001 - 300",
            inputType: "number",
          },
          {
            fieldName: "dimensions",
            placeholder: "0.01 - 300",
            inputType: "number",
          },
        ]
      : []),
    {
      fieldName: "sku",
      placeholder: "Seller SKU",
      inputType: "text",
      maxValue: 200,
    },
    { fieldName: "freeItems", placeholder: "Free Items" },
    { fieldName: "availability" },
  ];

  return (
    <div className={`${styles.productPriceStockWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {hasVariationRows && (
        <div className={`${styles.variationInputContainer} flex`}>
          {additionalInputFields
            .slice(0, variantShipping ? 6 : 4) // Slice depending on variantShipping
            .filter(
              (_, index) => !(variantShipping && (index === 3 || index === 4))
            ) // Filter out index 3 and 4 if variantShipping is true
            .map(
              (
                { placeholder, fieldName, maxValue, inputType = "number" },
                index
              ) => (
                <FormInput
                  key={`non-row-${fieldName}-${index}`}
                  name={getFieldPath(false, fieldName)}
                  type={inputType}
                  placeholder={placeholder}
                  value={get(formData, getFieldPath(false, fieldName))}
                  suffixDisplay={{ maxValue }}
                  onChange={onChange}
                  customClass={styles.variationInputField}
                />
              )
            )}
          <button
            type="button"
            onClick={handleApplyToAll}
            className={`${styles.applyToAllButton} primary-btn`}
          >
            Apply to All
          </button>
        </div>
      )}

      <div className={styles.variantTableWrapper}>
        <table className={styles.variantTable}>
          <TableHeaders
            variationColumnNames={variationColumnNames}
            additionalHeaderNames={additionalHeaderNames}
            hasVariationRows={hasVariationRows}
          />
          <TableRows
            variationRows={variationRows}
            variationColumnNames={variationColumnNames}
            additionalInputFields={additionalInputFields}
            formData={formData}
            onChange={onChange}
            hasVariationRows={hasVariationRows}
            variantShipping={variantShipping}
          />
        </table>
      </div>
    </div>
  );
}

function ProductForm({ customClass }) {
  const [formData, setFormData] = useState({
    basicInfo: {
      productName: "",
      category: "",
      media: {
        productImages: [],
        buyerPromotionImage: [],
        productVideo: [],
      },
    },
    productDetails: {
      pricing: {
        current: "",
        original: "",
      },
      stock: "",
      availability: true,
      freeItems: "",
      sku: "",
      variations: [
        {
          type: "Color Family",
          values: [],
        },
      ],
    },
    specifications: {
      brand: {
        name: "",
        logo: "",
      },
      numberOfPieces: "",
      powerSource: "",
      additionalSpecs: [],
    },
    description: {
      main: "",
      highlights: "",
      tags: [],
      whatsInBox: "",
    },
    shipping: {
      packageWeight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      dangerousGoods: "None",
      warranty: {
        type: "",
        period: "",
        policy: "",
      },
    },
    uiState: {
      additionalFields: {
        warranty: false,
        additionalSpecs: false,
        description: false,
      },
      variantShipping: false,
    },
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = useCallback((e, name, value, customizer) => {
    console.log(e, name, value, customizer);

    if (e) {
      ({ name, value } = e.target);
    }

    const customizedValue = customizer ? customizer(value) : value;

    setFormData((prevData) => set({ ...prevData }, name, customizedValue));
  }, []);

  const handleDebouncedChange = useMemo(
    () => debounce(handleInputChange, 300),
    [handleInputChange]
  );

  const handleAddVariantItem = useCallback(
    (inputValue, variantImages, variationIndex) => {
      if (!inputValue.trim()) return;

      const newVariant = {
        id: uuidv4(),
        name: inputValue,
        variantImages: variantImages || [],
        pricing: { current: "", original: "" },
        stock: "",
        availability: true,
        freeItems: "",
        sku: "",
        packageWeight: "",
        dimensions: { length: "", width: "", height: "" },
      };

      setFormData((prevData) => {
        const updatedVariations = [...prevData.productDetails.variations];
        if (updatedVariations[variationIndex]) {
          updatedVariations[variationIndex].values.push(newVariant);
        }
        return {
          ...prevData,
          productDetails: {
            ...prevData.productDetails,
            variations: updatedVariations,
          },
        };
      });
    },
    []
  );

  const handleRemoveVariantItem = useCallback((variationIndex, valueIndex) => {
    setFormData((prevData) => {
      const updatedVariations = [...prevData.productDetails.variations];
      const updatedValues = [...updatedVariations[variationIndex].values];
      updatedValues.splice(valueIndex, 1);

      updatedVariations[variationIndex] = {
        ...updatedVariations[variationIndex],
        values: updatedValues,
      };

      return {
        ...prevData,
        productDetails: {
          ...prevData.productDetails,
          variations: updatedVariations,
        },
      };
    });
  }, []);

  const multiVariantShippingCondition =
    formData.productDetails.variations.length &&
    formData.productDetails.variations[0].values.length > 1;

  const handleApplyToAll = () => {
    const { pricing, stock, sku } = formData.productDetails;
    const updatedVariations = formData.productDetails.variations.map(
      (variation) => ({
        ...variation,
        values: variation.values.map((value) => ({
          ...value,
          pricing: {
            current: pricing.current || value.pricing.current,
            original: pricing.original || value.pricing.original,
          },
          stock: stock || value.stock,
          sku: sku || value.sku,
        })),
      })
    );

    setFormData((prevData) => ({
      ...prevData,
      productDetails: {
        ...prevData.productDetails,
        variations: updatedVariations,
      },
    }));
  };

  const handleSetVariantShipping = () => {
    setFormData((prevData) => ({
      ...prevData,
      uiState: {
        ...prevData.uiState,
        variantShipping: !prevData.uiState.variantShipping,
      },
    }));
  };

  const toggleShowAdditionalFields = (section) => {
    setFormData((prevData) => ({
      ...prevData,
      uiState: {
        ...prevData.uiState,
        additionalFields: {
          ...prevData.uiState.additionalFields,
          [section]: !prevData.uiState.additionalFields[section],
        },
      },
    }));
  };

  const validateForm = async () => {
    try {
      await productFormSchema.validate(formData, { abortEarly: false });
      setFormErrors({}); // Clear errors if validation passes
      return true; // Form is valid
    } catch (error) {
      const errors = {};
      error.inner.forEach((err) => {
        errors[err.path] = err.message; // Create a mapping of field errors
      });
      setFormErrors(errors); // Update state with validation errors
      return false; // Form is invalid
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitter = e?.nativeEvent?.submitter;
    if (submitter.name !== "submitBtn") return;

    const isValid = await validateForm(); // Validate the form data
    if (isValid) {
      console.log("Form submitted", formData);
      // Handle successful form submission (e.g., API call)
    } else {
      // Optionally, display validation errors to the user
      // You can update your UI with the error messages stored in the `errors` object
    }
  };

  useEffect(() => {
    if (!multiVariantShippingCondition) {
      setFormData((prevData) => ({
        ...prevData,
        uiState: { ...prevData.uiState, variantShipping: false },
      }));
    }
  }, [multiVariantShippingCondition]);

  const formSections = [
    {
      title: "Basic Information",
      customClass: styles.basicInfo,
      fields: [
        {
          label: "Product Name",
          name: "basicInfo.productName",
          suffixDisplay: { maxValue: 255 },
          type: "text",
          placeholder: "Nikon Coolpix A300",
        },
        {
          label: "Category",
          name: "basicInfo.category",
          type: "text",
          formInputType: "dropdown",
          placeholder: "Please select category or search with keyword",
          options: [
            "Electronics",
            "Clothing",
            "Accessories",
            "Home & Garden",
            "Sports & Outdoors",
            "Books & Magazines",
            "Toys & Games",
            "Other",
            "Gifts & Wishlists",
            "Merchandise & Collectibles",
            "Services",
            "Art & Crafts",
            "Pet Supplies",
            "Home Improvement",
            "Baby & Kids",
            "Sports & Fitness",
          ],
        },
        {
          label: "Product Images",
          name: "basicInfo.media.productImages",
          type: "file",
          formInputType: "media",
          fileType: "image",
          maxFiles: 5,
        },
        {
          label: "Buyer Promotion Image",
          name: "basicInfo.media.buyerPromotionImage",
          type: "file",
          formInputType: "media",
          fileType: "image",
          maxFiles: 1,
          guideComponent: (
            <Guidelines
              content={["White Background Image", "See Example"]}
              guideType="imageGuidelines"
            />
          ),
        },
        {
          label: "Product Video",
          name: "basicInfo.media.productVideo",
          type: "file",
          formInputType: "media",
          fileType: "video",
          maxFiles: 1,
          guideComponent: (
            <Guidelines
              content={[
                "Min size: 480x480 px, max video length: 60 seconds, max file size: 100MB.",
                "Supported Format: mp4",
                "New Video might take up to 36 hrs to be approved",
              ]}
              guideType="videoGuidelines"
            />
          ),
        },
      ],
    },
    {
      title: "Product Specification",
      message:
        "Filling more product specification will increase product searchability.",
      customClass: styles.productSpec,
      showMoreBtnProps: {
        handleShowMore: () => toggleShowAdditionalFields("additionalSpecs"),
        section: "additionalSpecs",
        additionalFields: formData.uiState.additionalFields,
      },
      fields: [
        {
          label: "Brand",
          name: "specifications.brand.name",
          type: "text",
          placeholder: "Brand Name",
        },
        {
          label: "Number of Pieces",
          name: "specifications.numberOfPieces",
          type: "text",
          placeholder: "Number of Pieces",
        },
        {
          label: "Power Source",
          name: "specifications.powerSource",
          type: "text",
          placeholder: "Power Source",
        },
        {
          label: "Additional Specifications",
          name: "specifications.additionalSpecs",
          type: "text",
          placeholder: "Additional Specifications",
          condition: (formData) =>
            formData.uiState.additionalFields.additionalSpecs, // Example condition for conditional rendering
        },
      ],
    },
    {
      title: "Price, Stock & Variants",
      message:
        "You can add variants to a product that has more than one option, such as size or color.",
      customClass: styles.productPSV,
      fields: [
        {
          formInputType: "productVariations",
          variations: formData.productDetails.variations,
          handleAddVariantItem: handleAddVariantItem,
          handleRemoveVariantItem: handleRemoveVariantItem,
        },
        {
          formInputType: "productPriceStockWrapper",
          variations: formData.productDetails.variations,
          formData: formData,
          handleApplyToAll: handleApplyToAll,
          variantShipping: formData.uiState.variantShipping,
        },
      ],
    },
    {
      title: "Product Description",
      customClass: styles.productDesc,
      showMoreBtnProps: {
        handleShowMore: () => toggleShowAdditionalFields("description"),
        section: "description",
        additionalFields: formData.uiState.additionalFields,
      },
      fields: [
        {
          label: "Main Description",
          name: "description.main",
          type: "textarea",
          formInputType: "textarea",
          onChange: handleDebouncedChange,
        },
        {
          label: "Highlights",
          name: "description.highlights",
          type: "textarea",
          formInputType: "textarea",
          onChange: handleDebouncedChange,
        },
        {
          label: "Tags",
          name: "description.tags",
          type: "text",
          placeholder: "Ex: New, Sale, Bestseller",
          onChange: (e) =>
            handleInputChange(e, null, null, (value) =>
              value.split(", ").map((tag) => tag.trim())
            ),
          condition: (formData) =>
            formData.uiState.additionalFields.description, // Example condition for conditional rendering
        },
        {
          label: "What's in the Box",
          name: "description.whatsInBox",
          type: "text",
          placeholder: "Ex: 1x product, 1x accessory",
          condition: (formData) =>
            formData.uiState.additionalFields.description, // Example condition for conditional rendering
        },
      ],
    },
    {
      title: "Shipping & Warranty",
      message:
        "Switch to enter different package dimensions & weight for variations",
      customClass: styles.productSW,
      additionalJsx: (
        <AdditionalJsx
          currState={formData.uiState.variantShipping}
          customClickHandler={handleSetVariantShipping}
          disableCondition={!multiVariantShippingCondition}
        />
      ),
      showMoreBtnProps: {
        btnText: "More Warranty Settings",
        handleShowMore: () => toggleShowAdditionalFields("warranty"),
        section: "warranty",
        additionalFields: formData.uiState.additionalFields,
      },
      fields: [
        {
          label: "Package Weight",
          name: "shipping.packageWeight",
          type: "number",
          placeholder: "0.01 - 300",
          condition: (formData) => !formData.uiState.variantShipping, // Example condition for conditional rendering
        },
        {
          label: "Package Dimensions (L x W x H)",
          name: "shipping.dimensions",
          type: "number",
          formInputType: "inputGroup",
          groupType: "input",
          placeholder: "0.01 - 300",
          condition: (formData) => !formData.uiState.variantShipping, // Example condition for conditional rendering
        },
        {
          label: "Dangerous Goods",
          name: "shipping.dangerousGoods",
          type: "radio",
          groupType: "radio",
          formInputType: "inputGroup",
          options: ["None", "Contains battery / flammables / liquid"],
          customClass: styles.radioGroup,
        },
        {
          label: "Warranty Type",
          name: "shipping.warranty.type",
          type: "text",
          placeholder: "Warranty Type",
          condition: (formData) => formData.uiState.additionalFields.warranty, // Example condition for conditional rendering
        },
        {
          label: "Warranty Period",
          name: "shipping.warranty.period",
          type: "text",
          placeholder: "Warranty Period",
          condition: (formData) => formData.uiState.additionalFields.warranty, // Example condition for conditional rendering
        },
        {
          label: "Warranty Policy",
          name: "shipping.warranty.policy",
          type: "text",
          placeholder: "Warranty Policy",
          condition: (formData) => formData.uiState.additionalFields.warranty, // Example condition for conditional rendering
        },
      ],
    },
  ];

  return (
    <form
      className={classNames(styles.productForm, customClass, "flex flex-col")}
      onSubmit={handleSubmit}
      action="/products/manage"
      method="post"
      noValidate
      encType="multipart/form-data"
    >
      {formSections.map(({ title, fields, ...rest }) => (
        <FormSection key={`${title}${uuidv4()}`} title={title} {...rest}>
          {fields.map(
            ({ name, formInputType, condition, onChange, ...rest }) => {
              const handleChange = onChange || handleInputChange;
              if (condition && !condition(formData)) return null;

              if (formInputType === "media") {
                return (
                  <MediaInput
                    key={`${name}${uuidv4()}`}
                    name={name}
                    value={get(formData, name)}
                    onChange={handleChange}
                    {...rest}
                  />
                );
              } else if (formInputType === "dropdown") {
                return (
                  <DropdownInput
                    key={`${name}${uuidv4()}`}
                    name={name}
                    value={get(formData, name)}
                    onChange={handleChange}
                    {...rest}
                  />
                );
              } else if (formInputType === "productVariations") {
                return (
                  <ProductVariations
                    key={`${name}${uuidv4()}`}
                    name={name}
                    value={get(formData, name)}
                    onChange={handleChange}
                    {...rest}
                  />
                );
              } else if (formInputType === "productPriceStockWrapper") {
                return (
                  <ProductPriceStockWrapper
                    key={`${name}${uuidv4()}`}
                    name={name}
                    value={get(formData, name)}
                    onChange={handleChange}
                    {...rest}
                  />
                );
              } else if (formInputType === "inputGroup") {
                return (
                  <MultiInputGroup
                    key={`${name}${uuidv4()}`}
                    name={name}
                    value={get(formData, name)}
                    onChange={handleChange}
                    {...rest}
                  />
                );
              } else {
                return (
                  <FormInput
                    key={`${name}${uuidv4()}`}
                    name={name}
                    value={get(formData, name)}
                    onChange={handleChange}
                    {...rest}
                  />
                );
              }
            }
          )}
        </FormSection>
      ))}

      <button
        type="submit"
        name="submitBtn"
        className={`${styles.submitButton} primary-btn`}
      >
        Submit
      </button>
    </form>
  );
}

export default ProductForm;
