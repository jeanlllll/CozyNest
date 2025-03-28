import { HeartIcon } from "../assets/icons/HeartIcon"
import { Link } from "react-router";

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
                <Link to={`/category/${category}/${categoryTypes}/${linkEnName}${linkZnName}/${product.productId}/${languageCode}`}>
                    {/* product Image */}
                    <img src={productImage} className="cursor-pointer" />
                </Link>

                <div className="absolute top-1.5 right-1.5 bg-buttonMain opacity-50 p-2 rounded-full flex items-center justify-center cursor-pointer hover:opacity-100 drop-shadow-xl">
                    <HeartIcon />
                </div>

            </div>


            {/* product Info */}
            <div className="mt-2 sm:mt-5 mb-2 sm:mb-4 pl-3">
                <p className="font-semibold">{isEnglish ? enName : zhName}</p>
                <p className="text-gray-600">HKD {product.productPrice}</p>
            </div>
        </div>
    )
}