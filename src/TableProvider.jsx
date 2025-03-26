import { createContext, useState } from "react";

const TableContext = createContext();
export default TableContext;

export function TableProvider({ children }) {
    const [selectedTable, setSelectedTable] = useState({});
    const [selectedGuest, setSelectedGuest] = useState({});
    
    return (
        <TableContext.Provider 
        value={{
        selectedTable,
        setSelectedTable,
        selectedGuest,
        setSelectedGuest
        }}>
            {children}
        </TableContext.Provider>
    )
}