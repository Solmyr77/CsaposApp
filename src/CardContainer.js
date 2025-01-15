import React, { useEffect } from "react";
import Card from "./Card";

function CardContainer({records, cardsToShow}) {
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

  useEffect(() => {
    
  }, [recordsToDisplay]);
  
  
  return (
    <div className={`flex justify-between flex-wrap gap-y-10`}>
      {recordsToDisplay.map(record => <Card record={record}/>)}
      {
        recordsToDisplay.length % 2 == 0 && recordsToDisplay.length % 3 != 0 ? 
        <div id="emptyDiv" className="basis-[30%] aspect-square drop-shadow-none shadow-none invisible"></div> 
        : null
      }
    </div>
  );
}

export default CardContainer;
