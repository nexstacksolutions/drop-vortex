import styles from "./index.module.css";
import { useCallback, useState, memo } from "react";
import { RiDeleteBin5Line, RiMenuFill } from "react-icons/ri";
import { useProductFormState } from "../../../../../contexts/ProductForm";
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
    onChange,
    variantData,
    variationIndex,
    valueIndex,
    updateVariantItem,
    showVariantImages,
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
          inputProps={{
            name: `${updatedInputName}.name`,
            type: "text",
            placeholder: "Please type or select",
            value: (variantData && variantData.name) || inputValue,
            onChange: onChange
              ? onChange
              : (e) =>
                  setInputState({ ...inputState, inputValue: e.target.value }),
          }}
          hideFormGuide={true}
          onKeyDown={handleKeyDown}
        />

        {showVariantImages && (
          <MediaInput
            inputProps={{
              name: `${updatedInputName}.variantImages`,
              value: variantData?.variantImages || variantImages,
              onChange: onChange
                ? onChange
                : (_, __, newMedia) =>
                    setInputState((prevState) => ({
                      ...prevState,
                      variantImages: newMedia,
                    })),
            }}
            hideFormGuide={true}
            fileType="image"
            maxFiles={8}
            resetTrigger={resetTrigger}
            mediaPreviewProps={{ showMediaPreview: true, enablePopup: true }}
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

function ProductVariations({ variations }) {
  const { updateVariantItem, handleInputChange: onChange } =
    useProductFormState();
  const [showVariantImages, setShowVariantImages] = useState(false);

  return (
    <div className={`${styles.productVariationsWrapper} flex flex-col`}>
      {variations.map(({ type, values }, variationIndex) => {
        const name = `productDetails.variations[${variationIndex}].values`;
        const label = (
          <>
            <span>Add Image</span>
            <span>Max 8 images for each variant.</span>
          </>
        );

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
                  inputProps={{
                    name: "showImageCheckbox",
                    type: "checkbox",
                    value: { showVariantImages },
                    onChange: (e) => setShowVariantImages(e.target.checked),
                  }}
                  label={label}
                  customClass={styles.showImageCheckbox}
                  hideFormGuide={true}
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
                {...{
                  updateVariantItem,
                  variationIndex,
                  showVariantImages,
                }}
              />
            </div>
          </InputContainer>
        );
      })}
    </div>
  );
}

export default memo(ProductVariations);
