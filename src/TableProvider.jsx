import { createContext, useState } from "react";

const TableContext = createContext();
export default TableContext;

export function TableProvider({ children }) {
    const [selectedGuest, setSelectedGuest] = useState({});

    return (
        <TableContext.Provider 
        value={{
        selectedGuest,
        setSelectedGuest
        }}>
            {children}
        </TableContext.Provider>
    )
}