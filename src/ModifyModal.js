import React, { useContext, useState, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Context from "./Context";

function ModifyModal({ isModifyModalVisible, setIsModifyModalVisible }) {
  const { user, setUser } = useContext(Context);
  const [newUsername, setNewUsername] = useState(user.name);
  const [profilePicture, setProfilePicture] = useState(user.image);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);
  
  useEffect(() => {
    if (isModifyModalVisible) {
      document.getElementById("username").value = user.name;
      setNewUsername(user.name);
      setErrorMessage("");
    }
  }, [isModifyModalVisible])

  function triggerFileInputClick() {
    document.getElementById("fileInput").click();
  }

  function isImageSizeValid(base64String) {
    const LOCAL_STORAGE_LIMIT_BYTES = 4 * 1000 * 1000;
    const base64Length = base64String.length;
    const padding = (base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0);
    const byteSize = (base64Length * 3) / 4 - padding;

    return byteSize <= LOCAL_STORAGE_LIMIT_BYTES;
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (isImageSizeValid(reader.result)) {
          setProfilePicture(reader.result);
        }
        else {
          setIsSucceeded(true);
          setErrorMessage("A kép mérete meghaladja a limitet! (4MB)");
          setTimeout(() => {
            setIsSucceeded(false);
            setErrorMessage(false);
            setErrorMessage("");
          }, 1000)
        }
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (event.target.username.value.trim() !== "") {
      setUser({name: newUsername, image: profilePicture});
      localStorage.setItem("user", JSON.stringify({name: newUsername, image: profilePicture}));
      setIsSucceeded(true);
      setTimeout(() => {
        setIsSucceeded(false);
        setIsModifyModalVisible(false);
      }, 1000)
    }
    else {
      setErrorMessage("Kötelező megadnod felhasználónevet!")
      event.target.username.value = "";
      setNewUsername(event.target.username.value);
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
                <img src={profilePicture} className="rounded-full object-cover aspect-square w-24 opacity-50"/>
                <PencilSquareIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12"/>
                <input id="fileInput" type="file" style={{"display" : "none"}} onChange={(event) => handleImageUpload(event)}/>
              </div>
              <div className="flex flex-col justify-between items-center w-full mt-2">
                <label className="text-left w-full font-normal">Felhasználónév</label>
                <input defaultValue={user.name} id="username" name="username" type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                  setNewUsername(event.target.value.trim());
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
