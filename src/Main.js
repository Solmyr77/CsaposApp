import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import Context from "./Context";

function Main() {
  const { navState, setMenuState, locations } = useContext(Context);

  useEffect(() => {
    setMenuState("Main");
  }, [])

  return (
    <div className="bg-grey text-white font-play font-bold">
      <div className="px-4 overflow-auto pb-[12vh]">
        <Navbar/>
        <TitleDivider title={"Kiemelt"}/>
        <StyledSwiper/>
        <TitleDivider title={navState}/>
        <CardContainer records={locations} cardsToShow={navState}/>
      </div>
    </div>
  );
}

export default Main;