import React, { useContext, useEffect, useState } from "react";
import TitleDivider from "./TitleDivider";
import Footer from "./Footer";
import Friend from "./Friend";
import Badge from "./Badge";
import img1 from "./img/beeremoji.webp";
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import ModifyModal from "./ModifyModal";

function Profile() {
  const navigate = useNavigate();
  const { setMenuState, setIsAuthenticated, user } = useContext(Context);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setMenuState("Profile");
  }, []);
  
  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <div className="min-h-screen w-screen bg-grey flex px-4 text-white font-bold font play flex-col items-center relative">
        <h1 className="text-center w-full pt-8 text-2xl mb-2">{user.name}</h1>
        <img src={user.picture} alt="avatar" className="w-28 object-cover aspect-square rounded-full mb-8"/>
        <TitleDivider title={"Barátok"}/>
        <div className="flex flex-row w-full overflow-x-scroll gap-6 mb-8">
            <Friend image={user.picture} name={"Feribókozolegésznaptekutya"}/>
            <Friend image={user.picture} name={"Mekdánelcbekénemenni"}/>
            <Friend image={user.picture} name={"Bigmeketkéneenni"}/>
            <Friend image={user.picture} name={"Kéjefcéahhhoooohahahahah"}/>
            <Friend image={user.picture} name={"Börgerkirály😎"}/>
        </div>
        <TitleDivider title={"Eredmények"}/>
        <div className="flex flex-row w-full overflow-x-scroll gap-6 mb-8">
          <Badge image={img1} title={"Nagy ivó"}/>
        </div>
        <TitleDivider title={"Beállítások"} isNormal={true}/>
        <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2" onClick={() => setIsModalVisible(true)}>
          Profil szerkesztése
          <PencilSquareIcon className="h-6"/>
        </div>
        <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2">
          Barát hozzáadása
          <UserPlusIcon className="h-6"/>
        </div>
        <button className="w-1/2 bg-dark-grey text-red-500 py-2 px-4 rounded-md mt-2 drop-shadow-[0_4px_4px_rgba(0,0,0,.5)]" onClick={handleLogout}>Kijelentkezés</button>
        <div className="h-[12vh]"></div>
        <ModifyModal title={"Profil szerkesztése"} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
        <Footer/>
    </div>
  )
}

export default Profile;
