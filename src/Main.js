import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import Footer from "./Footer";
import records from "./records";

function Main() {
  console.log(records);
    return (
      <div className="bg-grey text-white w-screen font-play font-bold">
          <div className="px-4 overflow-auto pb-[12vh]">
            <Navbar/>
            <TitleDivider title={"Kiemelt"}/>
            <StyledSwiper/>
            <TitleDivider title={"Összes"}/>
            <CardContainer records={records}/>
          </div>
        </div>
      );
}

export default Main;