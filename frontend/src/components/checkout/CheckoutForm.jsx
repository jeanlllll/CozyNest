import { useState } from "react";
import { useSelector } from "react-redux"
import { setTransportationMethod } from "../../store/features/orderSlice";
import { useDispatch } from "react-redux";

export const CheckoutForm = ({formData, setFormData}) => {

    const dispatch = useDispatch();

    const transportation = useSelector((state) => state.order.transportationMethod)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }))
        // setErrors((prev) => ({ ...prev, [id]: "" }))
    }


    return (
        <div className="flex flex-col text-buttonMain px-20">

            <div className="flex flex-col border-b pb-10 border-gray-300">
                <h1 className="text-xl font-bold">Shipping Information</h1>

                <div className="flex flex-row gap-5 mt-9">
                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="receiver" className="text-lg">
                            Receiver
                        </label>
                        <input
                            type="text"
                            id="receiver"
                            placeholder="Peter Chan"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.receiver}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="phoneNumber" className="text-lg">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder="Phone Number"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="flex flex-row gap-5 mt-3">
                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="floorNBuilding" className="text-lg">
                            Floor and Building
                        </label>
                        <input
                            type="text"
                            id="floorNBuilding"
                            placeholder="Floor and Building"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.floorNBuilding}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="street" className="text-lg">
                            Street
                        </label>
                        <input
                            type="text"
                            id="street"
                            placeholder="Street"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.street}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-5 mt-3">
                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="city" className="text-lg">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            placeholder="City"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="State" className="text-lg">
                            State/Province
                        </label>
                        <input
                            type="text"
                            id="state"
                            placeholder="State"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-5 mt-3">
                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="country" className="text-lg">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            placeholder="Country"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1 basis-1/2">
                        <label htmlFor="postalCode" className="text-lg">
                            Postal Code
                        </label>
                        <input type="text"
                            id="postalCode"
                            placeholder="Postal"
                            className="border border-gray-300 rounded px-2 py-2 text-lg"
                            value={formData.postalCode}
                            onChange={handleChange}
                        />
                    </div>

                </div>
            </div>


            <div className="mt-10 cursor-pointer">
                <h1 className="text-xl font-bold">Delivery Method</h1>
                <div className="flex flex-row gap-12 mt-10">
                    <div className="basis-1/2" onClick={() => dispatch(setTransportationMethod("STANDARD"))}>
                        <div className={`flex flex-col gap-1 rounded-lg border  ${transportation === "STANDARD" ? "outline border-buttonMain" : "border-gray-300"} px-10 py-5`}>
                            <h1 className="text-lg font-medium">Standard</h1>
                            <div className={`mb-3 text-gray-700"}`}>3-10 business days</div>
                            <div>HKD 20</div>
                        </div>
                    </div>

                    <div className=" basis-1/2" onClick={() => dispatch(setTransportationMethod("EXPRESS"))}>
                        <div className={`flex flex-col gap-1 rounded-lg border  ${transportation === "EXPRESS" ? "outline border-buttonMain" : "border-gray-300"} px-10 py-5`}>
                            <h1 className="text-lg font-medium">Express</h1>
                            <div className={`mb-3 "text-gray-700"`}>2-4 business days</div>
                            <h1>HKD 40</h1>
                        </div>
                    </div>
                </div>

                <div className="mt-3 text-md font-semibold">Amount exceeds HKD300. Standard shipping is free.</div>
            </div>
        </div>

    )
}