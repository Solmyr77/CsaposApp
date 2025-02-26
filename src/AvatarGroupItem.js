import React from "react";

function AvatarGroupItem({ height, imageUrl }) {
  return (
    <div className={`avatar ${height} aspect-square border-2`}>
        <div className="w-12">
            <img src={`https://assets.csaposapp.hu/assets/images/${imageUrl}`} />
        </div>
    </div>
  )
}

export default AvatarGroupItem;
