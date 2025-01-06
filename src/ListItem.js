import React from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

function ListItem({ title, openingHours }) {
  return (
    <div className="w-full">
        <div className="flex flex-row justify-between items-center">
            <p className="font-normal text-md">{title}</p>
            <p>{openingHours}</p>
        </div>
        <hr className="w-full bg-white my-2 opacity-80"/>
    </div>
  );
}

export default ListItem;
