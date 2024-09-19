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

// Reusable component for form sections
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

// Reusable component for handling input fields
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

  return (
    <div className={classNames(styles.formInputWrapper, "flex flex-col")}>
      <label>{label}</label>
      {type === "select" && (
        <select name={name} value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {type === "textarea" && (
        <ReactQuill value={value} onChange={handleQuillChange} />
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
      {inputList && name === "packageDimensions" && (
        <div className={classNames(styles.inputGroup, "flex")}>
          {Object.keys(value).map((dimension, index) => (
            <input
              key={index}
              type="number"
              name={dimension}
              value={value[dimension]}
              placeholder={
                dimension.charAt(0).toUpperCase() + dimension.slice(1)
              }
              onChange={(e) =>
                onChange({
                  target: {
                    name: "packageDimensions",
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
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}
      {showErr && <p className={styles.errorMsg}>Error message</p>}
    </div>
  );
};

// Reusable component for handling media inputs
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
  const fileInputRef = useRef(null); // Ref for file input

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (mediaFiles.length + files.length <= maxFiles) {
      const updatedFiles = [...mediaFiles, ...files];
      setMediaFiles(updatedFiles);
      onChange({ target: { name, value: updatedFiles } });
      // Reset file input to avoid cache issues
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Remove file from the list
  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
    onChange({ target: { name, value: updatedFiles } });
    // Reset file input to avoid cache issues
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Generate unique ID for file input
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
                ref={fileInputRef} // Attach ref to file input
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

// Main product form component
const ProductForm = ({ customClass }) => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    productImages: [],
    buyerPromotionImage: [],
    video: [],
    brand: "",
    numberOfPieces: "",
    powerSource: "",
    variantName: "",
    price: "",
    stock: "",
    sellerSKU: "",
    mainDescription: "",
    productDescription: "",
    highlights: "",
    packageWeight: "",
    packageDimensions: { length: "", width: "", height: "" },
    dangerousGoods: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "packageDimensions") {
        return {
          ...prevData,
          [name]: value,
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
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
          name="productName"
          type="text"
          placeholder="Ex: Nikon Coolpix A300 Digital Camera"
          value={formData.productName}
          onChange={handleInputChange}
        />
        <FormInput
          label="Category"
          name="category"
          type="select"
          options={["Furniture & Decor", "Lighting", "Table Lamps"]}
          value={formData.category}
          onChange={handleInputChange}
        />
        <MediaInput
          label="Product Images"
          name="productImages"
          maxFiles={8}
          fileType="image"
          value={formData.productImages}
          onChange={handleInputChange}
        />
        <MediaInput
          label="Buyer Promotion Image"
          name="buyerPromotionImage"
          maxFiles={1}
          fileType="image"
          value={formData.buyerPromotionImage}
          GuideComponent={
            <Guidelines
              content={["White Background Image", "See Example"]}
              guideType="imageGuidelines"
            />
          }
          onChange={handleInputChange}
        />
        <MediaInput
          label="Video"
          name="video"
          maxFiles={1}
          fileType="video"
          value={formData.video}
          GuideComponent={
            <Guidelines
              content={[
                "Min size: 480x480 px, max length: 60 seconds, max file size: 100MB.",
                "Supported Format: mp4",
                "New video may take 36 hrs to approve.",
              ]}
              guideType="videoGuidelines"
            />
          }
          onChange={handleInputChange}
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
          name="brand"
          type="select"
          options={["Nikon", "Canon", "Sony"]}
          value={formData.brand}
          onChange={handleInputChange}
        />
        <FormInput
          label="Number of Pieces"
          name="numberOfPieces"
          type="number"
          placeholder="Please input or select option"
          value={formData.numberOfPieces}
          onChange={handleInputChange}
        />
        <FormInput
          label="Power Source"
          name="powerSource"
          type="text"
          placeholder="Please input or select option"
          value={formData.powerSource}
          onChange={handleInputChange}
        />
      </FormSection>

      {/* Price, Stock & Variants Section */}
      <FormSection
        title="Price, Stock & Variants"
        message="You can add variants to a product that has more than one option, such as size or color."
        customClass={styles.productPSV}
      >
        <FormInput
          label="Variant Name"
          name="variantName"
          type="text"
          placeholder="Add Variant"
          value={formData.variantName}
          onChange={handleInputChange}
        />
        <FormInput
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          value={formData.price}
          onChange={handleInputChange}
        />
        <FormInput
          label="Stock"
          name="stock"
          type="number"
          placeholder="Enter stock"
          value={formData.stock}
          onChange={handleInputChange}
        />
        <FormInput
          label="Seller SKU"
          name="sellerSKU"
          type="text"
          placeholder="Enter Seller SKU"
          value={formData.sellerSKU}
          onChange={handleInputChange}
        />
      </FormSection>

      {/* Product Description Section */}
      <FormSection title="Product Description" customClass={styles.productDesc}>
        <FormInput
          label="Main Description"
          name="mainDescription"
          type="textarea"
          value={formData.mainDescription}
          onChange={handleInputChange}
        />
        <FormInput
          label="Product Description"
          name="productDescription"
          type="textarea"
          value={formData.productDescription}
          onChange={handleInputChange}
        />
        <FormInput
          label="Highlights"
          name="highlights"
          type="textarea"
          value={formData.highlights}
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
          name="packageWeight"
          type="number"
          placeholder="0.01 - 300"
          value={formData.packageWeight}
          onChange={handleInputChange}
        />
        <FormInput
          label="Package Dimensions (L x W x H)"
          name="packageDimensions"
          type="number"
          placeholder="0.01 - 300"
          inputList={3}
          value={formData.packageDimensions}
          onChange={handleInputChange}
        />
        <FormInput
          label="Dangerous Goods"
          name="dangerousGoods"
          type="radio"
          options={["None", "Contains battery / flammables / liquid"]}
          value={formData.dangerousGoods}
          onChange={handleInputChange}
        />
      </FormSection>

      <button type="submit" className={styles.submitBtn}>
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
