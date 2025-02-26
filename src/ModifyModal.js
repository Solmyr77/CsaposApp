import React, { useContext, useState, useEffect, useRef, forwardRef } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { useNavigate } from "react-router-dom";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";

const ModifyModal = forwardRef((props, ref) => {
  const { user, setUser, getProfile, logout } = useContext(Context);
  const [newProfileName, setNewProfileName] = useState(user.displayName);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(user.imageUrl);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [formData, setFormData] = useState(new FormData());
  const [isConversionFinished, setIsConversionFinished] = useState(null);
  const imageInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.imageUrl) setPreviewProfilePicture(user.imageUrl);
  }, [user.imageUrl]);

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
    let file = await event.target.files[0];
    const updatedFormData = new FormData();
    if (file) {
      setIsConversionFinished(false);
      if (file.type === "image/heic") {
        const blob = await heic2any({ blob: file, toType: "image/jpeg" });
        file = new File([blob], file.name.replace(".heic", ".jpg"), {
          type: "image/jpeg",
        })
      }
      const options = {
        maxSizeMB: 4,
        useWebWorker: true,
      }
      file = await imageCompression(file, options);
      updatedFormData.append("file", file); 
      if (isImageSizeValid(file)) {
        const fileURL = URL.createObjectURL(file);
        setPreviewProfilePicture(fileURL);
        setFormData(updatedFormData);
        setIsConversionFinished(true);
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
      if (response.status === 200) setIsSucceeded(true);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) await handleImageUpload();
        else {
          await logout();
          navigate("/");
        }
        console.log(error.message);
      }
    }
  }

  async function handleDisplayNameUpdate() {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Control": "no-cache"
        }
      }
      const response = await axios.put("https://backend.csaposapp.hu/api/Users/update-display-name", {displayName: newProfileName}, config);
      if (response.status === 200) setIsSucceeded(true);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) await handleDisplayNameUpdate();
        else {
          await logout();
          navigate("/");
        }
        console.log(error.message);
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const profileName = event.target.profilename;
    if (profileName.value.trim() !== "") {
      if (newProfileName !== user.displayName && previewProfilePicture !== user.imageUrl) {
        await handleDisplayNameUpdate();
        await handleImageUpload();
      }
      else if (newProfileName !== user.displayName) await handleDisplayNameUpdate();
      else if (previewProfilePicture !== user.imageUrl) await handleImageUpload();
      setUser({...user, displayName: newProfileName});
      setTimeout(async() => {
        setIsSucceeded(false);
        ref.current.close();
        await getProfile(user.id, "user");
      }, 1000);
    }
    else {
      setErrorMessage("Kötelező megadnod felhasználónevet!")
      profileName.value = "";
      setNewProfileName(profileName.value);
    }
  }

  return (
      <dialog className="modal" ref={ref}>
        <div className={`modal-box max-w-80 max-h-80 aspect-square bg-grey rounded-xl flex flex-col justify-between sticky py-2 px-4`}>
          <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => {
            document.getElementById("profilename").value = user.displayName;
            setNewProfileName(user.displayName);
            setPreviewProfilePicture(user.imageUrl);
            setErrorMessage("");
            setIsConversionFinished(null);
            setFormData(new FormData());
            imageInput.current.value = "";
            ref.current.close();
          }}/>
          {
            isSucceeded === false ?
            <div className="h-full flex flex-col">
              <p className="text-md text-center mb-6">Profil szerkesztése</p>
              <form className="flex flex-col justify-between h-full items-center" onSubmit={(event) => handleSubmit(event)}>
              {
                isConversionFinished === false ?
                <span className="loading loading-spinner text-blue w-20"></span> :
                <div className="relative select-none hover:cursor-pointer" onClick={triggerFileInputClick}>
                  <img src={previewProfilePicture} className="rounded-full object-cover aspect-square w-24 opacity-50"/>
                  <PencilSquareIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12"/>
                  <input ref={imageInput} id="fileInput" type="file" style={{"display" : "none"}} onChange={(event) => showImagePreview(event)}/>
                </div>
              }
                <div className="flex flex-col flex-grow h-full justify-between items-center w-full mt-4">
                  <div>
                    <label className="text-left w-full font-normal">Profilnév</label>
                    <input defaultValue={user.displayName} id="profilename" name="profilename" type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)]" onChange={(event) => {
                      setNewProfileName(event.target.value.trim());
                      setErrorMessage("");
                      }} required/>
                  </div>
                  <p className={`text-red-500 text-center font-normal ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
                  <input type="submit" value="Mentés" className="btn bg-dark-grey text-blue border-0 shadow-[0px_2px_2px_rgba(0,0,0,.5)] hover:bg-dark-grey disabled:opacity-50 disabled:bg-dark-grey disabled:text-blue" disabled={!(user.displayName !== newProfileName || previewProfilePicture !== user.imageUrl)}/>
                </div>
              </form>
            </div> :
            <div className="flex h-full w-full justify-center items-center">
              {errorMessage === "" ? <p className="text-green-500">Sikeres módosítás</p> : <p className="text-red-500">{errorMessage}</p>}
            </div>
          }
        </div>
        <form method="dialog" className="modal-backdrop"><button></button></form>
      </dialog>
  );
})

export default ModifyModal;
