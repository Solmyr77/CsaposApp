import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import axios from "axios";
import { LuCircleUser, LuKeyRound, LuEyeClosed, LuEye } from "react-icons/lu";


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated, setUserId } = useContext(Context);

  async function handleLogin(username, password) {
    try {
      const response = await axios.post("https://backend.csaposapp.hu/api/auth/login", { username: username, password: password });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
        return true;
      }
    } 
    catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Hibás felhasználónév vagy jelszó!");
      }
      return false;
    }
  }
  
  async function validateLogin(event) {
    event.preventDefault();
    if (username.trim() !==  "" && password.trim() !==  "") {
      if (await handleLogin(username, password)) {
        setIsAuthenticated(true);
        navigate("/");
      }
    }
    else if (username.trim() === "") {
      setErrorMessage("Kötelező megadnod felhasználónevet!");
    }
    else if (password.trim() === "") {
      setErrorMessage("Kötelező megadnod jelszavat!");
    }
  }

  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 pt-24 flex flex-col items-center">
      <h1 className="font-bold text-3xl">Bejelentkezés</h1>
      <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateLogin(event)}>
          <label className="text-left w-full">Felhasználónév</label>
          <div className="relative mt-0.5 mb-4">
            <input name="username" type="text" value={username} className="w-full shadow-[0px_2px_2px_rgba(0,0,0,.5)] bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setErrorMessage("");
              setUsername(event.target.value);
            }}/>
            <LuCircleUser className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2"/>
          </div>
          <label className="text-left w-full">Jelszó</label>
          <div className="relative mt-0.5 mb-4">
            <input name="password" type={`${isPasswordVisible ? "text" : "password"}`} value={password} className="w-full shadow-[0px_2px_2px_rgba(0,0,0,.5)] bg-dark-grey pl-5 pr-10 py-2 rounded-md font-normal focus:outline-none" required onChange={(event) => {
              setErrorMessage("");
              password === "" && setIsPasswordVisible(false);
              setPassword(event.target.value);
            }}/>
            {
              password === "" ?
              <LuKeyRound className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2`}/>
              :
              <div>
                <LuEye className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPasswordVisible ? "invisible" : "visible"} hover:cursor-pointer`} onClick={() => setIsPasswordVisible(true)}/>
                <LuEyeClosed className={`w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 ${isPasswordVisible ? "visible" : "invisible"} hover:cursor-pointer`} onClick={() =>setIsPasswordVisible(false)}/>
              </div>
            }
          </div>
          <p id="errorText" className={`text-center text-red-500 text-wrap max-w-40 ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>
          <button type="submit" className="btn bg-gradient-to-tr from-blue to-sky-400 hover:bg-blue disabled:bg-blue disabled:text-white disabled:opacity-50 border-0 text-white text-lg h-16 w-44 shadow-[0px_2px_2px_rgba(0,0,0,.5)] mt-2" disabled={errorMessage}>Bejelentkezés</button>
      </form>
      <p className="mt-8 text-gray-300">Még nincs fiókod?</p>
      <Link to="/register"><button className="btn bg-dark-grey text-blue mt-1 border-0 shadow-[0px_2px_2px_rgba(0,0,0,.5)] hover:bg-dark-grey"><span className="bg-gradient-to-t from-blue to-sky-400 bg-clip-text leading-relaxed text-transparent">Regisztráció</span></button></Link>
    </div>
  );
}

export default Login;
