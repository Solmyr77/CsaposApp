import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

function BackButton() {
  return (
    <div className="flex flex-row items-center justify-start bg-dark-grey rounded-md p-1 w-fit shadow">
        <ChevronLeftIcon className="h-6"/>
    </div>
  );
}

export default BackButton;
