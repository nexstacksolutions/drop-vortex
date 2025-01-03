import styles from "./index.module.css";
import dayjs from "dayjs";
import { get } from "lodash";
import classNames from "classnames";
import { ShowMoreBtn } from "./FormUi";
import { useMemo, memo, useState, useEffect, useCallback } from "react";
import useAdditionalFields from "../../hooks/useAdditionalFields";
import { DatePicker, Tooltip } from "antd";
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

const removeUndefinedProps = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

const buildInputProps = (
  { inputProps, promotionDateProps = {}, ...rest },
  requireValue = "amount"
) => {
  const { name, value = {} } = inputProps;
  const { type, placeholder, ...promotionRest } = promotionDateProps;

  const updatedProps = {
    ...inputProps,
    name: `${name}${name === "" ? "" : "."}${requireValue}`,
    value: value[requireValue],
    ...removeUndefinedProps({ type, placeholder }),
  };

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
  const isDimensions = name.includes("dimensions");
  const isSpecialPricing = isTableData && name.includes("pricing.special");

  const updatedProps = name.includes("pricing.special")
    ? buildInputProps(rest)
    : rest;

  return isDimensions ? (
    <MultiInputGroup {...rest} />
  ) : isSpecialPricing ? (
    <SpecialPriceWrapper {...rest} label={label} />
  ) : (
    <FormInput {...updatedProps} label={null} />
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
  ({ inputProps, showMoreBtnProps, promotionDateProps, ...rest }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { name, value, onChange } = inputProps;
    const [initialValues, setInitialValues] = useState(value);
    const { additionalFields, toggleAdditionalFields, formErrors } =
      useProductFormUI();
    const { RangePicker } = DatePicker;
    const dateFormat = "DD-MM-YYYY";
    const hasErrors = Object.keys(formErrors).some((key) =>
      key.startsWith(name)
    );

    const defaultRange = Object.values(value.range).map((date) => {
      const dayjsDate = dayjs(date, dateFormat);
      return dayjsDate.isValid() ? dayjsDate : null;
    });

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = useCallback(
      (e) => {
        const { innerText } = e.target;
        if ((hasErrors || value.amount === "") && innerText === "Ok") return;
        if (innerText === "Ok") setInitialValues(value);
        if (innerText === "Cancel") {
          onChange(null, name, initialValues);
        }

        setIsOpen(false);
      },
      [hasErrors, name, value, initialValues, onChange]
    );

    const updatedProps = useMemo(() => {
      return {
        formInputProps: buildInputProps({ inputProps, ...rest }),
        dropDownInputProps: buildInputProps(
          { inputProps, ...rest, promotionDateProps },
          "status"
        ),
      };
    }, [inputProps, rest, promotionDateProps]);

    const handleRangeChange = (dates) => {
      if (!dates || dates.length !== 2) return;
      const [start, end] = dates.map((date) => date.format(dateFormat));
      onChange(null, `${name}.range`, { start, end });
    };

    const content = (
      <>
        <div
          className={classNames(styles.specialPriceWrapper, "flex flex-col")}
        >
          <FormInput {...updatedProps.formInputProps} />
          <p>
            Sales Price for a Product for Promotion,. The rate of the special
            price to the price must be between 0.05 and 1.00
          </p>
          {additionalFields.productDetails ? (
            <>
              <DropdownInput {...updatedProps.dropDownInputProps} />
              {value.status === "Set Date" && (
                <RangePicker
                  defaultValue={defaultRange}
                  onChange={handleRangeChange}
                  format={dateFormat}
                />
              )}
            </>
          ) : (
            <ShowMoreBtn {...showMoreBtnProps} />
          )}
        </div>

        <div className={`${styles.tooltipActions} flex justify-end`}>
          <button className="btn primary-btn" onClick={handleClose}>
            Ok
          </button>
          <button className="btn secondary-btn" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </>
    );

    useEffect(() => {
      if (!isOpen)
        toggleAdditionalFields({ section: "productDetails", forceClose: true });
    }, [isOpen, toggleAdditionalFields]);

    return (
      <Tooltip
        title={content}
        destroyTooltipOnHide
        open={isOpen}
        onClick={handleOpen}
        overlayClassName={styles.globalTooltip}
      >
        <button>{value.amount || "Add"}</button>
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
            className={`${styles.applyToAllButton} btn primary-btn`}
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
