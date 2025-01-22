import React from "react";

function MainButton({ title, isActive }) {
  return (
    <div className={`w-64 h-20 bg-blue ${isActive === true ? "opacity-1" : "opacity-50"} rounded flex justify-center items-center select-none`}>
      <p className="font-bold text-lg">{title}</p>
    </div>
  );
}

export default MainButton;
