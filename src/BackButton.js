import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

function BackButton() {
  return (
    <div className="flex flex-row items-center justify-start bg-dark-grey rounded-md p-2 w-fit drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] absolute z-10 ml-2 mt-2">
      <ChevronLeftIcon className="h-6"/>
    </div>
  );
}

export default BackButton;
