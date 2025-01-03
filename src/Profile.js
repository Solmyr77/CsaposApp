import React, { useContext, useEffect } from "react";
import userAvatar from "./img/avatar.png";
import TitleDivider from "./TitleDivider";
import Footer from "./Footer";
import Friend from "./Friend";
import Badge from "./Badge";
import img1 from "./img/beeremoji.png";
import Context from "./Context";
import ListItem from "./ListItem";

function Profile() {
  const [navState, setNavState, menuState, setMenuState] = useContext(Context);

  useEffect(() => {
    setMenuState("Profile");
  }, []);
  

  return (
    <div className="min-h-screen w-screen bg-grey flex px-4 text-white font-bold font-play flex-col items-center">
        <h1 className="text-center w-full pt-16 text-2xl mb-2">Lajos</h1>
        <img src={userAvatar} alt="avatar" className="w-28 h-28 rounded-full mb-8"/>
        <TitleDivider title={"Barátok"}/>
        <div className="flex flex-row w-full overflow-x-scroll gap-6 mb-8">
            <Friend image={userAvatar} name={"Feribókozolegésznaptekutya"}/>
            <Friend image={userAvatar} name={"Mekdánelcbekénemenni"}/>
            <Friend image={userAvatar} name={"Bigmeketkéneenni"}/>
            <Friend image={userAvatar} name={"Kéjefcéahhhoooohahahahah"}/>
            <Friend image={userAvatar} name={"Börgerkirály😎"}/>
        </div>
        <TitleDivider title={"Eredmények"}/>
        <div className="flex flex-row w-full overflow-x-scroll gap-6 mb-8">
          <Badge image={img1} title={"Nagy ivó"}/>
        </div>
        <TitleDivider title={"Beállítások"} isNormal={true}/>
        <ListItem title={"Fiókom"}/>
        <ListItem title={"Barát hozzáadása"}/>
        <div className="h-[12vh]"></div>
        <Footer/>
    </div>
  )
}

export default Profile;
