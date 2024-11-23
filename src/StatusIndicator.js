import React from "react";

function StatusIndicator({status}) {
    const statusStyles = {
        open: {
            color: "bg-green-500",
            text: "Nyitva"
        },
        closed: {
            color: "bg-red-500",
            text: "Zárva"
        }
    };

    const statusColor = statusStyles[status].color;
    const statusText = statusStyles[status].text;

  return (
    <div className="flex justify-between items-center">
        <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
        <p className="text-xs ml-1 font-normal">{statusText}</p>
    </div>
  )
}

export default StatusIndicator;
