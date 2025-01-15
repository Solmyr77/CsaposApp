import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import { UserCircleIcon, EyeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated } = useContext(Context);

  async function handleLogin(username, password) {
    try {
      const response = await fetch("https://backend.csaposapp.hu/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      if (response.ok) {
        const data =  await response.json();
        localStorage.setItem("token", JSON.stringify(data));
        return true;
      }
      else {
        setErrorMessage("Hibás felhasználónév vagy jelszó!");
        return false;
      }
    } 
    catch {
      setErrorMessage("Hálózati hiba!");
      return false;
    }
  }
  
  async function validateLogin(event) {
    event.preventDefault();
    const username = event.target.username;
    const password = event.target.password;
    if (await handleLogin(username.value, password.value)) {
      setIsAuthenticated(true);
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 pt-24 flex items-center flex-col">
        <h1 className="font-bold text-3xl">Bejelentkezés</h1>
        <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateLogin(event)}>
            <label className="text-left w-full">Felhasználónév</label>
            <div className="relative mt-0.5 mb-4">
              <input name="username" type="text" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={() => setErrorMessage("")}/>
              <UserCircleIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
            </div>
            <label className="text-left w-full">Jelszó</label>
            <div className="relative mt-0.5 mb-4">
              <input name="password" type="password" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={() => setErrorMessage("")}/>
              <LockClosedIcon className="w-6 absolute top-1/2 right-2 -translate-y-1/2"/>
            </div>
            <p id="errorText" className={`text-center text-red-500 text-wrap max-w-40 ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
            <button type="submit" className="w-full h-16 bg-blue rounded font-bold text-lg mt-4">Bejelentkezés</button>
        </form>
        <p className="mt-8">Még nincs fiókod?</p>
        <Link to="/register"><button className="w-full bg-dark-grey text-blue py-2 px-4 rounded-md mt-1">Regisztráció</button></Link>
    </div>
  );
}

export default Login;
