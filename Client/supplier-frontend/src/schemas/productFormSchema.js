import * as Yup from "yup";

const productFormSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    productName: Yup.string().required("The field value is required"),
    category: Yup.string().required("The field value is required"),
    media: Yup.object().shape({
      productImages: Yup.array().min(1, "The field value is required"),
      buyerPromotionImage: Yup.array().nullable(),
      productVideo: Yup.array().nullable(),
    }),
  }),
  productDetails: Yup.object()
    .shape({
      pricing: Yup.object().shape({
        current: Yup.number()
          .required("The field value is required")
          .positive("Current price must be a positive number"),
        original: Yup.number()
          .required("The field value is required")
          .positive("Original price must be a positive number")
          .moreThan(
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
      sku: Yup.string().required("The field value is required"),
      variations: Yup.array()
        .of(
          Yup.object().shape({
            type: Yup.string().required("The field value is required"),
            values: Yup.array()
              .min(1, "The field value is required") // Each values array must have at least one item
              .required("The field value is required"), // Ensure values array is required
          })
        )
        .required("At least one variation is required") // Ensure variations array is not nullable
        .test(
          "first-variation",
          "The first variation must have at least one value",
          function (variations) {
            if (variations && variations.length > 0) {
              // Check if the first variation has at least one value
              return variations[0].values.length > 0;
            }
            return false; // If variations array is empty, validation fails
          }
        )
        .test(
          "all-variations",
          "Each variation must have at least one value",
          function (variations) {
            if (variations) {
              // Check that all variations have at least one value
              return variations.every(
                (variation) => variation.values.length > 0
              );
            }
            return false; // If variations array is empty, validation fails
          }
        ),
    })
    .test(
      "at-least-one-variation",
      "At least one variation must be provided if variations are specified",
      function (value) {
        const { variations } = value || {};
        if (!variations || variations.length === 0) {
          return true; // If no variations are provided, the test passes
        }
        return true; // Adjust this logic as necessary
      }
    ),
  specifications: Yup.object().shape({
    brand: Yup.object().shape({
      name: Yup.string().required("The field value is required"),
      logo: Yup.string().url("Brand logo must be a valid URL").nullable(),
    }),
    numberOfPieces: Yup.number()
      .required("The field value is required")
      .min(1, "Number of pieces must be at least 1"),
    powerSource: Yup.string().required("The field value is required"),
    additionalSpecs: Yup.array().of(Yup.string()).nullable(),
  }),
  description: Yup.object().shape({
    main: Yup.string().required("The field value is required"),
    highlights: Yup.string().required("The field value is required"),
    tags: Yup.array().of(Yup.string()).nullable(),
    whatsInBox: Yup.string().nullable(),
  }),
  shipping: Yup.object().shape({
    packageWeight: Yup.number()
      .required("The field value is required")
      .positive("Package weight must be a positive number"),
    dimensions: Yup.object()
      .shape({
        length: Yup.number()
          .required("The field value is required")
          .positive("Length must be a positive number"),
        width: Yup.number()
          .required("The field value is required")
          .positive("Width must be a positive number"),
        height: Yup.number()
          .required("The field value is required")
          .positive("Height must be a positive number"),
      })
      .test(
        "dimensions-required",
        "All dimensions must be provided",
        function (value) {
          const { length, width, height } = value || {};
          if (!length || !width || !height) {
            return this.createError({
              path: "shipping.dimensions",
              message: "The field value is required",
            });
          }
          return true; // All dimensions provided
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
