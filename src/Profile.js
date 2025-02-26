import React, { useContext, useEffect, useRef, useState } from "react";
import TitleDivider from "./TitleDivider";
import Footer from "./Footer";
import Friend from "./Friend";
import Badge from "./Badge";
import img1 from "./img/beeremoji.webp";
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, UserPlusIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import ModifyModal from "./ModifyModal";
import AddFriendModal from "./AddFriendModal";
import PasswordModal from "./PasswordModal";
import FriendModal from "./FriendModal";


function Profile() {
  const { setMenuState, user, friends, logout } = useContext(Context);
  const modifyModalRef = useRef();
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [isFriendModalVisible, setIsFriendModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState({});
  const navigate = useNavigate();

  const handleLogout = async() => {
    await logout();
    navigate("/login");
  }

  useEffect(() => {
    setMenuState("Profile");
  }, [user, friends]);
  
  return (
    <div className="min-h-screen h-full w-full max-w-full bg-grey flex px-4 text-white font-bold font play flex-col items-center relative">
      <h1 className="text-center w-full pt-8 text-2xl mb-2">{user.displayName}</h1>
      <img src={user.imageUrl} alt="avatar" className="w-28 object-cover aspect-square rounded-full mb-8"/>
      <TitleDivider title={"Barátok"}/>
      <div className="flex flex-row w-full overflow-x-scroll mb-8">
        { friends.length > 0 ? 
          friends.sort((a, b) => a.displayName.localeCompare(b.displayName)).map(friend =>
            {
              if(friend === friends[friends.length-1]) {
                return (
                  <div className="flex hover:cursor-pointer" onClick={() => {
                    setIsFriendModalVisible(true);
                    setSelectedFriend(friend);
                    }}>
                    <Friend record={friend} isVertical={true}/>
                  </div>
                )
              }
              return (
                <div className="flex items-center hover:cursor-pointer" onClick={()=> {
                  setIsFriendModalVisible(true);
                  setSelectedFriend(friend);
                  }}>
                  <Friend record={friend} isVertical={true}/>
                  <div className="h-4/5 w-[2px] rounded-md bg-dark-grey"></div>
                </div>
              )
            }):
          <p className="font-normal text-center w-full">Nincsenek barátaid</p>
        }
      </div>
      <TitleDivider title={"Eredmények"}/>
      <div className="flex flex-row w-full overflow-x-scroll gap-4 mb-8">
        <Badge image={img1} title={"Nagy ivó"}/>
      </div>
      <TitleDivider title={"Beállítások"} isNormal={true}/>
      <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2 select-none hover:cursor-pointer" onClick={() => {
        modifyModalRef.current.inert = true;
        modifyModalRef.current.showModal();
        modifyModalRef.current.inert = false;
        console.log(modifyModalRef.current.inert);
        }}>
        Profil szerkesztése
        <PencilSquareIcon className="h-6"/>
      </div>
      <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2 select-none hover:cursor-pointer" onClick={() => setIsAddFriendModalVisible(true)}>
        Barát hozzáadása
        <UserPlusIcon className="h-6"/>
      </div>
      <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2 select-none hover:cursor-pointer" onClick={() => setIsPasswordModalVisible(true)}>
        Jelszó módosítása
        <LockClosedIcon className="h-6"/>
      </div>
      <button className="w-1/2 bg-dark-grey text-red-500 py-2 px-4 rounded-md mt-2 drop-shadow-[0_4px_4px_rgba(0,0,0,.5)] select-none" onClick={handleLogout}>Kijelentkezés</button>
      <div className="h-[12vh]"></div>
      <FriendModal record={Object.hasOwn(selectedFriend, "id") === true && selectedFriend} isFriendModalVisible={isFriendModalVisible} setIsFriendModalVisible={setIsFriendModalVisible}/>
      <ModifyModal ref={modifyModalRef}/>
      <AddFriendModal isAddFriendModalVisible={isAddFriendModalVisible} setIsAddFriendModalVisible={setIsAddFriendModalVisible}/>
      <PasswordModal isPasswordModalVisible={isPasswordModalVisible} setIsPasswordModalVisible={setIsPasswordModalVisible}/>
      <Footer/>
    </div>
  )
}

export default Profile;
