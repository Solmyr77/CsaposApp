import React from "react";

function AvatarGroupItem({ imageUrl }) {
  return (
    <div className="avatar h-10 aspect-square border-2">
        <div className="w-12">
            <img src={`https://assets.csaposapp.hu/assets/images/${imageUrl}`} />
        </div>
    </div>
  )
}

export default AvatarGroupItem;
