import React, { useContext, useState, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";

function ModifyModal({ isModifyModalVisible, setIsModifyModalVisible }) {
  const { user, setUser, getProfile } = useContext(Context);
  const [newProfileName, setNewProfileName] = useState(user.displayName);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(user.imageUrl);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    if (isModifyModalVisible) {
      document.getElementById("profilename").value = user.displayName;
      setNewProfileName(user.displayName);
      setPreviewProfilePicture(user.imageUrl);
      setErrorMessage("");
    }
  }, [isModifyModalVisible])

  function triggerFileInputClick() {
    document.getElementById("fileInput").click();
  }

  function isImageSizeValid(file) {
    const LOCAL_STORAGE_LIMIT_BYTES = 4 * 1000 * 1000;
    if (file && file.size <= LOCAL_STORAGE_LIMIT_BYTES) {
      return true;
    }
    return false;
  }

  async function showImagePreview(event) {
    const file = await event.target.files[0];
    const updatedFormData = new FormData();
    updatedFormData.append("file", file);
    if (isImageSizeValid(file)) {
      const fileURL = URL.createObjectURL(file);
      setPreviewProfilePicture(fileURL);
      setFormData(updatedFormData);
    }
    else {
      setIsSucceeded(true);
      setErrorMessage("A kép mérete meghaladja a limitet! (4MB)");
      setTimeout(() => {
        setIsSucceeded(false);
        setErrorMessage("");
      }, 1000)
    }
  }

  async function handleImageUpload() {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Control": "no-cache"
        }
      }
      const response = await axios.post("https://backend.csaposapp.hu/api/Images/upload/profile", formData, config);
    }
    catch (error) {
      if (error.response?.status === 401) {
        getAccessToken();
        handleImageUpload();
        console.log(error.message);
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (event.target.profilename.value.trim() !== "") {
      await handleImageUpload();
      setUser({...user, displayName: newProfileName});
      setIsSucceeded(true);
      setTimeout(async() => {
        setIsSucceeded(false);
        setIsModifyModalVisible(false);
        await getProfile(user.id, "user");
      }, 1000);
    }
    else {
      setErrorMessage("Kötelező megadnod felhasználónevet!")
      event.target.profilename.value = "";
      setNewProfileName(event.target.profilename.value);
    }
  }

  return (
    <div className={`w-full min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isModifyModalVisible ? "flex" : "hidden"} justify-center items-center` }>
      <div className={`w-80 h-80 aspect-square bg-grey rounded-xl flex flex-col justify-between relative`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => setIsModifyModalVisible(false)}/>
        {
          isSucceeded === false ? 
          <div className="h-full">
            <p className="text-md pt-4 text-center mb-6">Profil szerkesztése</p>
            <form className="flex flex-col justify-between h-3/4 items-center px-2" onSubmit={(event) => handleSubmit(event)}>
              <div className="relative select-none hover:cursor-pointer" onClick={triggerFileInputClick}>
                <img src={previewProfilePicture} className="rounded-full object-cover aspect-square w-24 opacity-50"/>
                <PencilSquareIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12"/>
                <input id="fileInput" type="file" style={{"display" : "none"}} onChange={(event) => showImagePreview(event)}/>
              </div>
              <div className="flex flex-col justify-between items-center w-full mt-2">
                <label className="text-left w-full font-normal">Profilnév</label>
                <input defaultValue={user.displayName} id="profilename" name="profilename" type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                  setNewProfileName(event.target.value.trim());
                  setErrorMessage("");
                  }} required/>
                <p className={`text-red-500 text-center font-normal ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
                <input type="submit" value="Mentés" className="bg-dark-grey w-fit py-2 px-3 mt-2 rounded-md text-blue drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"/>
              </div>
            </form>
          </div> : 
          <div className="flex h-full w-full justify-center items-center">
            {errorMessage === "" ? <p className="text-green-500">Sikeres módosítás</p> : <p className="text-red-500">{errorMessage}</p>}
          </div>
        }
      </div>
    </div>
  );
}

export default ModifyModal;
