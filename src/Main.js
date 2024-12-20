import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import records from "./records";
import Context from "./Context";

function Main() {
  const [navState, setNavState, menuState, setMenuState] = useContext(Context);

  return (
    <div className="bg-grey text-white w-screen font-play font-bold">
        <div className="px-4 overflow-auto pb-[12vh]">
          <Navbar/>
          <TitleDivider title={"Kiemelt"}/>
          <StyledSwiper/>
          <TitleDivider title={navState}/>
          <CardContainer records={records} cardsToShow={navState}/>
        </div>
      </div>
  );
}

export default Main;