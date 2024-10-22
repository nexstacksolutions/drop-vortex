import styles from "./index.module.css";
import { get } from "lodash";
import { ShowMoreBtn } from "./FormUi";
import { useMemo, memo, useEffect } from "react";
import { useTooltip } from "../../../../../contexts/Tooltip";
import useAdditionalFields from "../../hooks/useAdditionalFields";
import {
  FormInput,
  MultiInputGroup,
  InputHeader,
  DropdownInput,
} from "./ProductInputs";
import {
  useProductFormState,
  useProductFormUI,
} from "../../../../../contexts/ProductForm";

// Constants for repeated strings
const AMOUNT = "amount";
const STATUS = "status";

const getFieldPath = (
  isVariationField,
  basePath,
  valueIndex,
  variationIndex = 0
) => {
  return isVariationField
    ? `productDetails.variations[${variationIndex}].values[${valueIndex}].${basePath}`
    : `productDetails.${basePath}`;
};

const RenderInputField = ({ isTableData, ...rest }) => {
  const { name } = rest.inputProps || {};

  return name.includes("dimensions") ? (
    <MultiInputGroup {...rest} />
  ) : isTableData && name.includes("pricing.special") ? (
    <SpecialPriceWrapper {...rest} />
  ) : (
    <FormInput {...rest} />
  );
};

const RenderTableContent = (
  isTableHeader,
  fields,
  isTableData,
  isVariationField,
  { rowIndex }
) => {
  const { formState, handleInputChange: onChange } = useProductFormState();

  return fields.map(({ fieldPath, placeholder, label, type, ...rest }, idx) => {
    const name = getFieldPath(isVariationField, fieldPath, rowIndex);
    const value = get(formState, name);
    const inputProps = { name, value, type, placeholder, onChange };
    const inputHeaderProps = { ...inputProps, label, ...rest };
    const InputFieldProps = {
      inputProps,
      isTableData,
      inputHeaderProps,
      ...rest,
    };

    return isTableHeader ? (
      <th key={idx}>
        <InputHeader
          {...inputHeaderProps}
          id={`${name}-form-input`}
          customClass={styles.tableHeader}
        />
      </th>
    ) : isTableData ? (
      <td key={idx}>
        <RenderInputField {...InputFieldProps} />
      </td>
    ) : (
      <RenderInputField key={idx} {...InputFieldProps} />
    );
  });
};

const SpecialPriceWrapper = memo(
  ({ inputProps, showMoreBtnProps, promotionDateProps, ...rest }) => {
    const { name, value } = inputProps;
    const { handleTooltipTrigger } = useTooltip();
    const { additionalFields } = useProductFormUI();
    console.log(rest);

    const updatedProps = useMemo(
      () => ({
        formInputProps: {
          inputProps: {
            ...inputProps,
            name: `${name}.${AMOUNT}`,
            value: value.amount,
          },
          ...rest,
        },

        dropDownInputProps: {
          inputProps: {
            ...inputProps,
            name: `${name}.${STATUS}`,
            value: value.status,
          },

          ...rest,
          ...promotionDateProps,
        },
      }),
      [inputProps, name, value, rest, promotionDateProps]
    );

    const content = useMemo(
      () => (
        <div className="flex flex-col">
          <FormInput {...updatedProps.formInputProps} />
          {additionalFields.productDetails ? (
            <DropdownInput {...updatedProps.dropDownInputProps} />
          ) : (
            <ShowMoreBtn {...showMoreBtnProps} />
          )}
        </div>
      ),
      [updatedProps, additionalFields, showMoreBtnProps]
    );

    useEffect(() => {
      handleTooltipTrigger({
        content,
        customClass: styles.specialPriceTooltip,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, additionalFields.productDetails]);

    return (
      <div className={styles.specialPriceWrapper}>
        <button
          id="global-tooltip"
          onMouseOver={() =>
            handleTooltipTrigger({
              content,
              customClass: styles.specialPriceTooltip,
            })
          }
        >
          Add
        </button>
      </div>
    );
  }
);
SpecialPriceWrapper.displayName = "SpecialPriceWrapper";

const TableHeaders = memo(
  ({ hasVariationRows, variationColumnNames, additionalFields }) => (
    <thead>
      <tr>
        {hasVariationRows &&
          variationColumnNames.map((columnName, columnIndex) => (
            <th key={columnIndex}>{columnName}</th>
          ))}
        {RenderTableContent(true, additionalFields, true, false, {})}
      </tr>
    </thead>
  )
);
TableHeaders.displayName = "TableHeaders";

const TableRows = memo(
  ({
    variationRows,
    hasVariationRows,
    variationColumnNames,
    additionalFields,
  }) => (
    <tbody>
      {hasVariationRows ? (
        variationRows.map((rowValues, rowIndex) => (
          <tr key={`variation-row-${rowIndex}`}>
            {variationColumnNames.map((columnName, columnIndex) => (
              <td key={`variation-col-${columnIndex}`}>
                {rowValues[columnName]}
              </td>
            ))}
            {RenderTableContent(false, additionalFields, true, true, {
              rowIndex,
            })}
          </tr>
        ))
      ) : (
        <tr>
          {RenderTableContent(false, additionalFields, true, false, {
            rowIndex: -1,
          })}
        </tr>
      )}
    </tbody>
  )
);
TableRows.displayName = "TableRows";

function ProductPriceStockWrapper({ variations }) {
  const { handleApplyToAll } = useProductFormState();

  const variationRows = useMemo(() => {
    if (variations.length === 0) return [];
    const maxValuesLength = Math.max(...variations.map((v) => v.values.length));
    return Array.from({ length: maxValuesLength }, (_, index) =>
      variations.reduce((acc, variation) => {
        acc[variation.type] = variation.values[index]?.name || "";
        return acc;
      }, {})
    );
  }, [variations]);

  const variationColumnNames = useMemo(
    () => variations.map((variation) => variation.type),
    [variations]
  );

  const hasVariationRows = useMemo(
    () => variationRows.length > 0,
    [variationRows]
  );

  const { commonFields, additionalFields } = useAdditionalFields();

  return (
    <div className={`${styles.productPSWrapper} flex flex-col`}>
      <h3>Price & Stock</h3>
      {hasVariationRows && (
        <div className={`${styles.variationInputContainer} flex align-center`}>
          <div className={`${styles.variationInputWrapper} flex`}>
            {RenderTableContent(false, commonFields.slice(0, 4), false, false, {
              rowIndex: -1,
            })}
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
              variationColumnNames,
              additionalFields,
            }}
          />
          <TableRows
            {...{
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
