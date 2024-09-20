import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import { useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import classNames from "classnames";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { RiDeleteBin5Line, RiEdit2Line, RiMenuFill } from "react-icons/ri";

const Guidelines = ({ content, guideType }) => (
  <div className={classNames(styles.guideContainer, styles[guideType])}>
    <ul>
      {content.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

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

const FormInput = ({
  label,
  name,
  type,
  placeholder,
  options,
  value,
  onChange,
  inputList,
  customClass,
  showErr = false,
  onKeyDown, // Add this prop
}) => {
  const handleQuillChange = useCallback(
    (content) => onChange({ target: { name, value: content } }),
    [name, onChange]
  );

  const formInputId = `${name}-form-input`;

  return (
    <div
      className={classNames(styles.formInputWrapper, "flex flex-col", {
        [customClass]: customClass,
      })}
    >
      {label && <label htmlFor={formInputId}>{label}</label>}

      <div className={styles.inputWrapper}>
        {type === "select" && (
          <select
            name={name}
            id={formInputId}
            value={value}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {type === "textarea" && (
          <ReactQuill
            value={value}
            id={formInputId}
            onChange={handleQuillChange}
          />
        )}

        {type === "radio" && (
          <div className={classNames(styles.radioGroup, "flex")}>
            {options.map((option, index) => (
              <div
                key={index}
                className={classNames(styles.radioItem, "flex flex-center")}
              >
                <input
                  type="radio"
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
        )}

        {inputList && name === "shipping.dimensions" && (
          <div className={classNames(styles.inputGroup, "flex")}>
            {Object.keys(value).map((dimension, index) => (
              <input
                key={index}
                type={type}
                name={dimension}
                value={value[dimension]}
                placeholder={
                  dimension.charAt(0).toUpperCase() + dimension.slice(1)
                }
                onChange={(e) =>
                  onChange({
                    target: {
                      name: "shipping.dimensions",
                      value: { ...value, [dimension]: e.target.value },
                    },
                  })
                }
              />
            ))}
          </div>
        )}

        {!["select", "textarea", "radio"].includes(type) && !inputList && (
          <input
            type={type}
            name={name}
            id={formInputId}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown} // Add onKeyDown here
          />
        )}
      </div>

      {showErr && <p className={styles.errorMsg}>Error message</p>}
    </div>
  );
};

const MediaInput = ({
  label,
  name,
  maxFiles,
  fileType,
  value,
  onChange,
  showErr,
  customClass,
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
    [mediaFiles, maxFiles, onChange, name]
  );

  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
    onChange({ target: { name, value: updatedFiles } });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const fileInputId = `${name}-file-upload`;

  return (
    <div
      className={classNames(styles.mediaInputContainer, "flex flex-col", {
        [customClass]: customClass,
      })}
    >
      {label && <label>{label}</label>}
      <div
        className={classNames(styles.mediaInputWrapper, "flex align-center")}
      >
        <div className={classNames(styles.mediaPreviewContainer, "flex")}>
          {mediaFiles.map((file, index) => (
            <div
              key={index}
              className={classNames(
                styles.mediaPreviewItem,
                "flex flex-center"
              )}
            >
              {fileType === "image" ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Media ${index + 1}`}
                  className={styles.mediaImage}
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className={styles.mediaVideo}
                />
              )}
              <div
                className={classNames(
                  styles.mediaActionsContainer,
                  "flex justify-between"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className={styles.removeMediaBtn}
                >
                  <RiDeleteBin5Line />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className={styles.editMediaBtn}
                >
                  <RiEdit2Line />
                </button>
              </div>
            </div>
          ))}
          {mediaFiles.length < maxFiles && (
            <div className={styles.addMediaWrapper}>
              <label htmlFor={fileInputId} className="flex flex-center">
                <FaPlus />
              </label>
              <input
                type="file"
                id={fileInputId}
                name={name}
                accept={fileType === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          )}
        </div>
        {GuideComponent}
      </div>
      {showErr && <p className={styles.errorMsg}>Error message</p>}
    </div>
  );
};

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
  variantData,
  variationIndex,
  valueIndex,
  addVariantImages,
  onChange,
}) => {
  // Local state to track input value for new variant
  const [inputValue, setInputValue] = useState(variantData.name || "");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleAddVariantItem(inputValue, variationIndex);
      setInputValue("");
    }
  };

  const handleInputChange = (e, variationIndex, valueIndex, field) => {
    const { name, value } = e.target;
    // Call the parent `onChange` handler, passing in the updated value
    onChange(variationIndex, valueIndex, field, value);
  };

  const handleMediaChange = (newMedia, variationIndex, valueIndex) => {
    // Call the parent `onChange` handler with the updated media input
    onChange(variationIndex, valueIndex, "productImages", newMedia);
  };

  return (
    <div className={`${styles.variantItem} flex align-center`}>
      <FormInput
        name="variantName"
        type="text"
        placeholder="Please type or select"
        value={onChange ? variantData.name : inputValue} // If editing, use onChange; else use local state
        onChange={(e) =>
          onChange
            ? handleInputChange(e, variationIndex, valueIndex, "name")
            : setInputValue(e.target.value)
        }
        onKeyDown={handleKeyDown}
        customClass={styles.formInput}
      />

      {addVariantImages && (
        <MediaInput
          name="variantImages"
          fileType="image"
          maxFiles={5}
          value={variantData.productImages || []}
          onChange={(newMedia) =>
            handleMediaChange(newMedia, variationIndex, valueIndex)
          }
          customClass={styles.mediaInput}
        />
      )}

      {showVariantActions && (
        <div className={`${styles.variantActions} flex justify-end`}>
          <button type="button" className={styles.actionButton}>
            <RiDeleteBin5Line />
          </button>
          <button type="button" className={styles.actionButton}>
            <RiMenuFill />
          </button>
        </div>
      )}
    </div>
  );
};

const ProductVariations = ({ variations, onChange, handleAddVariantItem }) => {
  return (
    <div className={`${styles.productVariationsWrapper} flex flex-col`}>
      {variations.map((variation, variationIndex) => (
        <div
          key={variationIndex}
          className={`${styles.variationItem} flex flex-col`}
        >
          <div className={`${styles.variationHeader} flex flex-col`}>
            <span className={styles.variationTitle}>{`Variant ${
              variationIndex + 1
            }`}</span>
            <div className={`${styles.variationInfo} flex flex-col`}>
              <span className={styles.variationName}>Variant Name</span>
              <span className={styles.variationType}>{variation.type}</span>
            </div>
          </div>

          <div className={`${styles.variationBody} flex flex-col`}>
            {/* Show all the values in variation.values array */}
            <div className={`${styles.variantWrapper} flex flex-col`}>
              {variation.values.map((variantData, valueIndex) => (
                <VariantItem
                  key={valueIndex}
                  variations={variations}
                  variantData={variantData}
                  onChange={onChange}
                  variationIndex={variationIndex}
                  valueIndex={valueIndex}
                  addVariantImages={true} // Toggle based on logic
                />
              ))}
            </div>

            {/* Add new value input */}
            <VariantItem
              showVariantActions={false}
              handleAddVariantItem={(inputValue) =>
                handleAddVariantItem(inputValue, variationIndex)
              }
              variantData={{ name: "" }} // Empty object for new input
              variationIndex={variationIndex}
              addVariantImages={false} // No image input for new entries
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductPriceStockWrapper = ({ variations }) => {
  const generateVariationRows = () => {
    if (!variations.length) return [];

    return variations[0].values.map((_, index) => {
      const variationRow = {};
      variations.forEach((variation) => {
        variationRow[variation.type] = variation.values[index]?.name || "";
      });
      return variationRow;
    });
  };

  const generateVariationColumns = () => {
    if (!variations.length) return [];

    return variations.map((variation) => variation.type);
  };

  const variationRows = generateVariationRows();
  const variationColumns = generateVariationColumns();

  return (
    <div className={`${styles.productPriceStockWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      <div className={styles.priceStockTable}>
        <table>
          <thead>
            <tr>
              {variationColumns.length &&
                variationColumns.map((variantType, index) => (
                  <th key={index}>{variantType}</th>
                ))}
              <th>Price</th>
              <th>Special Price</th>
              <th>Stock</th>
              <th>Seller SKU</th>
              <th>Free Items</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {variationRows.map((rowValues, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(rowValues).map((key, colIndex) => (
                  <td key={colIndex}>{rowValues[key]}</td>
                ))}
                <td>
                  <input type="text" placeholder="Price" />
                </td>
                <td>
                  <div className={styles.specialPriceWrapper}>Add</div>
                </td>
                <td>
                  <input type="text" placeholder="Stock" />
                </td>
                <td>
                  <input type="text" placeholder="Seller SKU" />
                </td>
                <td>
                  <input type="text" placeholder="Free Items" />
                </td>
                <td>
                  <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
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

    tags: [],

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
      product: "",
      highlights: "",
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

  const handleNestedInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prevData) => {
      const keys = name.split(".");
      let updatedData = { ...prevData };
      let current = updatedData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      return updatedData;
    });
  };

  const handleInputChange = (e) => {
    handleNestedInputChange(e, setFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleShowMore = (section) => {
    setShowMoreOptions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleVariationChange = (
    variationIndex,
    valueIndex,
    field,
    newValue
  ) => {
    // Create a copy of formData
    const updatedFormData = { ...formData };

    // Update the specific variation field
    updatedFormData.productDetails.variations[variationIndex].values[
      valueIndex
    ][field] = newValue;

    // Set the new formData with updated variations
    setFormData(updatedFormData);
  };

  const handleAddVariantItem = (inputValue, variationIndex) => {
    const newVariant = {
      name: inputValue,
      productImages: [], // Empty productImages if necessary
    };

    console.log("newVariant", newVariant);

    // Use functional setState to ensure you're working with the latest state
    setFormData((prevData) => {
      const updatedVariations = [...prevData.productDetails.variations];

      // Append the new variant to the existing values array
      updatedVariations[variationIndex].values = [
        ...updatedVariations[variationIndex].values,
        newVariant,
      ];

      return {
        ...prevData,
        productDetails: {
          ...prevData.productDetails,
          variations: updatedVariations,
        },
      };
    });
  };

  return (
    <form
      className={classNames(styles.productForm, customClass, "flex flex-col")}
      onSubmit={handleSubmit}
    >
      {/* Basic Information Section */}
      <FormSection title="Basic Information" customClass={styles.basicInfo}>
        <FormInput
          label="Product Name"
          name="basicInfo.productName"
          type="text"
          placeholder="Ex: Nikon Coolpix A300 Digital Camera"
          value={formData.basicInfo.productName}
          onChange={handleInputChange}
        />
        <FormInput
          label="Category"
          name="basicInfo.category"
          type="select"
          options={["Electronics", "Clothing", "Accessories"]}
          value={formData.basicInfo.category}
          onChange={handleInputChange}
        />
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
          handleShowMore: () => handleShowMore("additionalSpecs"),
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
          handleAddVariantItem={handleAddVariantItem} // Pass the handler
        />

        <ProductPriceStockWrapper
          variations={formData.productDetails.variations}
        />
      </FormSection>

      {/* Product Description Section */}
      <FormSection
        title="Product Description"
        showMoreBtnProps={{
          handleShowMore: () => handleShowMore("description"),
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
          onChange={handleInputChange}
        />

        <FormInput
          label="Highlights"
          name="description.highlights"
          type="textarea"
          value={formData.description.highlights}
          onChange={handleInputChange}
        />
        {showMoreOptions.description && (
          <>
            <FormInput
              label="Tags"
              name="tags"
              type="text"
              placeholder="Ex: New, Sale, Bestseller"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value.split(", ") })
              }
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
          handleShowMore: () => handleShowMore("warranty"),
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
          value={{
            length: formData.shipping.dimensions.length,
            width: formData.shipping.dimensions.width,
            height: formData.shipping.dimensions.height,
          }}
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
