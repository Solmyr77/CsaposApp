import React from "react";

function StatusIndicator({ status }) {
  return (
    <div className="flex justify-between items-center">
        <div className={`w-2 h-2 rounded-full ${status ? "bg-[rgb(8,228,0)]" : "bg-[rgb(222,0,0)]"}`}></div>
        <p className="text-xs ml-1 font-normal">{status ? "Nyitva" : "Zárva"}</p>
    </div>
  )
}

export default StatusIndicator;
