import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "./Context";

function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated } = useContext(Context);

  function handleLogin(event) {
    const username = event.target.username;
    const password = event.target.password;
    if (username.value === "admin" && password.value === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true")
      navigate("/");
    }
    else {
      username.value = "";
      password.value = "";
      setErrorMessage("Hibás felhasználónév vagy jelszó!")
    }
    event.preventDefault();
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 pt-24 flex items-center flex-col">
        <h1 className="font-bold text-3xl">Bejelentkezés</h1>
        <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => handleLogin(event)}>
            <label className="text-left w-full">Felhasználónév</label>
            <input name="username" type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required onChange={() => setErrorMessage("")}/>
            <label className="text-left w-full">Jelszó</label>
            <input name="password" type="password" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required onChange={() => setErrorMessage("")}/>
            <p id="errorText" className={`text-center text-red-500 text-wrap max-w-56 ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
            <button type="submit" className="w-full h-16 bg-blue rounded font-bold text-lg mt-4">Bejelentkezés</button>
        </form>
        <p className="mt-8">Még nincs fiókod?</p>
        <Link to="/register"><button className="w-full bg-dark-grey text-blue py-2 px-4 rounded-md mt-1">Regisztráció</button></Link>
    </div>
  );
}

export default Login;
