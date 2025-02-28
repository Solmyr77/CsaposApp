import React, { useContext } from "react";
import Context from "./Context";
import { LuChevronLeft } from "react-icons/lu";

function BackButton({ isInset }) {
  const { setPreviousRoutes } = useContext(Context);

  if (isInset) {
    return (
      <div className="flex flex-row items-center justify-start bg-dark-grey rounded-md p-2 w-fit drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] absolute z-10 ml-4 mt-4" onClick={() => setPreviousRoutes((state) => state.slice(0, - 1))}>
        <LuChevronLeft className="h-6 w-6"/>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center justify-start bg-dark-grey rounded-md p-2 w-fit drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] absolute z-10" onClick={() => setPreviousRoutes((state) => state.slice(0, - 1))}>
      <LuChevronLeft className="h-6 w-6"/>
    </div>
  );
}

export default BackButton;
