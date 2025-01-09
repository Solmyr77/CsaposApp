import React, { useContext, useState, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Context from "./Context";

function ModifyModal({ title, isModalVisible, setIsModalVisible }) {
  const { user, setUser } = useContext(Context);
  const [newUsername, setNewUsername] = useState(user.name);
  const [profilePicture, setProfilePicture] = useState(user.picture);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    if (isModalVisible) {
      document.getElementById("username").value = user.name;
      setNewUsername(user.name);
    }
  }, [isModalVisible])
  

  function triggerFileInputClick() {
    document.getElementById("fileInput").click();
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfilePicture(reader.result);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (event.target.username.value.trim() !== "") {
      setUser({name: newUsername, picture: profilePicture});
      localStorage.setItem("user", JSON.stringify({name: newUsername, picture: profilePicture}));
      setIsModalVisible(false);
    }
    else {
      setErrorMessage("Kötelező megadnod felhasználónevet!")
      event.target.username.value = "";
      setNewUsername(event.target.username.value);
    }
  }

  return (
    <div className={`w-screen min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isModalVisible ? "visible" : "invisible"} flex justify-center items-center` }>
      <div className={`w-[80vw] ${errorMessage !== "" ? "h-min" : "h-[80vw]"} aspect-square bg-grey rounded-xl flex flex-col justify-between relative`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md" onClick={() => setIsModalVisible(false)}/>
        <p className="text-md pt-4 text-center mb-6">{title}</p>
        <form className="flex flex-col justify-between h-full items-center px-2" onSubmit={(event) => handleSubmit(event)}>
          <div className="relative" onClick={triggerFileInputClick}>
            <img src={profilePicture} className="rounded-full object-cover aspect-square w-24 opacity-50"/>
            <PencilSquareIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12"/>
            <input id="fileInput" type="file" style={{"display" : "none"}} onChange={(event) => handleImageUpload(event)}/>
          </div>
          <div className="flex flex-col items-center w-full">
            <label className="text-left w-full font-normal">Felhasználónév</label>
            <input defaultValue={user.name} id="username" name="username" type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
              setNewUsername(event.target.value.trim());
              setErrorMessage("");
              }} required/>
            <p className={`text-red-500 text-center font-normal ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
            <input type="submit" value="Mentés" className="bg-dark-grey w-fit py-2 px-3 my-2 rounded-md text-blue drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)]"/>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifyModal;
