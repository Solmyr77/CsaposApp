import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

function PasswordModal( { isPasswordModalVisible, setIsPasswordModalVisible } ) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (password1.trim() !== "" && password2.trim() !== "") {
      if (password1 === password2) {
        event.target.reset();
        setIsSucceeded(true);
        setTimeout(() => {
          setIsSucceeded(false);
          setIsPasswordModalVisible(false);
        }, 1000)
      }
      else {
        setErrorMessage("A megadott jelszavak nem egyeznek!");
        setPassword1("");
        setPassword2("");
        event.target.reset();
      }
    }
    else {
      setErrorMessage("Kötelező megadnod jelszavat!");
      setPassword1("");
      setPassword2("");
      event.target.reset();
    }
  }

  return (
    <div className={`w-full min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isPasswordModalVisible ? "flex" : "hidden"} justify-center items-center` }>
      <div className={`w-80 h-80 aspect-square bg-grey rounded-xl flex flex-col justify-between relative`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={(event) => {
          setIsPasswordModalVisible(false);
          if (!isSucceeded) {
            document.getElementById("newpassword1").value = "";
            document.getElementById("newpassword2").value = "";
          }
        }}/>
        {
        isSucceeded === false ?  
        <div>
          <p className="text-md pt-4 text-center mb-6">Jelszó módosítása</p>
          <form className="flex flex-col h-full justify-between items-center px-2" onSubmit={(event) => handleSubmit(event)}>
              <div className="w-full">
                  <label className="text-left min-w-full font-normal">Új jelszó</label>
                  <input id="newpassword1" name="newpassword1" type="password" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                    setErrorMessage("");
                    setPassword1(event.target.value);
                  }} required/>
              </div>
              <div className="w-full">
                  <label className="text-left w-full font-normal">Új jelszó újra</label>
                  <input id="newpassword2" name="newpassword2" type="password" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal mt-0.5 focus:outline-none" onChange={(event) => {
                    setErrorMessage("");
                    setPassword2(event.target.value);
                  }} required/>
              </div>
              <p className={`text-red-500 text-center font-normal ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
              <input type="submit" value="Mentés" className="bg-dark-grey w-fit py-2 px-3 my-2 rounded-md text-blue drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"/>
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
