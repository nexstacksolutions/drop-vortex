import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import set from "lodash.set";
import debounce from "lodash/debounce";
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
  showVariantActions = true,
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

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    onChange(variationIndex, valueIndex, field, value);
  };

  const updatedValueIndex =
    valueIndex === undefined ? "addVariantItem" : valueIndex;

  return (
    <div className={`${styles.variantItem} flex align-center`}>
      <FormInput
        name={`productDetails.variations-${variationIndex}-${updatedValueIndex}-name`}
        type="text"
        placeholder="Please type or select"
        value={(variantData && variantData.name) || inputValue}
        onChange={
          onChange
            ? (e) => handleInputChange(e, "name")
            : (e) => setState({ ...state, inputValue: e.target.value })
        }
        onKeyDown={handleKeyDown}
        customClass={styles.formInput}
      />

      {showVariantImages && (
        <MediaInput
          name={`productDetails.variations-${variationIndex}-${updatedValueIndex}-variantImages`}
          fileType="image"
          maxFiles={5}
          value={variantData?.variantImages || variantImages}
          resetTrigger={resetTrigger}
          onChange={(newMedia) =>
            onChange
              ? onChange(variationIndex, valueIndex, "variantImages", newMedia)
              : setState({ ...state, variantImages: newMedia?.target?.value })
          }
          customClass={styles.mediaInput}
        />
      )}

      {showVariantActions && (
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
              showVariantActions={false}
              handleAddVariantItem={(inputValue, variantImages) =>
                handleAddVariantItem(inputValue, variantImages, variationIndex)
              }
              variationIndex={variationIndex}
              showVariantImages={showVariantImages}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductPriceStockWrapper = ({ variations = [], onChange }) => {
  // Memoize the variationRows and variationColumns computations
  const variationRows = useMemo(() => {
    if (variations.length === 0) return [];

    // Find the maximum length of the 'values' array across all variations
    const maxValuesLength = Math.max(...variations.map((v) => v.values.length));

    // Create rows based on the longest variation set
    return Array.from({ length: maxValuesLength }, (_, index) =>
      variations.reduce((acc, variation) => {
        // Safely access the value at the current index or default to an empty object
        acc[variation.type] = variation.values[index]?.name || "";
        return acc;
      }, {})
    );
  }, [variations]);

  const variationColumns = useMemo(() => {
    return variations.map((variation) => variation.type);
  }, [variations]);

  const additionalHeaders = [
    "Price",
    "Special Price",
    "Stock",
    "Seller SKU",
    "Free Items",
    "Availability",
  ];

  const placeholders = [
    "Price",
    "Special Price",
    "Stock",
    "Seller SKU",
    "Free Items",
  ];

  // Table header component
  const TableHeaders = ({ rows, columns, additionalHeaders }) => (
    <thead>
      <tr>
        {rows.length > 0 && columns.map((col) => <th key={col}>{col}</th>)}
        {additionalHeaders.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
  );

  // Table row component
  const TableRows = ({ rows, placeholders }) => (
    <tbody>
      {rows.length > 0 ? (
        rows.map((row, idx) => (
          <tr key={idx}>
            {variationColumns.map((val, i) => (
              <td key={i}>{row[val]}</td>
            ))}
            {placeholders.map((placeholder) => (
              <td key={placeholder}>
                <input type="text" />
              </td>
            ))}
            <td>
              <label className={styles.switch}>
                <input type="checkbox" />
                <span className={styles.slider}></span>
              </label>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          {placeholders.map((placeholder) => (
            <td key={placeholder}>
              <input type="text" placeholder={placeholder} />
            </td>
          ))}
          <td>
            <label className={styles.switch}>
              <input type="checkbox" />
              <span className={styles.slider}></span>
            </label>
          </td>
        </tr>
      )}
    </tbody>
  );

  // Render the entire table
  return (
    <div className={`${styles.productPriceStockWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      <div className={styles.priceStockTable}>
        <table>
          <TableHeaders
            rows={variationRows}
            columns={variationColumns}
            additionalHeaders={additionalHeaders}
          />
          <TableRows rows={variationRows} placeholders={placeholders} />
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
      variations: [
        {
          type: "Color Family",
          values: [],
        },
      ],

      pricing: {
        current: "",
        original: "",
      },

      stock: "",
      availability: "",

      sku: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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
  };

  const debouncedChange = useMemo(
    () => debounce((e) => handleInputChange(e), 300),
    []
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

  const handleVariationChange = useCallback(
    (variationIndex, valueIndex, field, newValue) => {
      setFormData((prevData) => {
        const updatedVariations = [...prevData.productDetails.variations];

        // Ensure we have valid structure in the variations
        if (!updatedVariations[variationIndex].values[valueIndex]) {
          updatedVariations[variationIndex].values[valueIndex] = {};
        }

        // Update specific field (like 'variantImages') at the given index
        updatedVariations[variationIndex].values[valueIndex][field] =
          newValue?.target?.value || newValue;

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
          onChange={handleVariationChange}
          handleAddVariantItem={handleAddVariantItem}
          handleRemoveVariantItem={handleRemoveVariantItem}
        />

        <ProductPriceStockWrapper
          variations={formData.productDetails.variations}
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

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
