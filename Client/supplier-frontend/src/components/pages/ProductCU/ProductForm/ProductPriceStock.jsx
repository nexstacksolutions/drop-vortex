import styles from "./ProductForm.module.css";
import { get } from "lodash";
import { useMemo, memo } from "react";
import { useTooltip } from "../../../../context/Tooltip";
import useAdditionalFields from "../../../../hooks/pages/ProductForm/useAdditionalFields";
import {
  FormInput,
  MultiInputGroup,
  InputHeader,
  DropdownInput,
} from "./ProductInputs";
import {
  useProductFormState,
  useProductFormUI,
} from "../../../../context/ProductForm";

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

const SpecialPriceWrapper = memo(
  ({ name, value, promotionDateProps, ...rest }) => {
    const { handleTooltipTrigger } = useTooltip();
    const modifiedProps = useMemo(
      () => ({ ...rest, hideLabel: false }),
      [rest]
    );

    const formInputProps = useMemo(
      () => ({
        name: `${name}.amount`,
        value: value.amount,
        ...modifiedProps,
      }),
      [name, value.amount, modifiedProps]
    );

    const dropDownInputProps = useMemo(
      () => ({
        name: `${name}.status`,
        value: value.status,
        ...modifiedProps,
        ...promotionDateProps,
      }),
      [name, value.status, modifiedProps, promotionDateProps]
    );

    const content = useMemo(
      () => (
        <div className="flex flex-col">
          <FormInput {...formInputProps} />
          <DropdownInput {...dropDownInputProps} />
        </div>
      ),
      [formInputProps, dropDownInputProps]
    );

    const tooltipProps = useMemo(
      () => ({
        content,
        customClass: styles.specialPriceTooltip,
      }),
      [content]
    );

    return (
      <div className={styles.specialPriceWrapper}>
        <button
          id="global-tooltip"
          onMouseOver={() => handleTooltipTrigger(tooltipProps)}
        >
          Add
        </button>
      </div>
    );
  }
);
SpecialPriceWrapper.displayName = "SpecialPriceWrapper";

const renderField = (
  fields,
  isHeader,
  isVariationField,
  { formState, onChange, rowIndex, requiredFields }
) => {
  return fields.map(
    ({ label, fieldPath, maxValue, type = "number", ...rest }, idx) => {
      const name = getFieldPath(isVariationField, fieldPath, rowIndex);
      const value = get(formState, name);
      const isRequired = get(requiredFields, name);
      const tdProps = { type, label, name, value, onChange, ...rest };

      if (isHeader) {
        return (
          <th key={idx}>
            <InputHeader
              id={`${name}-form-input`}
              label={label}
              isRequired={isRequired}
              customClass={styles.tableHeader}
              guidelinesProps={rest.guidelinesProps}
            />
          </th>
        );
      }

      return (
        <td key={idx}>
          {name.includes("dimensions") ? (
            <MultiInputGroup {...tdProps} groupType="input" />
          ) : name.includes("pricing.special") ? (
            <SpecialPriceWrapper {...tdProps} />
          ) : (
            <FormInput {...tdProps} suffixDisplay={{ maxValue }} />
          )}
        </td>
      );
    }
  );
};

const TableHeaders = memo(
  ({ hasVariationRows, variationColumnNames, additionalFields }) => {
    return (
      <thead>
        <tr>
          {hasVariationRows &&
            variationColumnNames.map((columnName, columnIndex) => (
              <th key={columnIndex}>{columnName}</th>
            ))}
          {renderField(additionalFields, true, false, {})}
        </tr>
      </thead>
    );
  }
);
TableHeaders.displayName = "TableHeaders";

const TableRows = memo(
  ({
    formState,
    onChange,
    variationRows,
    hasVariationRows,
    variationColumnNames,
    additionalFields,
  }) => {
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
                formState,
                onChange,
                rowIndex,
              })}
            </tr>
          ))
        ) : (
          <tr>
            {renderField(additionalFields, false, false, {
              formState,
              onChange,
              rowIndex: -1,
            })}
          </tr>
        )}
      </tbody>
    );
  }
);
TableRows.displayName = "TableRows";

function ProductPriceStockWrapper({ variations, variantShipping, onChange }) {
  const { requiredFields } = useProductFormUI();
  const { formState, handleApplyToAll } = useProductFormState();

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

  const { commonFields, additionalFields } = useAdditionalFields(
    variantShipping,
    hasVariationRows
  );

  return (
    <div className={`${styles.productPSWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {hasVariationRows && (
        <div className={`${styles.variationInputContainer} flex align-center`}>
          <div className={`${styles.variationInputWrapper} flex `}>
            {commonFields
              .slice(0, 4)
              .map(
                ({ fieldPath, maxValue, type = "number", ...rest }, index) => (
                  <FormInput
                    key={`non-row-${fieldPath}-${index}`}
                    name={getFieldPath(false, fieldPath)}
                    value={get(formState, getFieldPath(false, fieldPath))}
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
              formState,
              onChange,
              variationRows,
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

export default memo(ProductPriceStockWrapper);
