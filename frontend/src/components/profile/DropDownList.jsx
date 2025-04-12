import { useState } from "react";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { ConfirmModal } from "./ConfirmModal"
import { EditAddressModal } from "./EditAddressModal";

export const DropDownList = ({ addressList, handleAddressToEdit, removeAddress, isEnglish }) => {

    const [showList, setShowList] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [addressToRemove, setAddressToRemove] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [addressToChange, setAddressToChange] = useState(null);

    const handleRemoveOnClick = (address) => {
        setShowList(false)
        setAddressToRemove(address)
        setShowConfirmModal(true);
    }

    const handleConfirmRemove = () => {
        removeAddress(addressToRemove);
        setShowConfirmModal(false);
    }

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setAddressToRemove(null);
    }

    const handleEditOnClick = (addressId, address) => {
        setShowEditModal(true);
        setAddressToChange(address)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        setAddressToChange(null)
    }

    const handleEditAddress = (addressToChange) => {
        handleAddressToEdit(addressToChange)
        setAddressToChange(null);
        setShowEditModal(false);
    }

    return (
        <div>
            <div className="hidden sm:flex min-h-11 border border-gray-300 rounded text-lg justify-between cursor-pointer bg-white">
                <div className="w-full pl-2 py-2">
                    {addressList.map((address, index) => (
                        <div className="flex flex-row justify-between items-center hover:bg-gray-100">
                            <div
                                key={index}
                                className={`px-2 py-2 cursor-pointer text-gray-700 flex-grow`}
                            >
                                {address.floorNBuilding + ", " + address.street + ", " + address.city + ", " + address.state + ", " + address.country + ", " + address.postalCode}
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 px-3 text-md py-1 rounded cursor-pointer" onClick={() => handleEditOnClick(address.addressId, address)}>
                                    {isEnglish ? "Edit" : "編輯"}
                                </div>
                                {addressList.length > 1 && <div className="mr-2 px-3 text-md py-1 rounded cursor-pointer" onClick={() => handleRemoveOnClick(address)}>
                                    {isEnglish ? "Remove" : "移除"}
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sm:hidden mt-2">
                <div className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm">
                    {addressList.map((address, index) => (
                        <div key={index} className="flex flex-col justify-between hover:bg-gray-50 border-b border-gray-300 last:border-b-0">
                            <div
                                className={`px-2 py-3 text-gray-700 flex-grow`}
                            >
                                <p className="text-sm leading-relaxed">
                                    {address.floorNBuilding + ", " + address.street + ", " + address.city + ", " + address.state + ", " + address.country + ", " + address.postalCode}
                                </p>
                            </div>
                            <div className="flex justify-end gap-2 px-2 pb-3">
                                <button 
                                    className="text-gray-600 hover:text-gray-900 px-4 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors" 
                                    onClick={() => handleEditOnClick(address.addressId, address)}
                                >
                                    {isEnglish ? "Edit" : "編輯"}
                                </button>
                                {addressList.length > 1 && 
                                    <button 
                                        className="text-red-600 hover:text-red-700 px-4 py-1.5 text-sm rounded-md border border-red-200 hover:bg-red-50 transition-colors" 
                                        onClick={() => handleRemoveOnClick(address)}
                                    >
                                        {isEnglish ? "Remove" : "移除"}
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {showEditModal && <EditAddressModal isOpen={showEditModal} onClose={handleCloseEditModal} onSave={handleEditAddress} currentAddress={addressToChange} />}
            {addressList.length > 1 && showConfirmModal && <ConfirmModal isOpen={showConfirmModal} onClose={handleCloseConfirmModal} onConfirm={handleConfirmRemove} />}
        </div>
    )

}



