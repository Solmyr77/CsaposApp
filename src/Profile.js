import React, { useContext, useEffect, useRef, useState } from "react";
import TitleDivider from "./TitleDivider";
import Footer from "./Footer";
import Friend from "./Friend";
import Badge from "./Badge";
import img1 from "./img/beeremoji.webp";
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import ModifyModal from "./ModifyModal";
import AddFriendModal from "./AddFriendModal";
import PasswordModal from "./PasswordModal";
import FriendModal from "./FriendModal";
import { LuSquarePen, LuUserPlus, LuKeyRound } from "react-icons/lu";
import UserImage from "./UserImage";

function Profile() {
  const { setMenuState, user, friends, logout } = useContext(Context);
  const modifyModalRef = useRef();
  const friendModalRef = useRef();
  const addfriendModalRef = useRef();
  const passwordModalRef = useRef();
  const badgeModalRef = useRef();
  const [selectedFriend, setSelectedFriend] = useState({});
  const [selectedBadge, setSelectedBadge] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setMenuState("Profile");
  }, []);
  
  return (
    <div className="min-h-screen h-full w-full max-w-full bg-grey flex px-4 text-white font-bold font play flex-col items-center relative">
      <h1 className="text-center w-full pt-8 text-2xl mb-2">{user.displayName}</h1>
      {/* <img src={user.imageUrl} alt="avatar" className="w-28 object-cover aspect-square rounded-full mb-8"/> */}
      <UserImage record={user} width={"w-28"} margin={"mb-8"}/>
      <TitleDivider title={"Barátok"}/>
      <div className="flex w-full mb-8 gap-2">
        <div className="flex justify-center cursor-pointer items-center h-20 min-w-16 bg-gradient-to-tr from-blue to-sky-400 text-white border-0 rounded-md" onClick={() => {
          addfriendModalRef.current.inert = true;
          addfriendModalRef.current.showModal();
          addfriendModalRef.current.inert = false;
        }}>
          <LuUserPlus className="w-8 h-8"/>
        </div>
        <div className="flex flex-row w-full h-full overflow-x-scroll">
        { friends.length > 0 ? 
          friends.sort((a, b) => a.displayName?.localeCompare(b.displayName)).map(friend =>
            {
              if(friend === friends[friends.length-1]) {
                return (
                  <div key={friend.id} className="flex hover:cursor-pointer" onClick={() => {
                    friendModalRef.current.inert = true;
                    friendModalRef.current.showModal();
                    friendModalRef.current.inert = false;
                    setSelectedFriend(friend);
                    }}>
                    <Friend record={friend} isVertical={true}/>
                  </div>
                )
              }
              return (
                <div key={friend.id} className="flex items-center hover:cursor-pointer" onClick={()=> {
                  friendModalRef.current.inert = true;
                  friendModalRef.current.showModal();
                  friendModalRef.current.inert = false;
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
      </div>
      <TitleDivider title={"Eredmények"}/>
      <div className="flex flex-row w-full overflow-x-scroll gap-4 mb-8 cursor-pointer" onClick={() => {
        badgeModalRef.current.inert = true;
        badgeModalRef.current.showModal();
        badgeModalRef.current.inert = false;
      }}>
        <Badge image={img1} title={"Nagy ivó"}/>
      </div>
      <TitleDivider title={"Beállítások"} isNormal={true}/>
      <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2 select-none hover:cursor-pointer" onClick={() => {
        modifyModalRef.current.inert = true;
        modifyModalRef.current.showModal();
        modifyModalRef.current.inert = false;
        }}>
        Profil szerkesztése
        <LuSquarePen className="h-6 w-6"/>
      </div>
      <div className="w-full h-10 font-normal bg-dark-grey rounded-md flex flex-row justify-between items-center px-2 drop-shadow-[0_2px_2px_rgba(0,0,0,.5)] mb-2 select-none hover:cursor-pointer" onClick={() => {
        passwordModalRef.current.inert = true;
        passwordModalRef.current.showModal();
        passwordModalRef.current.inert = false;
      }}>
        Jelszó módosítása
        <LuKeyRound className="h-6 w-6"/>
      </div>
      <button className="btn border-0 mt-2 hover:bg-dark-grey bg-dark-grey text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,.5)] text-md select-none" onClick={async () => {
        await logout();
        navigate("login");
        }}>Kijelentkezés</button>
      <div className="h-[12vh]"></div>
      <FriendModal record={Object.hasOwn(selectedFriend, "id") === true && selectedFriend} ref={friendModalRef}/>
      <ModifyModal ref={modifyModalRef}/>
      <AddFriendModal ref={addfriendModalRef}/>
      <PasswordModal ref={passwordModalRef}/>
      <Footer/>

      <dialog className="modal" ref={badgeModalRef}>
        <div className="modal-box bg-transparent shadow-none p-0 overflow-hidden">
          <div className="flex justify-center">
            <label className="swap swap-flip">
              <input type="checkbox"/>
              <div className="flex flex-col h-80 aspect-[.7] select-none rounded-lg swap-off">
                <div className="flex basis-[70%] bg-dark-grey rounded-t-lg">
                  <img src={img1} alt=""/>
                </div>
                <div className="flex basis-[30%] justify-center items-center bg-white text-black rounded-b-lg">
                  <p className="text-xl">Nagy ivó</p>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center h-80 aspect-[.7] select-none rounded-lg swap-on bg-grey">
                <span className="text-md">50 megivott sör</span>
              </div>
            </label>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </div>
  )
}

export default Profile;
