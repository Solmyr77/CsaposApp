import React from "react";
import userAvatar from "./img/avatar.png";
import TitleDivider from "./TitleDivider";
import Footer from "./Footer";
import Friend from "./Friend";

function Profile() {
  return (
    <div className="min-h-screen w-screen bg-grey flex px-4 text-white font-bold font-play flex-col items-center">
        <h1 className="text-center w-full pt-16 text-2xl mb-2">Lajos</h1>
        <img src={userAvatar} alt="avatar" className="w-28 h-28 rounded-full mb-8"/>
        <TitleDivider title={"Barátok"}/>
        <div className="flex flex-row w-full overflow-x-scroll gap-6">
            <Friend image={userAvatar} name={"Feribókozolegésznaptekutya"}/>
            <Friend image={userAvatar} name={"valami"}/>
            <Friend image={userAvatar} name={"valami"}/>
            <Friend image={userAvatar} name={"valami"}/>
            <Friend image={userAvatar} name={"valami"}/>
        </div>
        <Footer/>
    </div>
  )
}

export default Profile;
