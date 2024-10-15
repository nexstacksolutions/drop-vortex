import styles from "./ProductForm.module.css";
import classNames from "classnames";
import { get } from "lodash";
import { useMemo, memo } from "react";
import FormSection from "./FormSection";
import ProductVariations from "./ProductVariations";
import ProductPriceStockWrapper from "./ProductPriceStock";
import Divider from "../../../constant/Divider/Divider";
import {
  useProductFormUI,
  useProductFormState,
} from "../../../../context/ProductForm";
import {
  FormInput,
  MultiInputGroup,
  DropdownInput,
  MediaInput,
} from "./ProductInputs";

const RenderInputField = (
  { name, formInputType, onChange, condition, useDivider, ...rest },
  i,
  formState,
  uiState
) => {
  const { handleInputChange } = useProductFormState();
  const key = `${name}${i}`;
  const value = get(formState, name);
  const handleChange = onChange || handleInputChange;

  if (condition && !condition(uiState)) return null;

  const inputTypes = {
    media: MediaInput,
    dropdown: DropdownInput,
    productVariations: ProductVariations,
    productPriceStockWrapper: ProductPriceStockWrapper,
    inputGroup: MultiInputGroup,
    default: FormInput,
  };

  const InputComponent = inputTypes[formInputType] || inputTypes.default;

  return (
    <>
      <InputComponent
        key={key}
        {...{ name, value, onChange: handleChange, ...rest }}
      />

      {useDivider && <Divider />}
    </>
  );
};

function ProductForm({ customClass }) {
  const { formState, handleInputChange } = useProductFormState();
  const {
    uiState,
    sectionRefs,
    handleSubmit,
    isVariantShipping,
    toggleVariantShipping,
  } = useProductFormUI();

  const memoizedFormSections = useMemo(
    () => [
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
            guidelinesProps: {
              content: ["White Background Image", "See Example"],
            },
          },
          {
            label: "Product Video",
            name: "basicInfo.media.productVideo",
            type: "file",
            formInputType: "media",
            fileType: "video",
            maxFiles: 1,
            guidelinesProps: {
              content: [
                "Min size: 480x480 px, max video length: 60 seconds, max file size: 100MB.",
                "Supported Format: mp4",
                "New Video might take up to 36 hrs to be approved",
              ],
            },
          },
        ],
      },
      {
        title: "Product Specification",
        message:
          "Filling more product specification will increase product searchability.",
        customClass: styles.productSpec,
        showMoreBtnProps: { section: "additionalSpecs" },
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
            type: "number",
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
            condition: (uiState) => uiState.additionalFields.additionalSpecs,
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
            variations: formState.productDetails.variations,
          },
          {
            formInputType: "productPriceStockWrapper",
            variations: formState.productDetails.variations,
            variantShipping: uiState.variantShipping,
          },
        ],
      },
      {
        title: "Product Description",
        customClass: styles.productDesc,
        showMoreBtnProps: { section: "description" },
        fields: [
          {
            label: "Main Description",
            name: "description.main",
            type: "textarea",
            formInputType: "textarea",
          },
          {
            label: "Highlights",
            name: "description.highlights",
            type: "textarea",
            formInputType: "textarea",
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
            condition: (formData) => uiState.additionalFields.description,
          },
          {
            label: "What's in the Box",
            name: "description.whatsInBox",
            type: "text",
            placeholder: "Ex: 1x product, 1x accessory",
            condition: (formData) => uiState.additionalFields.description,
          },
        ],
      },
      {
        title: "Shipping & Warranty",
        message:
          "Switch to enter different package dimensions & weight for variations",
        customClass: styles.productSW,
        additionalJsxProps: {
          currState: uiState.variantShipping,
          customClickHandler: toggleVariantShipping,
          disableCondition: !isVariantShipping,
        },
        showMoreBtnProps: {
          btnText: "More Warranty Settings",
          section: "warranty",
        },
        fields: [
          {
            label: "Package Weight",
            name: "shipping.packageWeight",
            type: "number",
            placeholder: "0.01 - 300",
            condition: (formData) => !uiState.variantShipping,
          },
          {
            label: "Package Dimensions (L x W x H)",
            name: "shipping.dimensions",
            type: "number",
            formInputType: "inputGroup",
            groupType: "input",
            placeholder: "0.01 - 300",
            condition: (formData) => !uiState.variantShipping,
          },
          {
            label: "Dangerous Goods",
            name: "shipping.dangerousGoods",
            type: "radio",
            useDivider: true,
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
            condition: (formData) => uiState.additionalFields.warranty,
          },
          {
            label: "Warranty Period",
            name: "shipping.warranty.period",
            type: "text",
            placeholder: "Warranty Period",
            condition: (formData) => uiState.additionalFields.warranty,
          },
          {
            label: "Warranty Policy",
            name: "shipping.warranty.policy",
            type: "text",
            placeholder: "Warranty Policy",
            condition: (formData) => uiState.additionalFields.warranty,
          },
        ],
      },
    ],
    [
      isVariantShipping,
      formState.productDetails.variations,
      uiState.additionalFields.warranty,
      uiState.additionalFields.description,
      uiState.variantShipping,
      handleInputChange,
      toggleVariantShipping,
    ]
  );

  return (
    <form
      className={classNames(styles.productForm, customClass, "flex flex-col")}
      onSubmit={handleSubmit}
      autoComplete="off"
      action="/products/manage"
      method="post"
      noValidate
      encType="multipart/form-data"
    >
      {memoizedFormSections.map(({ title, fields, ...rest }, index) => (
        <FormSection
          key={`${title}${index}`}
          title={title}
          {...rest}
          sectionRef={sectionRefs.current[index]}
        >
          {fields.map((field, i) =>
            RenderInputField(field, i, formState, uiState)
          )}
        </FormSection>
      ))}

      <div className={`${styles.formActions} flex justify-end`}>
        <button
          type="submit"
          name="submitBtn"
          className={`${styles.submitButton} primary-btn`}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default memo(ProductForm);
