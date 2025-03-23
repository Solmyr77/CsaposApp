import React, { forwardRef, useContext, useState } from "react";
import axios from "axios";
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import getAccessToken from "./refreshToken";
import { LuX, LuKeyRound, LuEyeClosed, LuEye } from "react-icons/lu";

const PasswordModal = forwardRef((props, ref) =>  {
  const { logout } = useContext(Context);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isPassword1Visible, setIsPassword1Visible] = useState(false);
  const [isPassword2Visible, setIsPassword2Visible] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [password1Error, setPassword1Error] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);

  async function updatePassword() {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
        }
      }
      const data = {
        currentPassword : currentPassword,
        newPassword : password1
      }
      const response = await axios.put("https://backend.csaposapp.hu/api/auth/update-password", data, config);
      if (response.status === 200) {
        return true;
      }
      return false;
    }
    catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("Az új jelszó minimum hossza 8 karakter, tartalmaznia kell nagybetűt, kisbetűt valamint egy számot!");
        setPassword1("");
        setPassword2("");
        setPassword1Error(true);
        setPassword2Error(true);
      }
      if (error.response?.status === 401 && !error.response?.data) {
        if (await getAccessToken()) {
          await updatePassword();
        }
        else {
          await logout();
          navigate("/");
        }
      }
      else if (error.response?.status === 401) {
        setErrorMessage("Hibásan megadott jelenlegi jelszó!");
        setCurrentPassword("");
        setCurrentPasswordError(true);
      }
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
              ref.current.close();
            }, 1000)
          }
        }
        submit();
      }
      else if (password1.trim() !== password2.trim()) {
        setErrorMessage("A megadott jelszavak nem egyeznek!");
        setPassword1Error(true);
        setPassword2Error(true);
        setPassword1("");
        setPassword2("");
      }
    }
    else {
      setErrorMessage("Kötelező megadnod jelszavat!");
      setCurrentPassword("");
      setPassword1("");
      setPassword2("");
      setPassword1Error(true);
      setPassword2Error(true);
      setCurrentPasswordError(true);
    }
  }

  function resetForm() {
    setCurrentPassword("");
    setPassword1("");
    setPassword2("");
    setCurrentPasswordError(false);
    setPassword1Error(false);
    setPassword2Error(false);
  }

  return (
    <dialog className="modal" ref={ref}>
      <div className={`w-80 min-h-80 max-h-[28rem] bg-grey rounded-xl flex flex-col justify-between sticky py-2 px-4 modal-box`}>
        <LuX className="absolute left-0 top-0 w-9 h-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={(event) => {
          ref.current.close();
          if (!isSucceeded) {
            resetForm();
          }
        }}/>
        {
        !isSucceeded ?  
          <form id="passwordform" className="flex flex-col h-full justify-between gap-y-3 items-center px-2 select-none" onSubmit={(event) => handleSubmit(event)}>
              <p className="text-md text-center mb-6 select-none">Jelszó módosítása</p>
              <div className="w-full">
                  <label className={`text-left min-w-full font-normal ${currentPasswordError && "text-red-500"}`}>Jelenlegi jelszó</label>
                  <div className="relative">
                    <input id="currentpassword" name="currentpassword" type={`${ isCurrentPasswordVisible ? "text" : "password"}`}  value={currentPassword} className={`w-full bg-dark-grey drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] pl-5 pr-9 py-2 rounded-md font-normal mt-0.5 focus:outline-none ${ currentPasswordError && "border-2 border-red-500"}`} onChange={(event) => {
                      setErrorMessage("");
                      setCurrentPasswordError(false);
                      setCurrentPassword(event.target.value);
                    }} required/>
                    {
                      currentPassword === "" ?
                      <LuKeyRound className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
                      <div>
                        <LuEye className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isCurrentPasswordVisible ? "invisible" : "visible"} hover:cursor-pointer`} onClick={() => setIsCurrentPasswordVisible(true)}/>
                        <LuEyeClosed className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isCurrentPasswordVisible ? "visible" : "invisible"} hover:cursor-pointer`} onClick={() =>setIsCurrentPasswordVisible(false)}/>
                      </div>
                    }
                  </div>
              </div>
              <div className="w-full">
                  <label className={`text-left min-w-full font-normal ${password1Error && "text-red-500"}`}>Új jelszó</label>
                  <div className="relative">
                    <input type={`${ isPassword1Visible ? "text" : "password"}`} value={password1} className={`w-full bg-dark-grey drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] pl-5 pr-9 py-2 rounded-md font-normal mt-0.5 focus:outline-none ${ password1Error && "border-2 border-red-500"}`} onChange={(event) => {
                      setErrorMessage("");
                      setPassword1(event.target.value);
                      setPassword1Error(false);
                    }} required/>
                    {
                      password1 === "" ?
                      <LuKeyRound className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
                      <div>
                        <LuEye className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword1Visible ? "invisible" : "visible"} hover:cursor-pointer`} onClick={() => setIsPassword1Visible(true)}/>
                        <LuEyeClosed className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword1Visible ? "visible" : "invisible"} hover:cursor-pointer`} onClick={() =>setIsPassword1Visible(false)}/>
                      </div>
                    }
                  </div>
              </div>
              <div className="w-full">
                  <label className={`text-left min-w-full font-normal ${password2Error && "text-red-500"}`}>Új jelszó újra</label>
                  <div className="relative">
                    <input type={`${ isPassword2Visible ? "text" : "password"}`} value={password2} className={`w-full bg-dark-grey drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] pl-5 pr-9 py-2 rounded-md font-normal mt-0.5 focus:outline-none ${ password2Error && "border-2 border-red-500"}`} onChange={(event) => {
                      setErrorMessage("");
                      setPassword2(event.target.value);
                      setPassword2Error(false);
                    }} required/>
                    {
                      password2 === "" ?
                      <LuKeyRound className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
                      <div>
                        <LuEye className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword2Visible ? "invisible" : "visible"} hover:cursor-pointer`} onClick={() => setIsPassword2Visible(true)}/>
                        <LuEyeClosed className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword2Visible ? "visible" : "invisible"} hover:cursor-pointer`} onClick={() =>setIsPassword2Visible(false)}/>
                      </div>
                    }
                  </div>
              </div>
              <div className="flex flex-col items-center">
                <p className={`text-red-500 text-center font-normal ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
                <button type="submit" className="btn bg-dark-grey rounded-md text-blue drop-shadow-[0px_2px_2px_rgba(0,0,0,.5)] text-sm hover:bg-dark-grey border-0 disabled:bg-dark-grey disabled:opacity-50 disabled:text-blue" disabled={!(currentPassword && password1 && password2)}><span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">Mentés</span></button>
              </div>
          </form> : 
          <div className="flex flex-grow w-full justify-center items-center">
            <p className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">Sikeres módosítás!</p>
          </div>
        }
      </div>
      <form method="dialog" className="modal-backdrop"><button onClick={() => resetForm()}></button></form>
    </dialog>
  );
})

export default PasswordModal;
