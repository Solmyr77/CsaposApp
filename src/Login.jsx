import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "./Context";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated, setUserId, decodeJWT } = useContext(Context);

  async function handleLogin(username, password) {
    try {
      const response = await axios.post("https://backend.csaposapp.hu/api/auth/login", { username: username, password: password });
      if (response.status === 200) {
        const data = response.data;

        if (decodeJWT(data.accessToken).role !== "manager") {
          setErrorMessage("Hibás felhasználónév vagy jelszó!");
          throw new Error();
        }

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
    
    if (username.trim() !== "" && password.trim() !== "") {
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
    <div className="min-h-screen w-full px-4 pt-24 flex flex-col items-center">

      <h1 className="font-bold text-6xl tracking-widest">Csapos</h1>

      <form className="flex flex-col mt-8 justify-evenly items-center" onSubmit={(event) => validateLogin(event)}>

        <label className="text-left w-full">Felhasználónév</label>
        <div className="relative mt-0.5 mb-4">
          <input name="username" type="text" value={username} className="w-full text-black rounded border shadow pl-5 pr-10 py-2 font-normal focus:outline-hidden" required onChange={(event) => {
            setErrorMessage("");
            setUsername(event.target.value);
          }} />
        </div>

        <label className="text-left w-full">Jelszó</label>
        <div className="relative mt-0.5 mb-4">
          <input name="password" type={`${isPasswordVisible ? "text" : "password"}`} value={password} className="w-full text-black rounded border shadow pl-5 pr-10 py-2 font-normal focus:outline-hidden" required onChange={(event) => {
            setErrorMessage("");
            password === "" && setIsPasswordVisible(false);
            setPassword(event.target.value);
          }} />
        </div>

        <p id="errorText" className={`text-center text-red-500 text-wrap max-w-40 ${errorMessage !== "" ? "visible" : "invisible"}`}>{errorMessage}</p>

        <button type="submit" className="btn btn-info border-0 text-black text-lg h-16 w-44 mt-4 disabled:!bg-info disabled:opacity-50" disabled={errorMessage}>Bejelentkezés</button>
      </form>
    </div>
  );
}

export default Login;