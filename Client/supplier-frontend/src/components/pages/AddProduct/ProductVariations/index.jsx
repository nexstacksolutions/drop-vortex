import styles from "./index.module.css";
import { get } from "lodash";
import { useCallback, useState } from "react";
import { FormInput, MediaInput, InputWrapper } from "../ProductInputs";
import { RiDeleteBin5Line, RiMenuFill } from "react-icons/ri";
import { useProductForm } from "../../../../context/ProductForm";

function VariantItem({
  variantData,
  variationIndex,
  valueIndex,
  useCustomOnChange,
  showVariantImages,
}) {
  const { handleAddVariantItem, handleRemoveVariantItem, handleInputChange } =
    useProductForm();

  const [state, setState] = useState({
    inputValue: "",
    variantImages: [],
    resetTrigger: false,
  });

  const { inputValue, variantImages, resetTrigger } = state;

  const resetVariantImages = useCallback(() => {
    setState({
      inputValue: "",
      variantImages: [],
      resetTrigger: !resetTrigger,
    });
    setTimeout(
      () => setState((prevState) => ({ ...prevState, resetTrigger: false })),
      0
    );
  }, [resetTrigger]);

  const handleKeyDown = useCallback(() => {
    if (inputValue.trim()) {
      handleAddVariantItem(inputValue, variantImages, variationIndex);
      resetVariantImages();
    }
  }, [
    inputValue,
    variantImages,
    resetVariantImages,
    variationIndex,
    handleAddVariantItem,
  ]);

  const updatedValueIndex =
    valueIndex === undefined ? "addVariantItem" : valueIndex;

  const updatedInputName = `productDetails.variations[${variationIndex}].values[${updatedValueIndex}]`;

  return (
    <div className={`${styles.variantItem} flex align-center`}>
      <FormInput
        name={`${updatedInputName}.name`}
        type="text"
        placeholder="Please type or select"
        value={(variantData && variantData.name) || inputValue}
        onChange={(e) => setState({ ...state, inputValue: e.target.value })}
        useCustomOnChange={useCustomOnChange}
        onKeyDown={handleKeyDown}
        customClass={styles.formInput}
      />

      {showVariantImages && (
        <MediaInput
          name={`${updatedInputName}.variantImages`}
          fileType="image"
          maxFiles={5}
          value={variantData?.variantImages || variantImages}
          resetTrigger={resetTrigger}
          onChange={(_, __, newMedia) =>
            setState((prevState) => ({
              ...prevState,
              variantImages: newMedia,
            }))
          }
          customClass={styles.mediaInput}
        />
      )}

      {
        <div className={`${styles.variantActions} flex justify-end`}>
          <button
            type="button"
            onClick={() => handleRemoveVariantItem(variationIndex, valueIndex)}
            className={styles.removeVariant}
          >
            <RiDeleteBin5Line />
          </button>
          <button type="button" className={styles.moveVariant}>
            <RiMenuFill />
          </button>
        </div>
      }
    </div>
  );
}

function ProductVariations() {
  const { state, formErrors, handleInputChange: onChange } = useProductForm();
  const variations = get(state, "productDetails.variations");
  const showVariantImages = get(state, "uiState.showVariantImages");
  const err = get(formErrors, `productDetails.variations`);

  return (
    <div className={`${styles.productVariationsWrapper} flex flex-col`}>
      {variations.map(({ type, values }, variationIndex) => {
        const name = `productDetails.variations[${variationIndex}].values`;

        return (
          <InputWrapper
            key={variationIndex}
            name={name}
            label={`Variant ${variationIndex + 1}`}
            customClass={styles.variationItem}
          >
            <div className={`${styles.variationHeader} flex flex-col`}>
              <div className={`${styles.variationInfo} flex flex-col`}>
                <span className={styles.variationName}>Variant Name</span>
                <span className={styles.variationType}>{type}</span>
              </div>
              <div className={`${styles.variationDetails} flex flex-col`}>
                <span>Total Variants</span>
                <div
                  className={`${styles.showImageCheckbox} flex align-center`}
                >
                  <FormInput
                    name="uiState.showVariantImages"
                    type="checkbox"
                    value={showVariantImages}
                    checked={showVariantImages}
                    onChange={(e) => onChange(null, name, e.target.checked)}
                  />
                  <label
                    htmlFor="showImageCheckbox-form-input"
                    className="flex align-center"
                  >
                    <span>Add Image</span>
                    <span>Max 8 images for each variant.</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={`${styles.variationBody} flex flex-col`}>
              <div className={`${styles.variantWrapper} flex flex-col`}>
                {values.map((variantData, valueIndex) => (
                  <VariantItem
                    key={`${variationIndex}-${variantData.id}`}
                    variantData={variantData}
                    variationIndex={variationIndex}
                    valueIndex={valueIndex}
                    showVariantImages={showVariantImages}
                  />
                ))}
              </div>

              <VariantItem
                variationIndex={variationIndex}
                showVariantImages={showVariantImages}
                useCustomOnChange={true}
              />
            </div>
          </InputWrapper>
        );
      })}

      {err && <p className={styles.errorMsg}>{err}</p>}
    </div>
  );
}

export default ProductVariations;
