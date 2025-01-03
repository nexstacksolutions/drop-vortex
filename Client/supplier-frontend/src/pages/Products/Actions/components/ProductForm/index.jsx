import styles from "./index.module.css";
import classNames from "classnames";
import { get } from "lodash";
import React, { useMemo, memo } from "react";
import FormSection from "./FormSection";
import ProductVariations from "./ProductVariations";
import ProductPriceStockWrapper from "./ProductPriceStock";
import { Divider, ConfigProvider } from "antd";
import {
  useProductFormUI,
  useProductFormState,
} from "../../../../../contexts/ProductForm";
import {
  FormInput,
  MultiInputGroup,
  DropdownInput,
  MediaInput,
} from "./ProductInputs";

const RenderInputField = (
  { inputProps, componentType, condition, useDivider, ...rest },
  i,
  formState
) => {
  const { name, onChange } = inputProps || {};
  const { handleInputChange } = useProductFormState();
  const key = `${name}${i}`;
  const value = get(formState, name);
  const handleChange = onChange || handleInputChange;
  if (condition === false) return null;

  const inputTypes = {
    media: MediaInput,
    dropdown: DropdownInput,
    productVariations: ProductVariations,
    productPriceStockWrapper: ProductPriceStockWrapper,
    inputGroup: MultiInputGroup,
    default: FormInput,
  };

  const InputComponent = inputTypes[componentType] || inputTypes.default;

  return (
    <React.Fragment key={`fragment-${key}`}>
      <InputComponent
        {...rest}
        inputProps={{ ...inputProps, value, onChange: handleChange }}
      />
      {useDivider && <Divider />}
    </React.Fragment>
  );
};

