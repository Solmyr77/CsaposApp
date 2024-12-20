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
      {recordsToDisplay.map(record=> <Card status={record.status} title={record.name}/>)}
      {
        recordsToDisplay.length % 3 == 0 ? null
        : <div className="basis-[30%] opacity-100 aspect-square"></div> 
      }
    </div>
  );
}

export default CardContainer;
