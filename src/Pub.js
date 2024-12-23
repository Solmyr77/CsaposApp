import React from "react";
import Footer from "./Footer";
import BackButton from "./BackButton";
import { Link } from "react-router-dom";
import img1 from "./img/pub.jpg"

function Pub( { record } ) {
  return (
    <div>
        <div className="min-h-screen w-screen bg-grey px-4 pt-16 text-white">
            <Link to={"/"}>
                <BackButton/>
            </Link>
            <div className="w-full h-fit relative mt-4">
                <img src={img1} alt="" className="rounded-md w-full h-40 object-cover"/>
                <div className="w-full h-full bg-black bg-opacity-65 absolute inset-0  flex flex-col rounded-md text-wrap">
                    <p className="font-bold text-3xl px-1 break-words text-center leading-tight absolute top-1/2 -translate-y-1/2 w-full">Félidő söröző</p>
                </div>
            </div>
        </div>
        {/* <Footer/> */}
    </div>
  );
}

export default Pub;
