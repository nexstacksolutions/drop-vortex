import styles from "./ProductForm.module.css";
import { useCallback, useState } from "react";
import { RiDeleteBin5Line, RiMenuFill } from "react-icons/ri";
import { useProductForm } from "../../../../context/ProductForm";
import { FormInput, MediaInput, InputWrapper } from "./ProductInputs";

function VariantActionButtons({ handleRemove }) {
  return (
    <div className={`${styles.variantActions} flex justify-end`}>
      <button
        type="button"
        onClick={handleRemove}
        className={styles.removeVariant}
      >
        <RiDeleteBin5Line />
      </button>
      <button type="button" className={styles.moveVariant}>
        <RiMenuFill />
      </button>
    </div>
  );
}

function VariantItem({
  handleAddVariantItem,
  handleRemoveVariantItem,
  variantData,
  variationIndex,
  valueIndex,
  showVariantImages,
  onChange,
}) {
  const [inputState, setInputState] = useState({
    inputValue: "",
    variantImages: [],
    resetTrigger: false,
  });

  const { inputValue, variantImages, resetTrigger } = inputState;

  const resetInputValues = useCallback(() => {
    setInputState({
      inputValue: "",
      variantImages: [],
      resetTrigger: !resetTrigger,
    });
    setTimeout(
      () =>
        setInputState((prevState) => ({ ...prevState, resetTrigger: false })),
      0
    );
  }, [resetTrigger]);

  const handleKeyDown = useCallback(() => {
    if (inputValue.trim()) {
      handleAddVariantItem(inputValue, variantImages, variationIndex);
      resetInputValues();
    }
  }, [
    inputValue,
    variantImages,
    resetInputValues,
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
        onChange={
          onChange
            ? onChange
            : (e) =>
                setInputState({ ...inputState, inputValue: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      {showVariantImages && (
        <MediaInput
          name={`${updatedInputName}.variantImages`}
          fileType="image"
          maxFiles={5}
          value={variantData?.variantImages || variantImages}
          resetTrigger={resetTrigger}
          onChange={
            onChange
              ? onChange
              : (_, __, newMedia) =>
                  setInputState((prevState) => ({
                    ...prevState,
                    variantImages: newMedia,
                  }))
          }
        />
      )}

      {onChange && (
        <VariantActionButtons
          handleRemove={() =>
            handleRemoveVariantItem(variationIndex, valueIndex)
          }
        />
      )}
    </div>
  );
}

function ProductVariations({ variations, onChange }) {
  const { handleRemoveVariantItem, handleAddVariantItem } = useProductForm();
  const [showVariantImages, setShowVariantImages] = useState(false);

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
                <FormInput
                  name="showImageCheckbox"
                  label={
                    <>
                      <span>Add Image</span>
                      <span>Max 8 images for each variant.</span>
                    </>
                  }
                  type="checkbox"
                  value={showVariantImages}
                  onChange={(e) => setShowVariantImages(e.target.checked)}
                  customClass={styles.showImageCheckbox}
                />
              </div>
            </div>

            <div className={`${styles.variationBody} flex flex-col`}>
              <div className={`${styles.variantWrapper} flex flex-col`}>
                {values.map((variantData, valueIndex) => (
                  <VariantItem
                    key={`${variationIndex}-${variantData.id}`}
                    {...{
                      variantData,
                      onChange,
                      variationIndex,
                      valueIndex,
                      showVariantImages,
                      handleRemoveVariantItem,
                    }}
                  />
                ))}
              </div>

              <VariantItem
                {...{ handleAddVariantItem, variationIndex, showVariantImages }}
              />
            </div>
          </InputWrapper>
        );
      })}
    </div>
  );
}

export default ProductVariations;
