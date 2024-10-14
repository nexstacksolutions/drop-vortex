import styles from "./ProductForm.module.css";
import { useCallback, useState, memo } from "react";
import { RiDeleteBin5Line, RiMenuFill } from "react-icons/ri";
import { useProductFormState } from "../../../../context/ProductForm";
import { FormInput, MediaInput, InputContainer } from "./ProductInputs";

const VariantActionButtons = memo(({ handleRemove }) => {
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
});
VariantActionButtons.displayName = "VariantActionButtons";

const VariantItem = memo(
  ({
    variantData,
    variationIndex,
    valueIndex,
    updateVariantItem,
    showVariantImages,
    onChange,
  }) => {
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
        updateVariantItem(
          inputValue,
          variantImages,
          variationIndex,
          null,
          true
        );
        resetInputValues();
      }
    }, [
      inputValue,
      variantImages,
      resetInputValues,
      variationIndex,
      updateVariantItem,
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
              updateVariantItem(null, null, variationIndex, valueIndex, false)
            }
          />
        )}
      </div>
    );
  }
);
VariantItem.displayName = "VariantItem";

function ProductVariations({ variations, onChange }) {
  const { updateVariantItem } = useProductFormState();
  const [showVariantImages, setShowVariantImages] = useState(false);

  return (
    <div className={`${styles.productVariationsWrapper} flex flex-col`}>
      {variations.map(({ type, values }, variationIndex) => {
        const name = `productDetails.variations[${variationIndex}].values`;

        return (
          <InputContainer
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
                      updateVariantItem,
                    }}
                  />
                ))}
              </div>

              <VariantItem
                {...{ updateVariantItem, variationIndex, showVariantImages }}
              />
            </div>
          </InputContainer>
        );
      })}
    </div>
  );
}

export default memo(ProductVariations);
