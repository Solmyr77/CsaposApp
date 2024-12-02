import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import Card from "./Card";
import Footer from "./Footer";

function Main() {
    return (
        <div className="bg-grey text-white w-screen min-h-screen font-play font-bold pt-16">
          <div className="px-4 overflow-auto pb-[12vh]">
            <Header notification={true}/>
            <Navbar/>
            <TitleDivider title={"Kiemelt"}/>
            <StyledSwiper/>
            <TitleDivider title={"Összes"}/>
            <div className="flex gap-4 justify-between flex-wrap">
              <Card status={"open"} title={"Félidő söröző"}/>
              <Card status={"open"} title={"City Pub"}/>
              <Card status={"open"} title={"Félidő söröző"}/>
              <Card status={"open"} title={"Félidő söröző"}/>
              <Card status={"closed"} title={"Félidő söröző"}/>
              <Card status={"closed"} title={"Félidő söröző"}/>
            </div>
          </div>
          <Footer/>
        </div>
      );
}

export default Main;