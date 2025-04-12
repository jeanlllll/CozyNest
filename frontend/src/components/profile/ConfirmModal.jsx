import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[90%] sm:w-full max-w-md px-5 sm:px-8 pt-12 pb-8 relative">
                {/* Close Button */}
                <button
                    className="absolute top-1 right-3 text-gray-500 hover:text-black text-4xl cursor-pointer px-2"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className='text-xl font-semibold mb-4 px-4'>Are you sure you want to remove this address?</h2>

                <div className="flex flex-row justify-between mt-5 px-4">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                        onClick={onConfirm} // Call onConfirm when confirmed
                    >
                        Yes, Remove
                    </button>
                    <button
                        className="px-4 py-2  bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
                        onClick={onClose} // Close without removing
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
