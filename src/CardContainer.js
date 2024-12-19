import React from "react";
import Card from "./Card";

function CardContainer({records, cardsToShow}) {

    return (
    <div className="flex gap-4 justify-left flex-wrap">
      {
        cardsToShow == "Összes" &&
        records.map(record => <Card title={record.name} status={record.status}/>)
      }
      {
        cardsToShow == "Nyitva" &&
        records.filter(record => record.status != "closed").map(record => <Card title={record.name} status={record.status}/>)
      }
      {
        cardsToShow == "Kedvencek" &&
        <h1>Nincsenek kedvenceid!</h1>
      }
    </div>
  );
}

export default CardContainer;
