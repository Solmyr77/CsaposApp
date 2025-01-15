import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "./BackButton";
import { AtSymbolIcon } from "@heroicons/react/20/solid";
import { UserIcon, PencilIcon, EyeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const date = new Date();
  
  function validateBirthDate() {
    const birthDateValue = document.getElementById("date").value;
    if (date.getFullYear() - 18 > Number(birthDateValue.slice(0, 4))) {
      return true;
    }
    else if (date.getFullYear() - 18 === Number(birthDateValue.slice(0, 4)) && date.getMonth() + 1 >= Number(birthDateValue.slice(5, 7)) && date.getDate() >= Number(birthDateValue.slice(8, 10))) {
      return true;
    }
    return false;
  }

  function validateInput() {
    let flag = true;
    document.querySelectorAll("input[type='text']").forEach(input => { if(input.value.trim() === "") flag = false; })
    return flag;
  }

  function checkPasswords(password1, pasword2) {
    if (password1 === pasword2) return true;
    return false;
  }

  async function handleRegister(username, password, legalName, birthDate) {
    const response = await fetch("https://backend.csaposapp.hu/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        legalName: legalName,
        birthDate: birthDate
      })
    });

    response.ok && console.log("FASZA");
  }

  function validateForm(event) {
    event.preventDefault();
    const password1 = event.target.password1;
    const password2 = event.target.password2;
    if (validateBirthDate() && validateInput() && checkPasswords(password1.value, password2.value)) {
      setErrorMessage("");
      handleRegister(event.target.username.value, event.target.password1.value, event.target.fullname.value, event.target.birthdate.value);
      event.target.reset();
      navigate("/login");
    }
    else if (!validateBirthDate()) {
      setErrorMessage("Legalább 18 évesnek kell lenned a regisztrációhoz!");
    }
    else if(!validateInput()) {
      setErrorMessage("Minden mező kitöltése kötelező!");
    }
    else if(!checkPasswords(password1.value, password2.value)) {
      setErrorMessage("A megadott jelszavak nem egyeznek!");
      password1.value = "";
      password2.value = "";
    }
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 pt-8 pb-8">
      <Link to={"/login"}><BackButton/></Link>
      <div className="flex items-center flex-col">
        <h1 className="font-bold text-3xl">Regisztráció</h1>
        <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateForm(event)}>
          <label className="text-left w-full">Teljes név</label>
          <div className="relative mt-0.5 mb-4">
            <input type="text" name="fullname" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required/>
            <PencilIcon className="w-5 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Születési idő</label>
          <input id="date" name="birthdate" type="date" className="bg-dark-grey px-5 rounded-md py-2 text-white mt-0.5 mb-4 w-full focus:outline-none" max={date.getFullYear()} required/>
          <label className="text-left w-full">Email cím</label>
          <div className="relative mt-0.5 mb-4">
            <input type="email" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required/>
            <AtSymbolIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Felhasználónév</label>
          <div className="relative mt-0.5 mb-4">
            <input type="text" name="username" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required/>
            <UserIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Jelszó</label>
          <div className="relative mt-0.5 mb-4">
            <input type="password" id="password1" name="password1" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={() => setErrorMessage("")}/>
            <LockClosedIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Jelszó újra</label>
          <div className="relative mt-0.5 mb-4">
            <input type="password" name="password2" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={() => setErrorMessage("")}/>
            <LockClosedIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <p id="errorText" className="text-center text-red-500 invisible text-wrap max-w-44" style={{"visibility" : `${errorMessage !== "" ? "visible" : "hidden"}`}}>{errorMessage}</p>
          <button type="submit" className="w-full h-16 bg-blue rounded font-bold text-lg mt-4">Regisztráció</button>
        </form>
      </div>
    </div>
  )
}

export default Register;
