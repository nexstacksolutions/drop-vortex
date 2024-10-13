import styles from "./ProductForm.module.css";
import { useMemo } from "react";
import { FormInput, MultiInputGroup } from "./ProductInputs";
import { get } from "lodash";
import { useProductForm } from "../../../../context/ProductForm";
import { FaAsterisk } from "react-icons/fa6";
import useAdditionalFields from "../../../../hooks/useAdditionalFields";

const getFieldPath = (
  isVariationField,
  basePath,
  valueIndex,
  variationIndex = 0
) => {
  const dynamicPath = `productDetails.variations[${variationIndex}].values[${valueIndex}]`;

  return isVariationField
    ? `${dynamicPath}.${basePath}`
    : `productDetails.${basePath}`;
};

// Utility to render table headers and inputs based on field configuration
const renderField = (
  fields,
  isHeader,
  isVariationField,
  { state, onChange, variantShipping, rowIndex, requiredFields }
) => {
  return fields.map(
    ({ label, fieldPath, maxValue, type = "number", ...rest }, idx) => {
      const name = getFieldPath(isVariationField, fieldPath, rowIndex);
      const isRequired = get(requiredFields, name);

      if (isHeader) {
        return (
          <th key={idx}>
            <label htmlFor={`${name}-form-input`} className="flex flex-center">
              {isRequired && <FaAsterisk />}
              <span>{label}</span>
            </label>
          </th>
        );
      }

      return (
        <td key={idx}>
          {variantShipping && idx === 4 ? (
            <MultiInputGroup
              {...{ type, label, name, onChange, ...rest }}
              groupType="input"
              value={get(state, name)}
            />
          ) : (
            <FormInput
              {...{ type, label, name, onChange, ...rest }}
              suffixDisplay={{ maxValue }}
              value={get(state, name)}
            />
          )}
        </td>
      );
    }
  );
};

// Table headers component
function TableHeaders({
  requiredFields,
  hasVariationRows,
  variationColumnNames,
  additionalFields,
}) {
  return (
    <thead>
      <tr>
        {hasVariationRows &&
          variationColumnNames.map((columnName, columnIndex) => (
            <th key={columnIndex}>{columnName}</th>
          ))}
        {renderField(additionalFields, true, false, { requiredFields })}
      </tr>
    </thead>
  );
}

// Table rows component
function TableRows({
  state,
  onChange,
  variationRows,
  variantShipping,
  hasVariationRows,
  variationColumnNames,
  additionalFields,
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
            {renderField(additionalFields, false, true, {
              state,
              onChange,
              variantShipping,
              rowIndex,
            })}
          </tr>
        ))
      ) : (
        <tr>
          {renderField(additionalFields, false, false, {
            state,
            onChange,
            variantShipping,
            rowIndex: -1,
          })}
        </tr>
      )}
    </tbody>
  );
}

function ProductPriceStockWrapper({ variations, variantShipping, onChange }) {
  const { state, handleApplyToAll, requiredFields } = useProductForm();

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

  const additionalFields = useAdditionalFields(
    variantShipping,
    hasVariationRows
  );

  return (
    <div className={`${styles.productPSWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {hasVariationRows && (
        <div className={`${styles.variationInputContainer} flex align-center`}>
          <div className={`${styles.variationInputWrapper} flex `}>
            {additionalFields
              .slice(0, variantShipping ? 6 : 4)
              .filter(
                (_, index) => !(variantShipping && (index === 3 || index === 4))
              )
              .map(
                ({ fieldPath, maxValue, type = "number", ...rest }, index) => (
                  <FormInput
                    key={`non-row-${fieldPath}-${index}`}
                    name={getFieldPath(false, fieldPath)}
                    value={get(state, getFieldPath(false, fieldPath))}
                    suffixDisplay={{ maxValue }}
                    {...{ type, onChange, ...rest }}
                  />
                )
              )}
          </div>
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
              additionalFields,
            }}
          />
          <TableRows
            {...{
              state,
              onChange,
              variationRows,
              variantShipping,
              hasVariationRows,
              variationColumnNames,
              additionalFields,
            }}
          />
        </table>
      </div>
    </div>
  );
}

export default ProductPriceStockWrapper;
