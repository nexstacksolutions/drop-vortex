import styles from "./index.module.css";
import { useMemo } from "react";
import { FormInput, MultiInputGroup } from "../ProductInputs";
import { get } from "lodash";
import { useProductForm } from "../../../../context/ProductForm";

const getFieldPath = (
  isVariationField,
  baseField,
  valueIndex,
  variationIndex = 0
) => {
  const dynamicField = `productDetails.variations[${variationIndex}].values[${valueIndex}]`;

  return isVariationField
    ? `${dynamicField}.${baseField}`
    : `productDetails.${baseField}`;
};

function TableHeaders({
  hasVariationRows,
  variationColumnNames,
  additionalHeaderNames,
}) {
  return (
    <thead>
      <tr>
        {hasVariationRows &&
          variationColumnNames.map((columnName, columnIndex) => (
            <th key={columnIndex}>{columnName}</th>
          ))}
        {additionalHeaderNames.map((headerName, headerIndex) => (
          <th key={headerIndex}>{headerName}</th>
        ))}
      </tr>
    </thead>
  );
}

// Table row component
function TableRows({
  variationRows,
  variantShipping,
  hasVariationRows,
  variationColumnNames,
  additionalInputFields,
}) {
  const { state } = useProductForm();
  return (
    <tbody>
      {hasVariationRows ? (
        variationRows.map((rowValues, rowIndex) => (
          <tr key={`variation-row-${rowIndex}`}>
            {variationColumnNames.map((columnName, columnIndex) => (
              <td key={`variation-col-${columnIndex}`}>
                {rowValues[columnName]}
              </td>
            ))}

            {additionalInputFields.map(
              (
                { placeholder, fieldName, maxValue, inputType = "number" },
                index
              ) => (
                <td key={`additional-col-${index}`}>
                  {variantShipping && index === 4 ? (
                    <MultiInputGroup
                      name={getFieldPath(true, fieldName, rowIndex)}
                      type={inputType}
                      groupType="input"
                      placeholder={placeholder}
                      value={get(
                        state,
                        getFieldPath(true, fieldName, rowIndex)
                      )}
                    />
                  ) : (
                    <FormInput
                      name={getFieldPath(true, fieldName, rowIndex)}
                      type={inputType}
                      placeholder={placeholder}
                      suffixDisplay={{ maxValue }}
                      value={get(
                        state,
                        getFieldPath(true, fieldName, rowIndex)
                      )}
                      isSwitch={index === additionalInputFields.length - 1}
                    />
                  )}
                </td>
              )
            )}
          </tr>
        ))
      ) : (
        <tr>
          {additionalInputFields.map(
            (
              { placeholder, fieldName, maxValue, inputType = "number" },
              index
            ) => (
              <td key={`non-row-${fieldName}-${index}`}>
                <FormInput
                  name={getFieldPath(false, fieldName)}
                  type={inputType}
                  placeholder={placeholder}
                  suffixDisplay={{ maxValue }}
                  value={get(state, getFieldPath(false, fieldName))}
                  isSwitch={index === additionalInputFields.length - 1}
                />
              </td>
            )
          )}
        </tr>
      )}
    </tbody>
  );
}

function ProductPriceStockWrapper() {
  const { state, handleApplyToAll } = useProductForm();
  const variations = state.productDetails.variations;
  const variantShipping = state.uiState.variantShipping;
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

  const hasVariationRows = variationRows.length > 0;

  const additionalHeaderNames = [
    "Price",
    "Special Price",
    "Stock",
    ...(variantShipping && hasVariationRows
      ? ["Package Weight", "Package Dimensions(cm): Length * Width * Height"]
      : []),
    "Seller SKU",
    "Free Items",
    "Availability",
  ];

  const additionalInputFields = [
    { fieldName: "pricing.current", placeholder: "Price" },
    { fieldName: "pricing.original", placeholder: "Special Price" },
    { fieldName: "stock", placeholder: "Stock" },
    ...(variantShipping && hasVariationRows
      ? [
          {
            fieldName: "packageWeight",
            placeholder: "0.001 - 300",
            inputType: "number",
          },
          {
            fieldName: "dimensions",
            placeholder: "0.01 - 300",
            inputType: "number",
          },
        ]
      : []),
    {
      fieldName: "sku",
      placeholder: "Seller SKU",
      inputType: "text",
      maxValue: 200,
    },
    { fieldName: "freeItems", placeholder: "Free Items" },
    { fieldName: "availability" },
  ];

  return (
    <div className={`${styles.productPriceStockWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {hasVariationRows && (
        <div className={`${styles.variationInputContainer} flex`}>
          {additionalInputFields
            .slice(0, variantShipping ? 6 : 4) // Slice depending on variantShipping
            .filter(
              (_, index) => !(variantShipping && (index === 3 || index === 4))
            ) // Filter out index 3 and 4 if variantShipping is true
            .map(
              (
                { placeholder, fieldName, maxValue, inputType = "number" },
                index
              ) => (
                <FormInput
                  key={`non-row-${fieldName}-${index}`}
                  name={getFieldPath(false, fieldName)}
                  type={inputType}
                  placeholder={placeholder}
                  value={get(state, getFieldPath(false, fieldName))}
                  suffixDisplay={{ maxValue }}
                  customClass={styles.variationInputField}
                />
              )
            )}
          <button
            type="button"
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
            variationColumnNames={variationColumnNames}
            additionalHeaderNames={additionalHeaderNames}
            hasVariationRows={hasVariationRows}
          />
          <TableRows
            variationRows={variationRows}
            variationColumnNames={variationColumnNames}
            additionalInputFields={additionalInputFields}
            hasVariationRows={hasVariationRows}
            variantShipping={variantShipping}
          />
        </table>
      </div>
    </div>
  );
}

export default ProductPriceStockWrapper;
