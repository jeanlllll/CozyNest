export const transferToColorSizeMap = (productVariantDtoList) => {

    /* color size map, key is color, value is list of object, object for size and productDisplayId */

    const sizeOrder = ["S", "M", "L", "XL"];

    const colorMap = new Map();

    productVariantDtoList.forEach((productVariant) => {
        const color = productVariant.color;
        const size = productVariant.size;
        const gender = productVariant.gender;
        const displayId = productVariant.productDisplayId;
        const productVariantId = productVariant.id;

        if (!productVariant.isAvailable) {
            return;
        }

        if (colorMap.has(color)) {
            colorMap.get(color).push({ size, displayId, gender, productVariantId });
        } else {
            colorMap.set(color, [{ size, displayId, gender, productVariantId }]);
        }
    })

    for (const [color, variants] of colorMap.entries()) {
        variants.sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
    }

    return colorMap;

}