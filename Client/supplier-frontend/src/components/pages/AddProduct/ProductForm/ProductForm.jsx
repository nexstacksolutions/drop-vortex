import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import { set, get } from "lodash";
import ReactQuill from "react-quill";
import classNames from "classnames";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { RiDeleteBin5Line, RiEdit2Line, RiMenuFill } from "react-icons/ri";
import { useMemo } from "react";

const Guidelines = ({ content, guideType }) => {
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
};

const FormSection = ({
  title,
  message,
  children,
  customClass,
  showMoreBtnProps,
}) => (
  <section
    className={classNames(styles.formSection, customClass, "flex flex-col")}
  >
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </div>
    <div className={classNames(styles.sectionContent, "flex flex-col")}>
      {children}
    </div>
    {showMoreBtnProps && <ShowMoreBtn {...showMoreBtnProps} />}
  </section>
);

const InputWrapper = ({ children, label, formInputId, customClass }) => (
  <div
    className={classNames(
      styles.formInputWrapper,
      "flex flex-col",
      customClass
    )}
  >
    {label && <label htmlFor={formInputId}>{label}</label>}
    {children}
  </div>
);

const generateInputByType = ({
  type,
  formInputId,
  name,
  value,
  checked,
  placeholder,
  fileType,
  inputRef,
  onChange,
  options,
  handleQuillChange,
  inputList,
  customOnKeyDown,
}) => {
  if (inputList && name === "shipping.dimensions") {
    return (
      <div className={`${styles.inputGroup} flex`}>
        {Object.keys(value).map((dimension, index) => (
          <input
            key={index}
            type={type}
            name={dimension}
            value={value[dimension]}
            placeholder={dimension.charAt(0).toUpperCase() + dimension.slice(1)}
            onChange={(e) =>
              onChange({
                target: {
                  name: name,
                  value: { ...value, [dimension]: e.target.value },
                },
              })
            }
          />
        ))}
      </div>
    );
  }

  switch (type) {
    case "select":
      return (
        <select name={name} id={formInputId} value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "textarea":
      return (
        <ReactQuill
          value={value}
          id={formInputId}
          onChange={handleQuillChange}
        />
      );
    case "radio":
      return (
        <div className={classNames(styles.radioGroup, "flex")}>
          {options.map((option, index) => (
            <div
              key={index}
              className={classNames(styles.radioItem, "flex flex-center")}
            >
              <input
                type={type}
                id={`${name}${index}`}
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
              />
              <label htmlFor={`${name}${index}`}>{option}</label>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <input
          type={type}
          name={name}
          id={formInputId}
          value={value}
          checked={checked}
          placeholder={placeholder}
          accept={fileType === "image" ? "image/*" : "video/*"}
          onChange={onChange}
          ref={inputRef}
          onKeyDown={customOnKeyDown}
        />
      );
  }
};

const FormInput = ({
  label,
  name,
  type,
  fileType,
  placeholder,
  options,
  value,
  checked,
  onChange,
  inputList,
  inputRef,
  customClass,
  showErr = false,
  onKeyDown,
}) => {
  const formInputId = `${name}-form-input`;
  const handleQuillChange = useCallback(
    (content) => onChange({ target: { name, value: content } }),
    [name, onChange]
  );

  return (
    <InputWrapper
      label={label}
      formInputId={formInputId}
      customClass={customClass}
    >
      {generateInputByType({
        type,
        fileType,
        formInputId,
        name,
        value,
        checked,
        placeholder,
        onChange,
        options,
        handleQuillChange,
        inputList,
        inputRef,
        customOnKeyDown: onKeyDown,
      })}
      {showErr && <p className={styles.errorMsg}>Error message</p>}
    </InputWrapper>
  );
};

const renderMediaFiles = (mediaFiles, fileType, handleRemoveFile) =>
  mediaFiles.map((file, index) => (
    <MediaPreviewItem
      key={index}
      file={file}
      fileType={fileType}
      onRemove={() => handleRemoveFile(index)}
    />
  ));

const MediaInput = ({
  label,
  name,
  maxFiles,
  fileType,
  value,
  onChange,
  resetTrigger,
  customClass,
  showErr,
  GuideComponent,
}) => {
  const [mediaFiles, setMediaFiles] = useState(value || []);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (mediaFiles.length + files.length <= maxFiles) {
        const updatedFiles = [...mediaFiles, ...files];
        setMediaFiles(updatedFiles);
        onChange({ target: { name, value: updatedFiles } });
        if (fileInputRef.current) fileInputRef.current.value = null;
      }
    },
    [mediaFiles, name, maxFiles, onChange]
  );

  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
    onChange({ target: { name, value: updatedFiles } });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  useEffect(() => {
    if (resetTrigger) {
      setMediaFiles([]);
      onChange({ target: { name, value: [] } });
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
              type="file"
              fileType="image"
              inputRef={fileInputRef}
              onChange={handleFileChange}
              customClass={styles.addMediaWrapper}
            />
          )}
        </div>
        {GuideComponent}
      </div>
      {showErr && <p className={styles.errorMsg}>Error message</p>}
    </InputWrapper>
  );
};

const MediaPreviewItem = ({ file, fileType, onRemove }) => (
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

const ShowMoreBtn = ({
  btnText = "Show More",
  handleShowMore,
  section,
  showMoreOptions,
}) => {
  return (
    <button
      onClick={handleShowMore}
      className={classNames(styles.showMoreBtn, {
        [styles.showMoreBtnActive]: showMoreOptions[section],
      })}
    >
      <span> {!showMoreOptions[section] ? btnText : "Show Less"}</span>
      <FaAngleDown />
    </button>
  );
};

const VariantItem = ({
  handleAddVariantItem,
  handleRemoveVariantItem,
  variantData,
  variationIndex,
  valueIndex,
  showVariantImages,
  onChange,
}) => {
  const [state, setState] = useState({
    inputValue: "",
    variantImages: [],
    resetTrigger: false,
  });

  const { inputValue, variantImages, resetTrigger } = state;

  const resetVariantForm = useCallback(() => {
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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && inputValue.trim()) {
        handleAddVariantItem(inputValue, variantImages, variationIndex);
        resetVariantForm();
      }
    },
    [
      inputValue,
      variantImages,
      resetVariantForm,
      variationIndex,
      handleAddVariantItem,
    ]
  );

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
          onChange={(newMedia) =>
            onChange
              ? onChange(newMedia)
              : setState({ ...state, variantImages: newMedia?.target?.value })
          }
          customClass={styles.mediaInput}
        />
      )}

      {onChange && (
        <div className={`${styles.variantActions} flex justify-end`}>
          <button
            onClick={() => handleRemoveVariantItem(variationIndex, valueIndex)}
            type="button"
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
};

const ProductVariations = ({
  variations,
  onChange,
  handleAddVariantItem,
  handleRemoveVariantItem,
}) => {
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
                  checked={showVariantImages}
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
};

// Table header component
const TableHeaders = ({
  variationRows,
  variationColumnNames,
  additionalHeaderNames,
}) => (
  <thead>
    <tr>
      {variationRows.length > 0 &&
        variationColumnNames.map((columnName, columnIndex) => (
          <th key={columnIndex}>{columnName}</th>
        ))}
      {additionalHeaderNames.map((headerName, headerIndex) => (
        <th key={headerIndex}>{headerName}</th>
      ))}
    </tr>
  </thead>
);

// Table row component
const TableRows = ({
  variationRows,
  variationColumnNames,
  additionalInputFields,
  formData,
  onChange,
}) => {
  return (
    <tbody>
      {variationRows.length > 0 ? (
        variationRows.map((rowValues, rowIndex) => (
          <tr key={`variation-row-${rowIndex}`}>
            {variationColumnNames.map((columnName, columnIndex) => (
              <td key={`variation-col-${columnIndex}`}>
                {rowValues[columnName]}
              </td>
            ))}
            {additionalInputFields.map(
              ({ placeholder, fieldName, inputType = "text" }, index) => (
                <td key={`additional-col-${index}`}>
                  <FormInput
                    name={`productDetails.variations[0].values[${rowIndex}]${fieldName}`}
                    type={inputType}
                    placeholder={placeholder}
                    value={
                      get(
                        formData.productDetails.variations[0].values[rowIndex],
                        fieldName
                      ) || ""
                    }
                    onChange={onChange}
                  />
                </td>
              )
            )}
          </tr>
        ))
      ) : (
        <tr>
          {additionalInputFields.map(
            ({ placeholder, fieldName, inputType = "text" }, index) => (
              <td key={`non-row-${fieldName}-${index}`}>
                <FormInput
                  name={fieldName}
                  type={inputType}
                  placeholder={placeholder}
                  value={get(formData, fieldName)}
                  onChange={onChange}
                />
              </td>
            )
          )}
        </tr>
      )}
    </tbody>
  );
};

const ProductPriceStockWrapper = ({
  variations,
  formData,
  onChange,
  handleApplyToAll,
}) => {
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

  const additionalHeaderNames = [
    "Price",
    "Special Price",
    "Stock",
    "Seller SKU",
    "Free Items",
    "Availability",
  ];

  const additionalInputFields = [
    {
      fieldName: `${
        !variationRows.length > 0 ? "productDetails" : ""
      }.pricing.current`,
      placeholder: "Price",
    },
    {
      fieldName: `${
        !variationRows.length > 0 ? "productDetails" : ""
      }.pricing.original`,
      placeholder: "Special Price",
    },
    {
      fieldName: `${!variationRows.length > 0 ? "productDetails" : ""}.stock`,
      placeholder: "Stock",
    },
    {
      fieldName: `${!variationRows.length > 0 ? "productDetails" : ""}.sku`,
      placeholder: "Seller SKU",
    },
    {
      fieldName: `${
        !variationRows.length > 0 ? "productDetails" : ""
      }.freeItems`,
      placeholder: "Free Items",
    },
    {
      fieldName: `${
        !variationRows.length > 0 ? "productDetails" : ""
      }.availability`,
      inputType: "checkbox",
    },
  ];

  // Render the entire table
  return (
    <div className={`${styles.productPriceStockWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {variationRows.length > 0 && (
        <div className={`${styles.variationInputContainer} flex`}>
          {additionalInputFields
            .slice(0, 4)
            .map(({ placeholder, fieldName, inputType = "text" }, index) => (
              <FormInput
                key={`non-row-${fieldName}-${index}`}
                name={`productDetails${fieldName}`}
                type={inputType}
                placeholder={placeholder}
                value={get(formData.productDetails, fieldName)}
                onChange={onChange}
                className={styles.variationInputField}
              />
            ))}
          <button
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
            variationRows={variationRows}
            variationColumnNames={variationColumnNames}
            additionalHeaderNames={additionalHeaderNames}
          />
          <TableRows
            variationRows={variationRows}
            variationColumnNames={variationColumnNames}
            additionalInputFields={additionalInputFields}
            formData={formData}
            onChange={onChange}
          />
        </table>
      </div>
    </div>
  );
};

const ProductForm = ({ customClass }) => {
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
      availability: "",
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
      dangerousGoods: "",
      warranty: {
        type: "",
        period: "",
        policy: "",
      },
    },
  });

  const [showMoreOptions, setShowMoreOptions] = useState({
    warranty: false,
    additionalSpecs: false,
    description: false,
  });

  const basicInfoFields = [
    {
      label: "Product Name",
      name: "basicInfo.productName",
      type: "text",
      placeholder: "Nikon Coolpix A300",
    },
    {
      label: "Category",
      name: "basicInfo.category",
      type: "select",
      options: ["Electronics", "Clothing", "Accessories"],
    },
  ];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    console.log("input change", name, value);

    setFormData((prevData) => {
      const updatedData = { ...prevData };

      // Check if the field is for tags
      if (name === "description.tags") {
        updatedData.description.tags = value
          .split(",")
          .map((tag) => tag.trim());
      } else {
        set(updatedData, name, value);
      }

      return updatedData;
    });
  }, []);

  const debouncedChange = useMemo(
    () => debounce((e) => handleInputChange(e), 300),
    [handleInputChange]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleShowMoreOption = (section) => {
    setShowMoreOptions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddVariantItem = useCallback(
    (inputValue, variantImages, variationIndex) => {
      // Validate the input
      if (!inputValue.trim()) {
        console.error("Variant name cannot be empty");
        return;
      }

      const newVariant = {
        id: uuidv4(),
        name: inputValue,
        variantImages: Array.isArray(variantImages) ? variantImages : [],
        pricing: {
          current: "",
          original: "",
        },
        stock: "",
        availability: "",
        freeItems: "",
        sku: "",
        packageWeight: "",
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
      };

      setFormData((prevData) => {
        const { productDetails } = prevData;
        const updatedVariations = [...productDetails.variations];

        // Ensure that the variation index is valid
        if (!updatedVariations[variationIndex]) {
          console.error(`No variation found at index ${variationIndex}`);
          return prevData;
        }

        updatedVariations[variationIndex].values.push(newVariant);

        return {
          ...prevData,
          productDetails: {
            ...productDetails,
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

  const handleApplyToAll = (e) => {
    // Extract current values from the outer fields
    const pricing = get(formData.productDetails, "pricing");
    const stock = get(formData.productDetails, "stock");
    const sku = get(formData.productDetails, "sku");

    console.log("Extract", pricing, stock, sku);

    // Update all variations selectively
    const updatedVariations = formData.productDetails.variations.map(
      (variation) => {
        return {
          ...variation,
          values: variation.values.map((value) => ({
            ...value,
            pricing: {
              current: pricing.current || value.pricing.current,
              original: pricing.original || value.pricing.original,
            },
            stock: stock !== "" ? stock : value.stock,
            sku: sku !== "" ? sku : value.sku,
          })),
        };
      }
    );

    // Update formData with new variations
    setFormData((prevData) => ({
      ...prevData,
      productDetails: {
        ...prevData.productDetails,
        variations: updatedVariations,
      },
    }));
  };

  return (
    <form
      className={classNames(styles.productForm, customClass, "flex flex-col")}
      onSubmit={handleSubmit}
    >
      {/* Basic Information Section */}
      <FormSection title="Basic Information" customClass={styles.basicInfo}>
        {basicInfoFields.map(({ label, name, type, ...rest }) => (
          <FormInput
            key={name}
            label={label}
            name={name}
            type={type}
            {...rest}
            value={formData[name]}
            onChange={handleInputChange}
          />
        ))}

        <MediaInput
          label="Product Images"
          name="basicInfo.media.productImages"
          fileType="image"
          maxFiles={5}
          value={formData.basicInfo.media.productImages}
          onChange={(e) => handleInputChange(e)}
        />
        <MediaInput
          label="Buyer Promotion Image"
          name="basicInfo.media.buyerPromotionImage"
          fileType="image"
          maxFiles={1}
          value={formData.basicInfo.media.buyerPromotionImage}
          onChange={(e) => handleInputChange(e)}
          GuideComponent={
            <Guidelines
              content={["White Background Image", "See Example"]}
              guideType="imageGuidelines"
            />
          }
        />
        <MediaInput
          label="Product Video"
          name="basicInfo.media.productVideo"
          fileType="video"
          maxFiles={1}
          value={formData.basicInfo.media.productVideo}
          onChange={(e) => handleInputChange(e)}
          GuideComponent={
            <Guidelines
              content={[
                "Min size: 480x480 px. max video length: 60 seconds. max file size: 100MB.",
                "Supported Format: mp4",
                "New Video might take up to 36 hrs to be approved",
              ]}
              guideType="videoGuidelines"
            />
          }
        />
      </FormSection>

      {/* Product Specification Section */}
      <FormSection
        title="Product Specification"
        message="Fill more product specification will increase product searchability."
        showMoreBtnProps={{
          handleShowMore: () => toggleShowMoreOption("additionalSpecs"),
          section: "additionalSpecs",
          showMoreOptions,
        }}
        customClass={styles.productSpec}
      >
        <FormInput
          label="Brand"
          name="specifications.brand.name"
          type="text"
          placeholder="Brand Name"
          value={formData.specifications.brand.name}
          onChange={handleInputChange}
        />

        <FormInput
          label="Number of Pieces"
          name="specifications.numberOfPieces"
          type="text"
          placeholder="Number of Pieces"
          value={formData.specifications.numberOfPieces}
          onChange={handleInputChange}
        />
        <FormInput
          label="Power Source"
          name="specifications.powerSource"
          type="text"
          placeholder="Power Source"
          value={formData.specifications.powerSource}
          onChange={handleInputChange}
        />

        {showMoreOptions.additionalSpecs && (
          <FormInput
            label="Additional Specifications"
            name="specifications.additionalSpecs"
            type="text"
            placeholder="Additional Specifications"
            value={formData.specifications.additionalSpecs.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  additionalSpecs: e.target.value.split(", "),
                },
              })
            }
          />
        )}
      </FormSection>

      {/* Price, Stock & Variants Section */}
      <FormSection
        title="Price, Stock & Variants"
        message="You can add variants to a product that has more than one option, such as size or color."
        customClass={styles.productPSV}
      >
        <ProductVariations
          variations={formData.productDetails.variations}
          onChange={(e) => handleInputChange(e)}
          handleAddVariantItem={handleAddVariantItem}
          handleRemoveVariantItem={handleRemoveVariantItem}
        />

        <ProductPriceStockWrapper
          variations={formData.productDetails.variations}
          formData={formData}
          handleApplyToAll={handleApplyToAll}
          onChange={(e) => handleInputChange(e)}
        />
      </FormSection>

      {/* Product Description Section */}
      <FormSection
        title="Product Description"
        showMoreBtnProps={{
          handleShowMore: () => toggleShowMoreOption("description"),
          section: "description",
          showMoreOptions,
        }}
        customClass={styles.productDesc}
      >
        <FormInput
          label="Main Description"
          name="description.main"
          type="textarea"
          value={formData.description.main}
          onChange={debouncedChange}
        />

        <FormInput
          label="Highlights"
          name="description.highlights"
          type="textarea"
          value={formData.description.highlights}
          onChange={debouncedChange}
        />
        {showMoreOptions.description && (
          <>
            <FormInput
              label="Tags"
              name="description.tags"
              type="text"
              placeholder="Ex: New, Sale, Bestseller"
              value={formData.description.tags.join(", ")}
              onChange={handleInputChange}
            />
            <FormInput
              label="What's in the Box"
              name="description.whatsInBox"
              type="text"
              placeholder="Ex: 1x product, 1x accessory"
              value={formData.description.whatsInBox}
              onChange={handleInputChange}
            />
          </>
        )}
      </FormSection>

      {/* Shipping & Warranty Section */}
      <FormSection
        title="Shipping & Warranty"
        message="Switch to enter different package dimensions & weight for variations"
        showMoreBtnProps={{
          btnText: "More Warranty Settings",
          handleShowMore: () => toggleShowMoreOption("warranty"),
          section: "warranty",
          showMoreOptions,
        }}
        customClass={styles.productSW}
      >
        <FormInput
          label="Package Weight"
          name="shipping.packageWeight"
          type="number"
          placeholder="0.01 - 300"
          value={formData.shipping.packageWeight}
          onChange={handleInputChange}
        />
        <FormInput
          label="Package Dimensions (L x W x H)"
          name="shipping.dimensions"
          type="number"
          placeholder="0.01 - 300"
          inputList={3}
          value={formData.shipping.dimensions}
          onChange={handleInputChange}
        />
        <FormInput
          label="Dangerous Goods"
          name="shipping.dangerousGoods"
          type="radio"
          options={["None", "Contains battery / flammables / liquid"]}
          value={formData.shipping.dangerousGoods}
          onChange={handleInputChange}
        />
        {showMoreOptions.warranty && (
          <>
            <FormInput
              label="Warranty Type"
              name="shipping.warranty.type"
              type="text"
              placeholder="Warranty Type"
              value={formData.shipping.warranty.type}
              onChange={handleInputChange}
            />
            <FormInput
              label="Warranty Period"
              name="shipping.warranty.period"
              type="text"
              placeholder="Warranty Period"
              value={formData.shipping.warranty.period}
              onChange={handleInputChange}
            />
            <FormInput
              label="Warranty Policy"
              name="shipping.warranty.policy"
              type="text"
              placeholder="Warranty Policy"
              value={formData.shipping.warranty.policy}
              onChange={handleInputChange}
            />
          </>
        )}
      </FormSection>

      <button type="submit" className={`${styles.submitButton} primary-btn`}>
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
