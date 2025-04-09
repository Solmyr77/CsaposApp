import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";

function CardContainer({ records, cardsToShow }) {
  let recordsToDisplay = [];

  switch (cardsToShow) {
    case "Összes":
      recordsToDisplay = records;
      break;
    case "Nyitva":
      recordsToDisplay = records.filter(record => record.isOpen);
      break;
    case "Kedvencek":
      recordsToDisplay = records;
      break;
  }

  recordsToDisplay.sort((a, b) => b.isOpen - a.isOpen === 0 ? a.name.localeCompare(b.name) : b.isOpen - a.isOpen);
  
  return (
    <div className={`grid grid-cols-3 gap-4 lg:grid-cols-5`}>
      {recordsToDisplay.map(record => <Card key={record.id} record={record}/>)}
      {
        recordsToDisplay.length % 2 == 0 && recordsToDisplay.length % 3 != 0 ? 
        <div id="emptyDiv" className="basis-[30%] aspect-square drop-shadow-none shadow-none invisible"></div> 
        : null
      }
    </div>
  );
}

export default CardContainer;
