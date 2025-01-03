import React from "react";
import Card from "./Card";

function CardContainer({records, cardsToShow}) {
  let recordsToDisplay = [];

  switch (cardsToShow) {
    case "Összes":
      recordsToDisplay = records;
      break;
    case "Nyitva":
      recordsToDisplay = records.filter(record => record.status != "closed");
      break;
    case "Kedvencek":
      recordsToDisplay = records;
      break;
  }
  
  return (
    <div className={`flex justify-between flex-wrap`}>
      {recordsToDisplay.map(record => <Card record={record}/>)}
      {
        recordsToDisplay.length % 2 == 0 && recordsToDisplay.length % 3 != 0 ? 
        <div className="basis-[30%] opacity-100 aspect-square"></div> 
        : null
      }
    </div>
  );
}

export default CardContainer;
