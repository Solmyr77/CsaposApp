import React from "react";
import Header from "./Header";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import Footer from "./Footer";

function Search() {
  return (
    <div className="bg-grey pt-16 w-screen min-h-screen font-play font-bold text-white">
        <div className="px-4">
            <Header/>
            <SearchBar/>
            <TitleDivider title={"Legutóbbi"}/>
        </div>
        <Footer/>
    </div>
  )
}

export default Search;