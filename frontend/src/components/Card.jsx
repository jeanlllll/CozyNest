import { HeartIcon } from "../assets/icons/HeartIcon"

export const Card = ({ product, productImage, productName }) => {
    return (
        <div key={product.productId} className="border border-gray-300 px-4 pt-4 rounded-lg">
            <div className="relative">
                {/* product Image */}
                <img src={productImage}
                    className="cursor-pointer"
                />

                <div className="absolute top-1.5 right-1.5 bg-buttonMain opacity-50 p-2 rounded-full flex items-center justify-center cursor-pointer hover:opacity-100 drop-shadow-xl">
                    <HeartIcon/>
                </div>

            </div>


            {/* product Info */}
            <div className="mt-5 mb-4 pl-3">
                <p className="font-semibold">{productName}</p>
                <p className="text-gray-600">HKD {product.productPrice}</p>
            </div>
        </div>
    )
}