function ProductForm({ customClass }) {
  const { formState, handleInputChange } = useProductFormState();
  const {
    sectionRefs,
    handleSubmit,
    additionalFields,
    variantValues,
    variantShipping,
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
            inputProps: {
              name: "basicInfo.productName",
              type: "text",
              placeholder: "Nikon Coolpix A300",
            },
            suffixDisplay: { maxValue: 255 },
          },
          {
            label: "Category",
            inputProps: {
              name: "basicInfo.category",
              type: "text",
              placeholder: "Please select category or search with keyword",
            },
            componentType: "dropdown",
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
            inputProps: {
              name: "basicInfo.media.productImages",
              type: "file",
            },
            componentType: "media",
            fileType: "image",
            maxFiles: 5,
            inputHeaderProps: {
              guidelinesProps: {
                instructions: [
                  "This is the main image of your product page. Maximum 8 images can be uploaded",
                  "Image size between 330x330 and 5000x5000 px. Max file size: 3 MB.",
                  "Obscene image is strictly prohibited.",
                ],
              },
            },
          },
          {
            label: "Buyer Promotion Image",
            inputProps: {
              name: "basicInfo.media.buyerPromotionImage",
              type: "file",
            },
            componentType: "media",
            fileType: "image",
            maxFiles: 1,
            guidelinesProps: {
              title: "White Background Image",
              popupBtn: "See Example",
              imgSrc: "/images/productForm/image-upload-ex.webp",
              place: "right",
              instructions: [
                "Size: Less than 3MB",
                "Supported formats: JPG, JPEG or PNG",
                "The aspect ratio (W x H) must be 1:1",
                "The minimum resolution is 330 x 330 pixels (Recommended: 1000 x 1000 pixels)",
                "The background should be plain white (preferred) or show the real environment",
                "Do not include watermarks, any forms of borders, or marketing copy in the picture",
              ],
            },
            inputHeaderProps: {
              featureLabel: <span>More Exposure</span>,
              guidelinesProps: {
                instructions: [
                  "A buyer promotion image represents your product in various places, such as search result page, product recommendation page, etc.",
                  "Having a buyer promotion image will inspire buyers to click on your product.",
                ],
              },
            },
          },
          {
            label: "Product Video",
            inputProps: {
              name: "basicInfo.media.productVideo",
              type: "file",
            },
            componentType: "media",
            fileType: "video",
            maxFiles: 1,
            guidelinesProps: {
              enablePopup: false,
              instructions: [
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
            inputProps: {
              name: "specifications.brand.name",
              type: "text",
              placeholder: "Brand Name",
            },
          },
          {
            label: "Number of Pieces",
            inputProps: {
              name: "specifications.numberOfPieces",
              type: "number",
              placeholder: "Number of Pieces",
            },
          },
          {
            label: "Power Source",
            inputProps: {
              name: "specifications.powerSource",
              type: "text",
              placeholder: "Power Source",
            },
          },
          {
            label: "Additional Specifications",
            inputProps: {
              name: "specifications.additionalSpecs",
              type: "text",
              placeholder: "Additional Specifications",
            },

            condition: additionalFields.additionalSpecs,
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
            componentType: "productVariations",
            variations: formState.productDetails.variations,
          },
          {
            componentType: "productPriceStockWrapper",
            variations: formState.productDetails.variations,
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
            inputProps: {
              name: "description.main",
              type: "textarea",
            },
            componentType: "textarea",
          },
          {
            label: "Highlights",
            inputProps: {
              name: "description.highlights",
              type: "textarea",
            },
            componentType: "textarea",
          },
          {
            label: "Tags",
            inputProps: {
              name: "description.tags",
              type: "text",
              placeholder: "Ex: New, Sale, Bestseller",
              onChange: (e) =>
                handleInputChange(e, null, null, (value) =>
                  value.split(", ").map((tag) => tag.trim())
                ),
            },
            condition: additionalFields.description,
          },
          {
            label: "What's in the Box",
            inputProps: {
              name: "description.whatsInBox",
              type: "text",
              placeholder: "Ex: 1x product, 1x accessory",
            },
            condition: additionalFields.description,
          },
        ],
      },
      {
        title: "Shipping & Warranty",
        message:
          "Switch to enter different package dimensions & weight for variations",
        customClass: styles.productSW,
        additionalJsxProps: {
          currState: variantShipping,
          customClickHandler: toggleVariantShipping,
          disableCondition: !variantValues,
        },
        showMoreBtnProps: {
          btnText: "More Warranty Settings",
          section: "warranty",
        },
        fields: [
          {
            label: "Package Weight",
            inputProps: {
              name: "shipping.packageWeight.value",
              type: "number",
              placeholder: "0.01 - 300",
            },
            condition: !variantShipping,
          },
          {
            label: "Package Dimensions (L x W x H)",
            inputProps: {
              name: "shipping.dimensions",
              type: "number",
              placeholder: "0.01 - 300",
            },

            componentType: "inputGroup",
            groupType: "input",
            condition: !variantShipping,
            inputHeaderProps: {
              guidelinesProps: {
                title: "How to measure my package dimensions?",
                popupBtn: "View Example",
                imgSrc: "/images/productForm/package-length-ex.png",
                place: "right",
                instructions: [
                  "Please include the packaging materials to be used for shipment while entering the package weight and dimensions. Do note that inaccurate package dimensions may result in additional shipping charges or failed delivery.",
                ],
              },
            },
          },
          {
            label: "Dangerous Goods",
            inputProps: {
              name: "shipping.dangerousGoods",
              type: "radio",
            },
            useDivider: true,
            groupType: "radio",
            componentType: "inputGroup",
            options: ["None", "Contains battery / flammables / liquid"],
            customClass: styles.radioGroup,
          },
          {
            label: "Warranty Type",
            inputProps: {
              name: "shipping.warranty.type",
              type: "text",
              placeholder: "Warranty Type",
            },
            condition: additionalFields.warranty,
          },
          {
            label: "Warranty Period",
            inputProps: {
              name: "shipping.warranty.period",
              type: "text",
              placeholder: "Warranty Period",
            },
            condition: additionalFields.warranty,
          },
          {
            label: "Warranty Policy",
            inputProps: {
              name: "shipping.warranty.policy",
              type: "text",
              placeholder: "Warranty Policy",
            },
            condition: additionalFields.warranty,
          },
        ],
      },
    ],
    [
      additionalFields.additionalSpecs,
      formState.productDetails.variations,
      additionalFields.warranty,
      additionalFields.description,
      handleInputChange,
      toggleVariantShipping,
      variantValues,
      variantShipping,
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
          {fields.map((field, i) => RenderInputField(field, i, formState))}
        </FormSection>
      ))}

      <div className={`${styles.formActions} flex justify-end`}>
        <button
          type="submit"
          name="submitBtn"
          className={`${styles.submitButton} btn primary-btn`}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default memo(ProductForm);
