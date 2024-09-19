import styles from "./ProductForm.module.css";
import "react-quill/dist/quill.snow.css";
import { useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import classNames from "classnames";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";

const Guidelines = ({ content, guideType }) => (
  <div className={`${styles[guideType]} ${styles.guideContainer}`}>
    <ul>
      {content.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const FormSection = ({ title, message, children, customClass }) => (
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
  showErr = false,
}) => {
  const handleQuillChange = useCallback(
    (content) => onChange({ target: { name, value: content } }),
    [name, onChange]
  );

  const formInputId = `${name}-file-upload`;

  return (
    <div className={classNames(styles.formInputWrapper, "flex flex-col")}>
      <label htmlFor={formInputId}>{label}</label>

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
  GuideComponent,
}) => {
  const [mediaFiles, setMediaFiles] = useState(value || []);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (mediaFiles.length + files.length <= maxFiles) {
      const updatedFiles = [...mediaFiles, ...files];
      setMediaFiles(updatedFiles);
      onChange({ target: { name, value: updatedFiles } });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

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
    <div className={classNames(styles.mediaInputContainer, "flex flex-col")}>
      <label>{label}</label>
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
          type: "",
          values: [
            {
              name: "",
              priceModifier: "",
            },
          ],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const [section, field, subField] = name.split(".");

      if (subField) {
        // Handle deeply nested objects like shipping.dimensions
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: {
              ...prevData[section][field],
              [subField]: value,
            },
          },
        };
      } else if (field) {
        // Handle second-level fields like basicInfo.productName
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: value,
          },
        };
      } else {
        return prevData;
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
          GuideComponent={
            <Guidelines
              content={["Upload images in JPEG/PNG format"]}
              guideType="info"
            />
          }
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
              content={["Upload a promotional image for the product"]}
              guideType="info"
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
              content={["Upload a video showcasing the product"]}
              guideType="info"
            />
          }
        />
      </FormSection>

      {/* Product Specification Section */}
      <FormSection
        title="Product Specification"
        message="Fill more product specification will increase product searchability."
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
      </FormSection>

      {/* Price, Stock & Variants Section */}
      <FormSection
        title="Price, Stock & Variants"
        message="You can add variants to a product that has more than one option, such as size or color."
        customClass={styles.productPSV}
      >
        <FormInput
          label="Variations"
          name="productDetails.variations"
          type="text"
          placeholder="Ex: Color, Size"
          value={formData.productDetails.variations}
          onChange={handleInputChange}
        />
        <FormInput
          label="Pricing"
          name="productDetails.pricing"
          type="text"
          placeholder="Current Price"
          value={formData.productDetails.pricing.current}
          onChange={handleInputChange}
        />
        <FormInput
          label="Original Price"
          name="productDetails.pricing.original"
          type="text"
          placeholder="Original Price"
          value={formData.productDetails.pricing.original}
          onChange={handleInputChange}
        />
        <FormInput
          label="Stock"
          name="productDetails.stock"
          type="text"
          placeholder="Stock Quantity"
          value={formData.productDetails.stock}
          onChange={handleInputChange}
        />
        <FormInput
          label="Availability"
          name="productDetails.availability"
          type="text"
          placeholder="Availability Status"
          value={formData.productDetails.availability}
          onChange={handleInputChange}
        />
        <FormInput
          label="SKU"
          name="productDetails.sku"
          type="text"
          placeholder="Stock Keeping Unit"
          value={formData.productDetails.sku}
          onChange={handleInputChange}
        />
      </FormSection>

      {/* Product Description Section */}
      <FormSection title="Product Description" customClass={styles.productDesc}>
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
      </FormSection>

      {/* Shipping & Warranty Section */}
      <FormSection
        title="Shipping & Warranty"
        message="Switch to enter different package dimensions & weight for variations"
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
      </FormSection>

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
