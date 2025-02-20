import React, { useContext } from "react";
import { ArrowLeftEndOnRectangleIcon, ChevronRightIcon, ShoppingBagIcon } from "@heroicons/react/20/solid";
import MenuItem from "./MenuItem";
import Context from "./Context";

function PubMenu() {
  const { order } = useContext(Context);
  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold select-none">
      <div className="shadow-lg flex flex-row justify-center items-center mb-4 h-[10vh] -translate-y-0">
        <ArrowLeftEndOnRectangleIcon className="w-12 bg-dark-grey p-2 rounded-md text-red-500 absolute left-4"/>
        <p className="text-center text-xl">Félidő söröző</p>
      </div>
      <div className="h-full overflow-y-scroll bg-grey pb-[12vh]">
        <p className="text-lg w-full pb-2 sticky top-0 px-4 bg-grey">Sörök</p>
        <div className="flex flex-col px-4 gap-y-2">
          <MenuItem name={"Pilsner Urquell"} description={"0,45l korsó"}/>
          <MenuItem name={"Kőbányai"} description={"0,5l korsó"}/>
          <MenuItem name={"Dreher Bak"} description={"0,5l korsó"}/>
        </div>
        <p className="text-lg w-full mt-2 pb-2 sticky top-0 px-4 bg-grey">Rövid italok</p>
        <div className="flex flex-col px-4 gap-y-2">
          <MenuItem name={"Jagermeister"} description={"4cl"}/>
          <MenuItem name={"Unicum szilva"} description={"4cl"}/>
          <MenuItem name={"Finlandia"} description={"4cl"}/>
          <MenuItem name={"Tatratea"} description={"4cl"}/>
        </div>
      </div>
      <div className="fixed bg-grey bottom-0 h-[10vh] w-full flex flex-row justify-between items-center rounded-t-lg px-6 shadow-dark-grey shadow-[0px_0px_18px_0px_rgba(0_0_0_0)]">
        <div className="relative">
          <ShoppingBagIcon className="w-8"/>
          <div className="h-4 aspect-square bg-red-500 absolute -top-1 -right-1 rounded-full flex justify-center items-center font-normal">{order.length}</div>
        </div>
        <button className="flex items-center bg-blue py-2 pl-4 pr-2 rounded-md shadow-md">Asztalom <ChevronRightIcon className="w-6"/></button>
      </div>
    </div>
  )
}

export default PubMenu;
