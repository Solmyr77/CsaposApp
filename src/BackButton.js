import React, { useContext } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Context from "./Context";

function BackButton({ isInset }) {
  const { setPreviousRoutes } = useContext(Context);

  if (isInset) {
    return (
      <div className="flex flex-row items-center justify-start bg-dark-grey rounded-md p-2 w-fit drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] absolute z-10 ml-4 mt-4" onClick={() => setPreviousRoutes((state) => state.slice(0, - 1))}>
        <ChevronLeftIcon className="h-6"/>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center justify-start bg-dark-grey rounded-md p-2 w-fit drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] absolute z-10" onClick={() => setPreviousRoutes((state) => state.slice(0, - 1))}>
      <ChevronLeftIcon className="h-6"/>
    </div>
  );
}

export default BackButton;
