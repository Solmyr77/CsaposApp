import React, { useContext, useEffect } from 'react';
import Context from "./Context";
import TableItem from './TableItem';

export default function TableMenu() {
    const { setMenuState, tables } = useContext(Context);

    useEffect(() => {
        setMenuState("Tables");
    }, []);

    return (
        <div className='grid lg:grid-cols-4 grid-cols-3 gap-4 overflow-auto p-4'>
            {tables?.map(table => <TableItem key={table.id} table={table} />)}
        </div>
    );
}
