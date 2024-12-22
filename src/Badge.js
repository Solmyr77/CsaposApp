import React from "react";

function Badge() {
  return (
    <div className="flex flex-col h-[5.5rem] w-[70px]">
        <div className="flex basis-[70%] bg-black opacity-25 rounded-t-md">

        </div>
        <div className="flex basis-[30%] justify-center items-center bg-white text-black rounded-b-md">
            <p className="text-xs">Nagy Ivó</p>
        </div>
    </div>
  );
}

export default Badge;
