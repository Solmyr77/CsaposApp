import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "./BackButton";

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

  function validateForm(event) {
    if (validateBirthDate() && validateInput()) {
      setErrorMessage("");
      navigate("/");
    }
    else if (!validateBirthDate()) {
      setErrorMessage("Legalább 18 évesnek kell lenned a regisztrációhoz!");
    }
    else if(!validateInput()) {
      setErrorMessage("Minden mező kitöltése kötelező!");
    }
    event.preventDefault();
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 pt-8 pb-8">
      <Link to={"/login"}><BackButton/></Link>
      <div className="flex items-center flex-col">
        <h1 className="font-bold text-3xl">Regisztráció</h1>
        <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateForm(event)}>
          <label className="text-left w-full">Teljes név</label>
          <input  type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
          <label className="text-left w-full">Születési idő</label>
          <input id="date" type="date" className="bg-dark-grey px-5 rounded-md py-2 text-white mt-0.5 mb-4 w-full focus:outline-none" max={date.getFullYear()} required/>
          <label className="text-left w-full">Email cím</label>
          <input type="email" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
          <label className="text-left w-full">Felhasználónév</label>
          <input type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
          <label className="text-left w-full">Jelszó</label>
          <input type="password" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
          <label className="text-left w-full">Jelszó újra</label>
          <input type="password" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
          <p id="errorText" className="text-center text-red-500 invisible text-wrap max-w-56" style={{"visibility" : `${errorMessage !== "" ? "visible" : "hidden"}`}}>{errorMessage}</p>
          <button type="submit" className="w-full h-16 bg-blue rounded font-bold text-lg mt-4">Regisztráció</button>
        </form>
      </div>
    </div>
  )
}

export default Register;
