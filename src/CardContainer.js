import React from "react";
import Card from "./Card";

function CardContainer({records}) {
  
  console.log(records);
    return (
    <div className="flex gap-4 justify-left flex-wrap">
        {
            records.map(record => <Card title={record.name} status={record.status}/>)
        }
    </div>
  );
}

export default CardContainer;
