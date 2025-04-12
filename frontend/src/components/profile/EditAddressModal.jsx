import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const EditAddressModal = ({ isOpen, onClose, onSave, currentAddress, disableEdit }) => {

    const [editingAddress, setEditingAddress] = useState(currentAddress || {});

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
            return () => {
                document.body.style.overflow = "auto"
            };
        }
    }, [isOpen]);

    useEffect(() => {
        setEditingAddress(currentAddress || {})
    }, [currentAddress])

    if (!isOpen) return null;

    const handleChange = (e, field) => {
        setEditingAddress((prev) => ({
            ...prev, 
            [field]: e.target.value
        }))
    }

    const handleSave = () => {
        onSave(editingAddress);
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[95%] h-[95%] sm:h-[53%] sm:w-full max-w-lg sm:max-w-3xl pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-8 relative mx-4">
                {/* Close Button */}
                <button
                    className="absolute top-1 right-3 text-gray-500 hover:text-black text-4xl cursor-pointer px-2"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-2 sm:px-4">Edit Address</h2>

                <div className="flex flex-col gap-2 sm:gap-4 relative z-10 mt-3 sm:mt-5 px-2 sm:px-4">
                    <div className="flex flex-col sm:flex-row sm:gap-10">
                        <div className="basis-1/2 flex flex-col mb-2 sm:mb-0">
                            <label htmlFor="floorNBuilding" className="text-base sm:text-lg mb-1.5 sm:mb-2">
                                Floor and Building
                            </label>
                            <input
                                type="text"
                                id="floorNBuilding"
                                className="border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg"
                                value={editingAddress.floorNBuilding}
                                onChange={(e) => handleChange(e, "floorNBuilding")}
                                disabled={disableEdit}
                            />
                        </div>

                        <div className="basis-1/2 flex flex-col">
                            <label htmlFor="street" className="text-base sm:text-lg mb-1.5 sm:mb-2">
                                Street
                            </label>
                            <input
                                type="text"
                                id="street"
                                className="border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg"
                                value={editingAddress.street}
                                onChange={(e) => handleChange(e, "street")}
                                disabled={disableEdit}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-10">
                        <div className="basis-1/2 flex flex-col mb-2 sm:mb-0">
                            <label htmlFor="city" className="text-base sm:text-lg mb-1.5 sm:mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                className="border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg"
                                value={editingAddress.city}
                                onChange={(e) => handleChange(e, "city")}
                                disabled={disableEdit}
                            />
                        </div>

                        <div className="basis-1/2 flex flex-col">
                            <label htmlFor="state" className="text-base sm:text-lg mb-1.5 sm:mb-2">
                                State/Province
                            </label>
                            <input
                                type="text"
                                id="state"
                                className="border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg"
                                value={editingAddress.state}
                                onChange={(e) => handleChange(e, "state")}
                                disabled={disableEdit}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-10">
                        <div className="basis-1/2 flex flex-col mb-2 sm:mb-0">
                            <label htmlFor="country" className="text-base sm:text-lg mb-1.5 sm:mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                id="country"
                                className="border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg"
                                value={editingAddress.country}
                                onChange={(e) => handleChange(e, "country")}
                                disabled={disableEdit}
                            />
                        </div>

                        <div className="basis-1/2 flex flex-col">
                            <label htmlFor="postalCode" className="text-base sm:text-lg mb-1.5 sm:mb-2">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                className="border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg"
                                value={editingAddress.postalCode}
                                onChange={(e) => handleChange(e, "postalCode")}
                                disabled={disableEdit}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-end gap-3 mt-5 sm:mt-10 px-2 sm:px-4">
                    <button
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer text-base sm:text-lg"
                        onClick={() => onClose()}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer text-base sm:text-lg"
                        onClick={() => handleSave()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

