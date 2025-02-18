import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";

function PasswordModal( { isPasswordModalVisible, setIsPasswordModalVisible } ) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);

  async function updatePassword() {
    try {
      const data = {
        currentPassword : currentPassword,
        newPassword : password1
      }
      const response = await axios.put("https://backend.csaposapp.hu/api/auth/update-password", data);
      if (response.status === 200) {
        return true;
      }
      return false;
    }
    catch (error) {
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (currentPassword.trim() !== "" && password1.trim() !== "" && password2.trim() !== "") {
      if (password1 === password2) {
        const submit = async() => {
          if (await updatePassword() === true) {
            setCurrentPassword("");
            setPassword1("");
            setPassword2("");
            setIsSucceeded(true);
            setTimeout(() => {
              setIsSucceeded(false);
              setIsPasswordModalVisible(false);
            }, 1000)
          }
          else {
            setErrorMessage("Hiba!");
          }
        }
        submit();
      }
      else if (password1.trim() !== password2.trim()) {
        setErrorMessage("A megadott jelszavak nem egyeznek!");
        setPassword1("");
        setPassword2("");
      }
      else {
        setErrorMessage("Hibásan megadott jelenlegi jelszó!");
        setCurrentPassword("");
      }
    }
    else {
      setErrorMessage("Kötelező megadnod jelszavat!");
      setCurrentPassword("");
      setPassword1("");
      setPassword2("");
    }
  }

  return (
    <div className={`w-full min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isPasswordModalVisible ? "flex" : "hidden"} justify-center items-center` }>
      <div className={`w-80 min-h-80 h-96 bg-grey rounded-xl flex flex-col justify-between sticky top-1/2 -translate-y-1/2`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={(event) => {
          setIsPasswordModalVisible(false);
          if (!isSucceeded) {
            setCurrentPassword("");
            setPassword1("");
            setPassword2("");
          }
        }}/>
        {
        isSucceeded === false ?  
        <div>
          <form id="passwordform" className="flex flex-col h-96 justify-between gap-y-2 items-center px-2" onSubmit={(event) => handleSubmit(event)}>
              <p className="text-md pt-4 text-center mb-6">Jelszó módosítása</p>
              <div className="w-full">
                  <label className="text-left min-w-full font-normal">Jelenlegi jelszó</label>
                  <input id="currentpassword" name="currentpassword" type="password" value={currentPassword} className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                    setErrorMessage("");
                    setCurrentPassword(event.target.value);
                  }} required/>
              </div>
              <div className="w-full">
                  <label className="text-left min-w-full font-normal">Új jelszó</label>
                  <input type="password" value={password1} className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                    setErrorMessage("");
                    setPassword1(event.target.value);
                  }} required/>
              </div>
              <div className="w-full">
                  <label className="text-left w-full font-normal">Új jelszó újra</label>
                  <input type="password" value={password2} className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                    setErrorMessage("");
                    setPassword2(event.target.value);
                  }} required/>
              </div>
              <div className="flex flex-col items-center">
                <p className={`text-red-500 text-center font-normal ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
                <input type="submit" value="Mentés" className="bg-dark-grey w-fit py-2 px-3 my-2 rounded-md text-blue drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"/>
              </div>
          </form>
        </div> : 
        <div className="flex h-full w-full justify-center items-center">
          <p className="text-green-500">Sikeres módosítás!</p>
        </div>
        }
      </div>
    </div>
  );
}

export default PasswordModal;
