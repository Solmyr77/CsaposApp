import React from "react";

function Friend({ record }) {

  return (
    <div className="flex flex-col items-center min-w-16 mx-2 select-none">
      <img src={`https://assets.csaposapp.hu/assets/images/${record.imageUrl}`} alt="avatar" className="w-16 object-cover aspect-square rounded-full border-2"/>
      <p className="text-sm font-normal text-nowrap">{record.displayName?.length <= 10 ? `${record.displayName}` : `${record.displayName?.slice(0, 7)}...`}</p>
    </div>
  )
}

export default Friend;
