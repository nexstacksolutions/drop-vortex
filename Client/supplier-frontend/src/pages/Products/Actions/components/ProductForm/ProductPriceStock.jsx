import styles from "./index.module.css";
import { get } from "lodash";
import { ShowMoreBtn } from "./FormUi";
import { useMemo, memo, useState } from "react";
import useAdditionalFields from "../../hooks/useAdditionalFields";
import { DatePicker, Space, Tooltip } from "antd";
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
import classNames from "classnames";

const removeUndefinedProps = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

const getSpecialInputProps = (
  { inputProps, promotionDateProps = {}, ...rest },
  requireValue = "amount"
) => {
  const { name, value = {} } = inputProps;
  const { type, placeholder, ...promotionRest } = promotionDateProps;

  const updatedProps = removeUndefinedProps({
    ...inputProps,
    name: `${name}.${requireValue}`,
    value: value[requireValue],
    ...removeUndefinedProps({ type, placeholder }),
  });

  return { ...rest, inputProps: { ...updatedProps }, ...promotionRest };
};

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

const RenderInputField = ({ isTableData, label, ...rest }) => {
  const { name } = rest.inputProps || {};

  return name.includes("dimensions") ? (
    <MultiInputGroup {...rest} />
  ) : isTableData && name.includes("pricing.special") ? (
    <SpecialPriceWrapper {...rest} label={label} />
  ) : name.includes("pricing.special") ? (
    <FormInput {...getSpecialInputProps(rest)} />
  ) : (
    <FormInput {...rest} />
  );
};

const RenderTableContent = ({
  isTableHeader,
  fields,
  isTableData,
  isVariationField,
  rowIndex,
}) => {
  const { formState, handleInputChange: onChange } = useProductFormState();

  return fields.map(
    ({ fieldPath, inputProps, label, guidelinesProps, ...rest }, idx) => {
      const name = getFieldPath(isVariationField, fieldPath, rowIndex);
      const value = get(formState, name);
      const InputFieldProps = {
        inputProps: { ...inputProps, name, value, onChange },
        isTableData,
        ...rest,
      };

      return isTableHeader ? (
        <th key={`table-header-${idx}`}>
          <InputHeader
            hideValidation={false}
            label={label}
            name={name}
            id={`${name}-form-input`}
            customClass={styles.tableHeader}
            guidelinesProps={guidelinesProps}
          />
        </th>
      ) : isTableData ? (
        <td key={`table-data-${idx}`}>
          <RenderInputField {...InputFieldProps} label={label} />
        </td>
      ) : (
        <RenderInputField key={`multi-input-${idx}`} {...InputFieldProps} />
      );
    }
  );
};

const SpecialPriceWrapper = memo(
  ({ showMoreBtnProps, promotionDateProps, ...rest }) => {
    const { additionalFields } = useProductFormUI();
    const { RangePicker } = DatePicker;

    const updatedProps = useMemo(
      () => ({
        formInputProps: { ...getSpecialInputProps(rest) },
        dropDownInputProps: {
          ...getSpecialInputProps({ ...rest, promotionDateProps }, "status"),
        },
      }),
      [rest, promotionDateProps]
    );

    const content = useMemo(
      () => (
        <div
          className={classNames(styles.specialPriceWrapper, "flex flex-col")}
        >
          <FormInput {...updatedProps.formInputProps} />
          {additionalFields.productDetails ? (
            <DropdownInput {...updatedProps.dropDownInputProps} />
          ) : (
            <ShowMoreBtn {...showMoreBtnProps} />
          )}
          <Space direction="vertical" size={12}>
            <RangePicker />
          </Space>
        </div>
      ),
      [updatedProps, additionalFields, showMoreBtnProps]
    );

    return (
      <Tooltip
        title={content}
        destroyTooltipOnHide
        trigger={"click"}
        overlayClassName={styles.globalTooltip}
      >
        <button>Add</button>
      </Tooltip>
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
        <RenderTableContent
          isTableHeader={true}
          fields={additionalFields}
          isTableData={true}
        />
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
            <RenderTableContent
              isTableHeader={false}
              fields={additionalFields}
              isTableData={true}
              rowIndex={rowIndex}
              isVariationField={true}
            />
          </tr>
        ))
      ) : (
        <tr>
          <RenderTableContent
            isTableHeader={false}
            fields={additionalFields}
            isTableData={true}
            rowIndex={-1}
          />
        </tr>
      )}
    </tbody>
  )
);
TableRows.displayName = "TableRows";

// Main Product Price & Stock component
function ProductPriceStockWrapper({ variations }) {
  const { handleApplyToAll } = useProductFormState();

  const variationRows = useMemo(() => {
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
        <div className="flex align-center">
          <div className="flex">
            <RenderTableContent
              isTableHeader={false}
              fields={commonFields.slice(0, 4)}
              isTableData={false}
              rowIndex={-1}
            />
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
            hasVariationRows={hasVariationRows}
            variationColumnNames={variationColumnNames}
            additionalFields={additionalFields}
          />
          <TableRows
            variationRows={variationRows}
            hasVariationRows={hasVariationRows}
            variationColumnNames={variationColumnNames}
            additionalFields={additionalFields}
          />
        </table>
      </div>
    </div>
  );
}

export default memo(ProductPriceStockWrapper);
