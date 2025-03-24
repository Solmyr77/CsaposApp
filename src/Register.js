import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "./BackButton";
import axios from "axios";
import { LuIdCard, LuAtSign, LuCircleUser, LuKeyRound, LuEyeClosed, LuEye, LuCheck, LuCalendar } from "react-icons/lu";

function Register() {
  const navigate = useNavigate();
  const [legalName, setLegalName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password1Error, setPassword1Error] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);
  const [isPassword1Visible, setIsPassword1Visible] = useState(false);
  const [isPassword2Visible, setIsPassword2Visible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef();
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
    console.log(email);
    try {
      const response = await axios.post("https://backend.csaposapp.hu/api/auth/register",
        {
          username: username,
          email: email,
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
      if (error.response?.status === 400) {
        setErrorMessage("A jelszó minimum hossza 8 karakter, tartalmaznia kell nagybetűt, kisbetűt valamint egy számot!")
        setPassword1("");
        setPassword2("");
        setPassword1Error(true);
        setPassword2Error(true);
      }
      return false;
    }
  }

  function validateForm(event) {
    event.preventDefault();
    if (validateBirthDate() && validateInput() && checkPasswords(password1, password2)) {
      const register = async () => {
        if (await handleRegister()) {
          modalRef.current.inert = true;
          modalRef.current.showModal();
          modalRef.current.inert = false;
          setErrorMessage("");
          setTimeout(() => {
            modalRef.current.close();
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
      setPassword1Error(true);
      setPassword2Error(true);
    }
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 py-8 flex flex-col">
      <Link to={"/login"} className="flex w-fit">
        <BackButton/>
      </Link>
      <div className="flex items-center flex-grow flex-col">
        <h1 className="font-bold text-3xl">Regisztráció</h1>
        <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateForm(event)}>
          <label className="text-left w-full">Teljes név</label>
          <div className="relative mt-0.5 mb-4">
            <input type="text" name="fullname" value={legalName} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none shadow-[0px_2px_2px_rgba(0,0,0,.5)]" required onChange={(event) => {
              setLegalName(event.target.value);
              setErrorMessage("");
            }}/>
            <LuIdCard className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Születési idő</label>
          <input id="date" name="birthdate" value={birthDate} type="date" className="bg-dark-grey px-5 rounded-md py-2 text-white mt-0.5 mb-4 w-full focus:outline-none shadow-[0px_2px_2px_rgba(0,0,0,.5)]" max={date.getFullYear()} required onChange={(event) => {
              setBirthDate(event.target.value);
              setErrorMessage("");
          }}/>
          <label className="text-left w-full">Email cím</label>
          <div className="relative mt-0.5 mb-4">
            <input type="email" value={email} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none shadow-[0px_2px_2px_rgba(0,0,0,.5)]" required onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage("");
            }}/>
            <LuAtSign className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Felhasználónév</label>
          <div className="relative mt-0.5 mb-4">
            <input type="text" name="username" value={username} className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none shadow-[0px_2px_2px_rgba(0,0,0,.5)]" required onChange={(event) => {
              setUsername(event.target.value);
              setErrorMessage("");
            }}/>
            <LuCircleUser className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className={`text-left w-full ${password1Error ? "text-red-500" : "text-white"}`}>Jelszó</label>
          <div className="relative mt-0.5 mb-4">
            <input type={`${isPassword1Visible ? "text" : "password"}`} id="password1" name="password1" value={password1} className={`w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none shadow-[0px_2px_2px_rgba(0,0,0,.5)] ${password1Error ? "border-red-500 border-2" : "border-0"}`} required onChange={(event) => {
              setPassword1(event.target.value);
              if (event.target.value === "") setIsPassword1Visible(false);
              setErrorMessage("");
              setPassword1Error(false);
            }}/>
            {
              password1 === "" ? 
              <LuKeyRound className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
              <div>
                <LuEye className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword1Visible ? "invisible" : "visible"} hover:cursor-pointer`} onClick={() => setIsPassword1Visible(true)}/>
                <LuEyeClosed className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword1Visible ? "visible" : "invisible"} hover:cursor-pointer`} onClick={() =>setIsPassword1Visible(false)}/>
              </div>
            }
          </div>
          <label className={`text-left w-full ${password2Error ? "text-red-500" : "text-white"}`}>Jelszó újra</label>
          <div className="relative mt-0.5 mb-4">
            <input type={`${isPassword2Visible ? "text" : "password"}`} name="password2" value={password2} className={`w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none shadow-[0px_2px_2px_rgba(0,0,0,.5)] ${password2Error ? "border-red-500 border-2" : "border-0"}`} required onChange={(event) => {
              setPassword2(event.target.value);
              if (event.target.value === "") setIsPassword2Visible(false);
              setErrorMessage("");
              setPassword2Error(false);
            }}/>
            {
              password2 === "" ? 
              <LuKeyRound className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/> :
              <div>
                <LuEye className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword2Visible ? "invisible" : "visible"} hover:cursor-pointer`} onClick={() => setIsPassword2Visible(true)}/>
                <LuEyeClosed className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPassword2Visible ? "visible" : "invisible"} hover:cursor-pointer`} onClick={() =>setIsPassword2Visible(false)}/>
              </div>
            }
          </div>
          <p id="errorText" className="text-center text-red-500 invisible text-wrap max-w-44" style={{"visibility" : `${errorMessage !== "" ? "visible" : "hidden"}`}}>{errorMessage}</p>
        <button type="submit" className="btn hover:bg-blue border-0 bg-gradient-to-t from-blue to-sky-400 text-white text-lg mt-4 shadow-[0px_2px_2px_rgba(0,0,0,.5)] h-16 w-48">Regisztráció</button>
        </form>
      </div>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box flex flex-col items-center bg-grey">
          <p className="bg-gradient-to-t from-blue to-sky-400 text-transparent bg-clip-text text-lg font-bold">Sikeres regisztráció!</p>
          <LuCheck className="fill-none stroke-[url(#gradient)] h-12 w-12"/>
        </div>
      </dialog>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default Register;
