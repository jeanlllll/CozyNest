import { useState } from "react";
import { useSelector } from "react-redux"
import { setTransportationMethod } from "../../store/features/orderSlice";
import { useDispatch } from "react-redux";

export const CheckoutForm = ({formData, setFormData, isEnglish}) => {
    const dispatch = useDispatch();
    const transportation = useSelector((state) => state.order.transportationMethod)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const inputClassName = "border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-buttonMain focus:border-buttonMain";
    const labelClassName = "text-base font-medium mb-1";

    return (
        <div className="flex flex-col text-buttonMain px-4 sm:px-8">
            <div className="flex flex-col border-b pb-6 sm:pb-8 border-gray-300">
                <h1 className="text-xl font-bold mb-4 sm:mb-6">{isEnglish ? "Shipping Information" : "送貨資料"}</h1>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="receiver" className={labelClassName}>
                            {isEnglish ? "Receiver" : "收件人"}
                        </label>
                        <input
                            type="text"
                            id="receiver"
                            placeholder={isEnglish ? "Peter Chan" : "收件人"}
                            className={inputClassName}
                            value={formData.receiver}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="phoneNumber" className={labelClassName}>
                            {isEnglish ? "Phone Number" : "電話號碼"}
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder={isEnglish ? "Phone Number" : "電話號碼"}
                            className={inputClassName}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="floorNBuilding" className={labelClassName}>
                            {isEnglish ? "Floor and Building" : "樓層及大廈"}
                        </label>
                        <input
                            type="text"
                            id="floorNBuilding"
                            placeholder={isEnglish ? "Floor and Building" : "樓層及大廈"}
                            className={inputClassName}
                            value={formData.floorNBuilding}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="street" className={labelClassName}>
                            {isEnglish ? "Street" : "街道"}
                        </label>
                        <input
                            type="text"
                            id="street"
                            placeholder={isEnglish ? "Street" : "街道"}
                            className={inputClassName}
                            value={formData.street}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="city" className={labelClassName}>
                            {isEnglish ? "City" : "城市"}
                        </label>
                        <input
                            type="text"
                            id="city"
                            placeholder={isEnglish ? "City" : "城市"}
                            className={inputClassName}
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="state" className={labelClassName}>
                            {isEnglish ? "State/Province" : "州/省"}
                        </label>
                        <input
                            type="text"
                            id="state"
                            placeholder={isEnglish ? "State" : "州/省"}
                            className={inputClassName}
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="country" className={labelClassName}>
                            {isEnglish ? "Country" : "國家"}
                        </label>
                        <input
                            type="text"
                            id="country"
                            placeholder={isEnglish ? "Country" : "國家"}
                            className={inputClassName}
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2">
                        <label htmlFor="postalCode" className={labelClassName}>
                            {isEnglish ? "Postal Code" : "郵政編碼"}
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder={isEnglish ? "Postal Code" : "郵政編碼"}
                            className={inputClassName}
                            value={formData.postalCode}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 sm:mt-8">
                <h1 className="text-xl font-bold mb-4 sm:mb-6">{isEnglish ? "Delivery Method" : "送貨方式"}</h1>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="w-full sm:w-1/2" onClick={() => dispatch(setTransportationMethod("STANDARD"))}>
                        <div className={`flex flex-col gap-2 rounded-lg border p-4 sm:p-6 transition-colors duration-200
                            ${transportation === "STANDARD" ? "border-2 border-buttonMain" : "border-gray-300 hover:border-gray-400"}`}>
                            <h2 className="text-lg font-medium">{isEnglish ? "Standard" : "標準"}</h2>
                            <div className="text-gray-600">{isEnglish ? "3-10 business days" : "3-10 個工作天"}</div>
                            <div className="font-medium">HKD 20</div>
                        </div>
                    </div>

                    <div className="w-full sm:w-1/2" onClick={() => dispatch(setTransportationMethod("EXPRESS"))}>
                        <div className={`flex flex-col gap-2 rounded-lg border p-4 sm:p-6 transition-colors duration-200
                            ${transportation === "EXPRESS" ? "border-2 border-buttonMain" : "border-gray-300 hover:border-gray-400"}`}>
                            <h2 className="text-lg font-medium">{isEnglish ? "Express" : "快遞"}</h2>
                            <div className="text-gray-600">{isEnglish ? "2-4 business days" : "2-4 個工作天"}</div>
                            <div className="font-medium">HKD 40</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    {isEnglish 
                        ? "Amount exceeds HKD300. Standard shipping is free." 
                        : "金額超過港幣300元。標準運送免費。"
                    }
                </div>
            </div>
        </div>
    )
}