import { z } from "zod";

// Reusable validation for required fields
const requiredString = z.string().min(1, "The field value is required");
const requiredNumber = z.number().positive("Must be a positive number");
const requiredArray = (minItems = 1) =>
  z.array(z.any()).min(minItems, "The field value is required");

const productFormZod = z.object({
  basicInfo: z.object({
    productName: requiredString,
    category: requiredString,
    media: z.object({
      productImages: requiredArray(),
      buyerPromotionImage: z.array(z.any()).nullable(),
      productVideo: z.array(z.any()).nullable(),
    }),
  }),

  productDetails: z
    .object({
      pricing: z.object({
        current: requiredNumber,
        original: requiredNumber.refine(
          (value, ctx) => value > ctx.parent.current,
          "Original price must be greater than current price"
        ),
      }),
      stock: z.number().min(0, "Stock cannot be negative"),
      availability: z.boolean(),
      freeItems: z.number().min(0, "Free items cannot be negative").nullable(),
      sku: requiredString,
      variations: z
        .array(
          z.object({
            type: requiredString,
            values: requiredArray(1).refine((values) => values.length > 0, {
              message: "Each variation must have at least one value",
            }),
          })
        )
        .min(1, "At least one variation is required")
        .refine(
          (variations) =>
            variations.length > 0 && variations[0].values.length > 0,
          {
            message: "The first variation must have at least one value",
          }
        )
        .refine(
          (variations) =>
            variations.every((variation) => variation.values.length > 0),
          {
            message: "Each variation must have at least one value",
          }
        ),
    })
    .refine((data) => !data.variations || data.variations.length > 0, {
      message:
        "At least one variation must be provided if variations are specified",
      path: ["variations"],
    }),

  specifications: z.object({
    brand: z.object({
      name: requiredString,
      logo: z.string().url("Brand logo must be a valid URL").nullable(),
    }),
    numberOfPieces: z.number().min(1, "Number of pieces must be at least 1"),
    powerSource: requiredString,
    additionalSpecs: z.array(z.string()).nullable(),
  }),

  description: z.object({
    main: requiredString,
    highlights: requiredString,
    tags: z.array(z.string()).nullable(),
    whatsInBox: z.string().nullable(),
  }),

  shipping: z.object({
    packageWeight: requiredNumber,
    dimensions: z
      .object({
        length: requiredNumber,
        width: requiredNumber,
        height: requiredNumber,
      })
      .refine(
        (value) => (value.length && value.width && value.height ? true : false),
        {
          message: "All dimensions must be provided",
          path: ["dimensions"],
        }
      ),
    dangerousGoods: z.string().nullable(),
    warranty: z.object({
      type: z.string().nullable(),
      period: z.string().nullable(),
      policy: z.string().nullable(),
    }),
  }),

  uiState: z.object({
    additionalFields: z.object({
      warranty: z.boolean(),
      additionalSpecs: z.boolean(),
      description: z.boolean(),
    }),
    variantShipping: z.boolean(),
  }),
});

export default productFormZod;
