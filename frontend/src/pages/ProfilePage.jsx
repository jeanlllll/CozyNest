import { useLoaderData } from "react-router"
import { EntireFooter } from "../components/footer/EntireFooter"
import { EntireHeader } from "../components/header/EntireHeader"
import { useState } from "react"
import { SideColumns } from "../components/profile/SideColumns"
import { DropDownList } from "../components/profile/DropDownList"
import { updateClientProfile } from "../api/updateClientProfile"
import { AlertCom } from "../components/AlertCom"
import { usePageMeta } from "../components/usePageMeta"
import { useSelector } from "react-redux"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"

export const ProfilePage = () => {
    const language = useSelector((state) => state.language.language)
    const isEnglish = language === "en";

    usePageMeta({ titleEn: "Profile", titleZh: "個人資料", isEnglish: isEnglish });

    const data = useLoaderData();
    const [personalInfo, setPersonalInfo] = useState(data);
    const [addNewAddress, setAddNewAddress] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [addressList, setAddressList] = useState(data.addressList || []);

    const [newAddress, setNewAddress] = useState({
        floorNBuilding: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: ""
    });

    const [addressIdSelected, setAddressIdSelected] = useState(null);

    const handleBasicInfoOnChange = (e, type) => {
        const { value } = e.target;
        setPersonalInfo((prevState) => ({
            ...prevState,
            [type]: value
        }))
    }

    const removeAddress = (address) => {
        const updatedAddressList = addressList.filter((addressItem) => addressItem.addressId !== address.addressId);
        if (updatedAddressList.length > 0) {
            setAddressList(updatedAddressList);
            if (addressIdSelected === address.addressId) {
                setAddressIdSelected(updatedAddressList[0]?.addressId || null);
            }
        }
        setPersonalInfo(prev => ({
            ...prev,
            addressList: updatedAddressList
        }));
    }

    const handleNewAddressOnChange = (e, type) => {
        const { value } = e.target;
        setNewAddress((prevState) => ({
            ...prevState,
            [type]: value
        }))
    }

    const handleAddressToEdit = (address) => {
        setAddressList((prevList) => (
            prevList.map((addressItem) => {
                if (addressItem.addressId === address.addressId) {
                    return address;
                }
                return addressItem;
            })
        ))
    }

    const handleOnSave = async () => {
        const saveNewAddress = [...addressList];
        if (newAddress.floorNBuilding !== "") {
            saveNewAddress.push(newAddress)
        }
        const updatedPersonalInfo = {
            ...personalInfo,
            addressList: saveNewAddress
        }
        console.log("Saving user info:", updatedPersonalInfo);
        const response = await updateClientProfile(updatedPersonalInfo);
        if (response.status === 200) {
            setPersonalInfo(response.data)
            setAddressList(response.data.addressList);
            setNewAddress({
                floorNBuilding: "",
                street: "",
                city: "",
                state: "",
                country: "",
                postalCode: ""
            });
            setAddNewAddress(false)
            setShowAlert(true)

            setTimeout(() => {
                setShowAlert(false)
            }, 3000)
        }
    }

    return (
        <div className="min-h-screen flex flex-col font-inter">
            <div className="relative z-20">
                <EntireHeader needPromotionBar={true} />
            </div>

            <div className="w-full flex justify-center">
                <div className="container flex flex-col sm:flex-row mt-10 sm:mb-6">
                    <div className="sm:mt-24 sm:ml-10 flex justify-center sm:justify-none">
                        <SideColumns type="profile" isEnglish={isEnglish} />
                    </div>

                    {/* right side */}
                    <div className="px-10 sm:px-0 sm:ml-47 sm:basis-3/5 mb-9 pt-8">
                        {showAlert && <div className="mb-8"><AlertCom message={"Save successfully"} type={"success"} /></div>}

                        <div className="flex flex-row justify-between">
                            <div className="text-3xl text-buttonMain font-bold">{isEnglish ? "My Profile" : "個人資料"}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 mt-4">
                            <div className="basis-1/2 flex flex-col">
                                <label htmlFor="firstName" className="text-lg">
                                    {isEnglish ? "First Name" : "名字"}
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="border border-gray-300 rounded px-2 py-2 text-lg"
                                    value={personalInfo ? personalInfo.firstName : ""}
                                    onChange={(e) => handleBasicInfoOnChange(e, "firstName")}
                                />
                            </div>

                            <div className="basis-1/2 flex flex-col">
                                <label htmlFor="lastName" className="text-lg">
                                    {isEnglish ? "Last Name" : "姓氏"}
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="border border-gray-300 rounded px-2 py-2 text-lg"
                                    value={personalInfo ? personalInfo.lastName : ""}
                                    onChange={(e) => handleBasicInfoOnChange(e, "lastName")}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 mt-3 sm:mt-5">
                            <div className="basis-1/2 flex flex-col">
                                <label htmlFor="email" className="text-lg">
                                    {isEnglish ? "Email" : "電子郵件"}
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="border border-gray-300 rounded px-2 py-2 text-lg"
                                    disabled="true"
                                    value={data.email}
                                />
                            </div>

                            <div className="basis-1/2 flex flex-col">
                                <label htmlFor="phoneNumber" className="text-lg">
                                    {isEnglish ? "Phone Number" : "手機號碼"}
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    className="border border-gray-300 rounded px-2 py-2 text-lg"
                                    value={personalInfo ? personalInfo.phoneNumber : ""}
                                    onChange={(e) => handleBasicInfoOnChange(e, "phoneNumber")}
                                />
                            </div>
                        </div>

                        <div className="relative z-20 mt-5">
                            <div className="flex flex-row justify-between">
                                <div className="text-lg">{isEnglish ? "Existing Address List" : "已儲存地址"}</div>
                                <div className="underline cursor-pointer" onClick={() => setAddNewAddress(!addNewAddress)}>{isEnglish ? "Add Address" : "新增地址"}</div>
                            </div>

                            {addNewAddress &&
                                <div className="pb-3">
                                    <div className="text-lg mt-6 underline font-semibold">{isEnglish ? "New Address" : "新地址"}</div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 relative z-10 mt-3">

                                        <div className="basis-1/2 flex flex-col">
                                            <label htmlFor="floorNBuilding" className="text-lg">
                                                {isEnglish ? "Floor and Building" : "樓層和大廈"}
                                            </label>
                                            <input
                                                type="text"
                                                id="floorNBuilding"
                                                className="border border-gray-300 rounded px-2 py-2 text-lg"
                                                value={newAddress.floorNBuilding}
                                                onChange={(e) => handleNewAddressOnChange(e, "floorNBuilding")}
                                            />
                                        </div>

                                        <div className="basis-1/2 flex flex-col">
                                            <label htmlFor="street" className="text-lg">
                                                {isEnglish ? "Street" : "街道"}
                                            </label>
                                            <input
                                                type="text"
                                                id="street"
                                                className="border border-gray-300 rounded px-2 py-2 text-lg"
                                                value={newAddress.street}
                                                onChange={(e) => handleNewAddressOnChange(e, "street")}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 relative z-10 mt-3 sm:mt-5">
                                        <div className="basis-1/2 flex flex-col">
                                            <label htmlFor="city" className="text-lg">
                                                {isEnglish ? "City" : "城市"}
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                className="border border-gray-300 rounded px-2 py-2 text-lg"
                                                value={newAddress.city}
                                                onChange={(e) => handleNewAddressOnChange(e, "city")}
                                            />
                                        </div>

                                        <div className="basis-1/2 flex flex-col">
                                            <label htmlFor="state" className="text-lg">
                                                {isEnglish ? "State/Province" : "州/省"}
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                className="border border-gray-300 rounded px-2 py-2 text-lg"
                                                value={newAddress.state}
                                                onChange={(e) => handleNewAddressOnChange(e, "state")}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 relative z-10 mt-3 mb-2 sm:mt-5">
                                        <div className="basis-1/2 flex flex-col">
                                            <label htmlFor="country" className="text-lg">
                                                {isEnglish ? "Country" : "國家"}
                                            </label>
                                            <input
                                                type="text"
                                                id="country"
                                                className="border border-gray-300 rounded px-2 py-2 text-lg"
                                                value={newAddress.country}
                                                onChange={(e) => handleNewAddressOnChange(e, "country")}
                                            />
                                        </div>

                                        <div className="basis-1/2 flex flex-col">
                                            <label htmlFor="postalCode" className="text-lg">
                                                {isEnglish ? "Postal Code" : "郵遞區號"}
                                            </label>
                                            <input
                                                type="text"
                                                id="postalCode"
                                                className="border border-gray-300 rounded px-2 py-2 text-lg"
                                                value={newAddress.postalCode}
                                                onChange={(e) => handleNewAddressOnChange(e, "postalCode")}
                                            />
                                        </div>
                                    </div>
                                </div>}

                            <div className="mt-3">
                                <DropDownList addressList={addressList} handleAddressToEdit={handleAddressToEdit} removeAddress={removeAddress} isEnglish={isEnglish} />
                            </div>
                        </div>

                        <div
                            className="flex w-full bg-buttonMain justify-center text-white py-2 rounded text-xl hover:bg-gray-800 cursor-pointer mt-6"
                            onClick={handleOnSave}
                        >
                            {isEnglish ? "Save" : "儲存更改"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <EntireFooter />
            </div>

            <div className="relative z-30">
                <WindowScrollToTopButton />
                <AIAgentButton />
            </div>
        </div>
    );
}