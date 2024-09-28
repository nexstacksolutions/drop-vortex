import styles from "./index.module.css";
import { useMemo } from "react";
import { FormInput, MultiInputGroup } from "../ProductInputs";
import { get } from "lodash";
import { useProductForm } from "../../../../context/ProductForm";
import { FaAsterisk } from "react-icons/fa6";

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

// Table header component
function TableHeaders({
  requiredFields,
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
        {additionalHeaderNames.map(({ label, fieldPath }, headerIndex) => {
          const name = getFieldPath(false, fieldPath);
          const isRequired = get(requiredFields, name);

          return (
            <th key={headerIndex}>
              <label htmlFor={`${name}-form-input`}>
                {isRequired && <FaAsterisk />}
                <span>{label}</span>
              </label>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

// Table row component
function TableRows({
  state,
  onChange,
  formErrors,
  variationRows,
  variantShipping,
  hasVariationRows,
  variationColumnNames,
  additionalInputFields,
}) {
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
              ({ fieldPath, maxValue, type = "number", ...rest }, index) => (
                <td key={`additional-col-${index}`}>
                  {variantShipping && index === 4 ? (
                    <MultiInputGroup
                      {...{ type, onChange, ...rest }}
                      name={getFieldPath(true, fieldPath, rowIndex)}
                      groupType="input"
                      hideValidation={true}
                      value={get(
                        state,
                        getFieldPath(true, fieldPath, rowIndex)
                      )}
                    />
                  ) : (
                    <FormInput
                      {...{ type, onChange, ...rest }}
                      name={getFieldPath(true, fieldPath, rowIndex)}
                      suffixDisplay={{ maxValue }}
                      hideValidation={true}
                      isSwitch={index === additionalInputFields.length - 1}
                      value={get(
                        state,
                        getFieldPath(true, fieldPath, rowIndex)
                      )}
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
            ({ fieldPath, maxValue, type = "number", ...rest }, index) => (
              <td key={`non-row-${fieldPath}-${index}`}>
                <FormInput
                  {...{ type, onChange, ...rest }}
                  name={getFieldPath(false, fieldPath)}
                  suffixDisplay={{ maxValue }}
                  hideValidation={true}
                  value={get(state, getFieldPath(false, fieldPath))}
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

function ProductPriceStockWrapper({ variations, variantShipping, onChange }) {
  const { state, handleApplyToAll, requiredFields, formErrors } =
    useProductForm();

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
    { fieldPath: "pricing.original", label: "Price" },
    { fieldPath: "pricing.curren", label: "Special Price" },
    { fieldPath: "stock", label: "Stock" },
    ...(variantShipping && hasVariationRows
      ? [
          { fieldPath: "packageWeight", label: "Package Weight" },
          {
            fieldPath: "dimensions",
            label: "Package Dimensions(cm): Length * Width * Height",
          },
        ]
      : []),
    { fieldPath: "sku", label: "Seller SKU" },
    { fieldPath: "freeItems", label: "Free Items" },
    { fieldPath: "availability", label: "Availability" },
  ];

  const additionalInputFields = [
    { fieldPath: "pricing.original", placeholder: "Price" },
    { fieldPath: "pricing.current", placeholder: "Special Price" },
    { fieldPath: "stock", placeholder: "Stock" },
    ...(variantShipping && hasVariationRows
      ? [
          { fieldPath: "packageWeight", placeholder: "0.001 - 300" },
          { fieldPath: "dimensions", placeholder: "0.01 - 300" },
        ]
      : []),
    {
      fieldPath: "sku",
      placeholder: "Seller SKU",
      type: "text",
      maxValue: 200,
    },
    { fieldPath: "freeItems", placeholder: "Free Items" },
    { fieldPath: "availability" },
  ];

  return (
    <div className={`${styles.productPriceStockWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {hasVariationRows && (
        <div className={`${styles.variationInputContainer} flex`}>
          {additionalInputFields
            .slice(0, variantShipping ? 6 : 4)
            .filter(
              (_, index) => !(variantShipping && (index === 3 || index === 4))
            )
            .map(({ fieldPath, maxValue, type = "number", ...rest }, index) => (
              <FormInput
                key={`non-row-${fieldPath}-${index}`}
                name={getFieldPath(false, fieldPath)}
                value={get(state, getFieldPath(false, fieldPath))}
                suffixDisplay={{ maxValue }}
                {...{ type, onChange, ...rest }}
                customClass={styles.variationInputField}
              />
            ))}
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
            {...{
              hasVariationRows,
              requiredFields,
              variationColumnNames,
              additionalHeaderNames,
            }}
          />
          <TableRows
            {...{
              state,
              onChange,
              variationRows,
              variantShipping,
              formErrors,
              hasVariationRows,
              variationColumnNames,
              additionalInputFields,
            }}
          />
        </table>
      </div>
    </div>
  );
}

export default ProductPriceStockWrapper;
