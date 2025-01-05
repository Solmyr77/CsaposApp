import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen w-full bg-grey text-white px-4 pt-16 flex items-center flex-col">
        <h1 className="font-bold text-3xl">Bejelentkezés</h1>
        <form className="flex flex-col mt-8 justify-evenly items-center">
            <label className="text-left w-full">Felhasználónév</label>
            <input type="text" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
            <label className="text-left w-full">Jelszó</label>
            <input type="password" className="w-full bg-dark-grey px-5 py-2 rounded-md font-normal focus:outline-none mt-0.5 mb-4" required/>
            <button type="submit" className="w-full h-16 bg-blue rounded font-bold text-lg mt-4">Bejelentkezés</button>
        </form>
        <p className="mt-8">Még nincs fiókod?</p>
        <Link to={"/register"} className=""><button className="w-full bg-dark-grey text-blue py-1 px-2 rounded-md mt-1">Regisztráció</button></Link>
    </div>
  );
}

export default Login;
