import { Link } from "react-router";
import { HeartButton } from "./HeartButton";

export const Card = ({ product, productImage, isEnglish }) => {

    const enName = product.productTranslationDtoList.find((item) => item.languageCode === "en")?.productName || "Unnamed Product";
    const zhName = product.productTranslationDtoList.find((item) => item.languageCode === "zh-hk")?.productName || "Unnamed Product";

    const linkEnName = enName.replace(/\s+/g, "_"); //replace whitespace characters to _
    const linkZnName = encodeURIComponent(zhName);

    const category = product.category.toLowerCase();
    const categoryTypes = product.categoryTypes.toLowerCase();

    const languageCode = isEnglish? "en" : "zh-hk";
    return (
        <div key={product.productId} className="border border-gray-300 px-4 pt-4 sm:rounded-lg">
            <div className="relative">

                {/* Link wraps the image */}
                <Link to={`/category/${category}/${categoryTypes}/${linkEnName}${linkZnName}/${product.productId}/${languageCode}`} target="_blank">
                    {/* product Image */}
                    <img src={productImage} className="cursor-pointer" />
                </Link>

                <HeartButton productId={product.productId}/>
            </div>


            {/* product Info */}
            <div className="mt-2 sm:mt-5 mb-2 sm:mb-4 pl-3">
                <p className="font-semibold">{isEnglish ? enName : zhName}</p>
                <p className="text-gray-600">HKD {product.productPrice}</p>
            </div>
        </div>
    )
}