import React from "react";
import UserImage from "./UserImage";

function Friend({ record }) {

  return (
    <div className="flex flex-col items-center min-w-16 mx-2 select-none">
      <UserImage record={record} width={"w-16"} border/>
      <p className="text-sm font-normal text-nowrap">{record.displayName?.length <= 10 ? `${record.displayName}` : `${record.displayName?.slice(0, 7)}...`}</p>
    </div>
  )
}

export default Friend;
