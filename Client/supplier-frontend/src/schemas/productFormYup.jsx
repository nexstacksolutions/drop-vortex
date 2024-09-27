import * as Yup from "yup";

// Reusable validation for required fields
const requiredString = Yup.string().required("The field value is required");
const requiredNumber = Yup.number()
  .required("The field value is required")
  .positive("Must be a positive number");
const requiredArray = (minItems = 1) =>
  Yup.array().min(minItems, "The field value is required");

const productFormSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    productName: requiredString,
    category: requiredString,
    media: Yup.object().shape({
      productImages: requiredArray(),
      buyerPromotionImage: Yup.array().nullable(),
      productVideo: Yup.array().nullable(),
    }),
  }),

  productDetails: Yup.object()
    .shape({
      pricing: Yup.object().shape({
        current: requiredNumber,
        original: requiredNumber.moreThan(
          Yup.ref("current"),
          "Original price must be greater than current price"
        ),
      }),
      stock: Yup.number()
        .required("The field value is required")
        .min(0, "Stock cannot be negative"),
      availability: Yup.boolean(),
      freeItems: Yup.number()
        .nullable()
        .min(0, "Free items cannot be negative"),
      sku: requiredString,
      variations: Yup.array()
        .of(
          Yup.object().shape({
            type: requiredString,
            // Ensure that the values array has at least one object
            values: requiredArray(1).test(
              "at-least-one-object",
              "Each variation must have at least one value",
              (values) => values && values.length > 0
            ),
          })
        )
        .required("At least one variation is required")
        .test(
          "first-variation",
          "The first variation must have at least one value",
          function (variations) {
            return (
              variations &&
              variations.length > 0 &&
              variations[0].values.length > 0
            );
          }
        )
        .test(
          "all-variations",
          "Each variation must have at least one value",
          function (variations) {
            return (
              variations &&
              variations.every((variation) => variation.values.length > 0)
            );
          }
        ),
    })
    .test(
      "at-least-one-variation",
      "At least one variation must be provided if variations are specified",
      function (value) {
        const { variations } = value || {};
        return !variations || variations.length > 0; // Pass if no variations are provided
      }
    ),
  specifications: Yup.object().shape({
    brand: Yup.object().shape({
      name: requiredString,
      logo: Yup.string().url("Brand logo must be a valid URL").nullable(),
    }),
    numberOfPieces: Yup.number()
      .required("The field value is required")
      .min(1, "Number of pieces must be at least 1"),
    powerSource: requiredString,
    additionalSpecs: Yup.array().of(Yup.string()).nullable(),
  }),
  description: Yup.object().shape({
    main: requiredString,
    highlights: requiredString,
    tags: Yup.array().of(Yup.string()).nullable(),
    whatsInBox: Yup.string().nullable(),
  }),
  shipping: Yup.object().shape({
    packageWeight: requiredNumber,
    dimensions: Yup.object()
      .shape({
        length: requiredNumber,
        width: requiredNumber,
        height: requiredNumber,
      })
      .test(
        "dimensions-required",
        "All dimensions must be provided",
        function (value) {
          const { length, width, height } = value || {};
          return length && width && height
            ? true
            : this.createError({
                path: "shipping.dimensions",
                message: "The field value is required",
              });
        }
      ),
    dangerousGoods: Yup.string().nullable(),
    warranty: Yup.object().shape({
      type: Yup.string().nullable(),
      period: Yup.string().nullable(),
      policy: Yup.string().nullable(),
    }),
  }),
  uiState: Yup.object().shape({
    additionalFields: Yup.object().shape({
      warranty: Yup.boolean(),
      additionalSpecs: Yup.boolean(),
      description: Yup.boolean(),
    }),
    variantShipping: Yup.boolean(),
  }),
});

export default productFormSchema;
