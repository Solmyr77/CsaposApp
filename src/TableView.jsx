import React from "react";
import { useParams } from "react-router-dom";

function TableView() {
  const { number } = useParams();
  return (
    <div className="flex flex-grow p-4">
      <span className="text-5xl font-bold">Asztal {number}</span>
    </div>
  )
}

export default TableView;
