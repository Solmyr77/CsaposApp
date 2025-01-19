import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "./BackButton";
import { AtSymbolIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [legalName, setLegalName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isPassword1Visible, setIsPassword1Visible] = useState(false);
  const [isPassword2Visible, setIsPassword2Visible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSucceeded, setIsSucceeded] = useState(false);
  const date = new Date();
  
  function validateBirthDate() {
    if (date.getFullYear() - 18 > Number(birthDate.slice(0, 4))) {
      return true;
    }
    else if (date.getFullYear() - 18 === Number(birthDate.slice(0, 4)) && date.getMonth() + 1 >= Number(birthDate.slice(5, 7)) && date.getDate() >= Number(birthDate.slice(8, 10))) {
      return true;
    }
    return false;
  }

  function validateInput() {
    let flag = true;
    document.querySelectorAll("input[type='text']").forEach(input => { if(input.value.trim() === "") flag = false; })
    return flag;
  }

  function checkPasswords() {
    if (password1 === password2) return true;
    return false;
  }

  async function handleRegister() {
    try {
      const response = await axios.post("https://backend.csaposapp.hu/api/auth/register",
        {
          username: username,
          password: password1,
          legalName: legalName,
          birthDate: birthDate
        })
      if (response.status === 201) {
        return true;
      } 
    } 
    catch (error) {
      if (error.response?.status === 409)
      {
        setErrorMessage("Ez a felhasználónév már foglalt!");
        setUsername("");
      }
      return false;
    }
  }

  function validateForm(event) {
    event.preventDefault();
    if (validateBirthDate() && validateInput() && checkPasswords(password1, password2)) {
      const register = async() => {
        if (await handleRegister()) {
          setErrorMessage("");
          setIsSucceeded(true);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      }
      register();
    }
    else if (!validateBirthDate()) {
      setErrorMessage("Legalább 18 évesnek kell lenned a regisztrációhoz!");
    }
    else if(!validateInput()) {
      setErrorMessage("Minden mező kitöltése kötelező!");
    }
    else if(!checkPasswords(password1, password2)) {
      setErrorMessage("A megadott jelszavak nem egyeznek!");
      setPassword1("");
      setPassword2("");
    }
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 py-8">
      <Link to={"/login"}><BackButton/></Link>
      <div className="flex items-center flex-col">
        <h1 className="font-bold text-3xl">Regisztráció</h1>
        {
          isSucceeded === false ?
          <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateForm(event)}>
          <label className="text-left w-full">Teljes név</label>
          <div className="relative mt-0.5 mb-4">
            <input type="text" name="fullname" value={legalName} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setLegalName(event.target.value);
              setErrorMessage("");
            }}/>
            <IdentificationIcon className="w-5 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Születési idő</label>
          <input id="date" name="birthdate" value={birthDate} type="date" className="bg-dark-grey px-5 rounded-md py-2 text-white mt-0.5 mb-4 w-full focus:outline-none" max={date.getFullYear()} required onChange={(event) => {
              setBirthDate(event.target.value);
              setErrorMessage("");
            }}/>
          <label className="text-left w-full">Email cím</label>
          <div className="relative mt-0.5 mb-4">
            <input type="email" value={email} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage("");
            }}/>
            <AtSymbolIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Felhasználónév</label>
          <div className="relative mt-0.5 mb-4">
            <input type="text" name="username" value={username} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setUsername(event.target.value);
              setErrorMessage("");
            }}/>
            <UserCircleIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Jelszó</label>
          <div className="relative mt-0.5 mb-4">
            <input type={`${isPassword1Visible ? "text" : "password"}`} id="password1" name="password1" value={password1} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setPassword1(event.target.value);
              if (event.target.value === "") setIsPassword1Visible(false);
              setErrorMessage("");
            }}/>
            {
              password1 === "" ? 
              <LockClosedIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
              <div>
                <EyeIcon className={`w-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword1Visible ? "invisible" : "visible"}`} onClick={() => setIsPassword1Visible(true)}/>
                <EyeSlashIcon className={`w-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword1Visible ? "visible" : "invisible"}`} onClick={() =>setIsPassword1Visible(false)}/>
              </div>
            }
          </div>
          <label className="text-left w-full">Jelszó újra</label>
          <div className="relative mt-0.5 mb-4">
            <input type={`${isPassword2Visible ? "text" : "password"}`} name="password2" value={password2} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setPassword2(event.target.value);
              if (event.target.value === "") setIsPassword2Visible(false);
              setErrorMessage("");
            }}/>
            {
              password2 === "" ? 
              <LockClosedIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
              <div>
                <EyeIcon className={`w-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword2Visible ? "invisible" : "visible"}`} onClick={() => setIsPassword2Visible(true)}/>
                <EyeSlashIcon className={`w-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword2Visible ? "visible" : "invisible"}`} onClick={() =>setIsPassword2Visible(false)}/>
              </div>
            }
          </div>
          <p id="errorText" className="text-center text-red-500 invisible text-wrap max-w-44" style={{"visibility" : `${errorMessage !== "" ? "visible" : "hidden"}`}}>{errorMessage}</p>
          <button type="submit" className="w-full h-16 bg-blue rounded font-bold text-lg mt-4">Regisztráció</button>
        </form> :
        <div>
          <p className="text-green-500 text-xl font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">Sikeres regisztráció!</p>
        </div>
        }
      </div>
    </div>
  )
}

export default Register;
