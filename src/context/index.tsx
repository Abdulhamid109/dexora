"use client"
import { createContext, useContext, useState } from "react";

type Json = {
    No: number;
    Score: string; // This should remain string since it can contain "*" (e.g., "158*")
    Balls: number;
    "Strike Rate": number;
    Player: string;
    Team: string;
    Opposition: string;
    Innings: number;
    Venue: string;
    City: string;
    Date: number;
    Result: string;
};

export type LLMColumn = {
    type: string;
    xkey: string | null;
    ykey: string | null;
    charts: string;
};

// This is the correct shape of your full llmdata object:
export type LLMData = {
    [columnName: string]: LLMColumn;
};

type DataContextType = {
    jsonData: Json[];
    llmData: LLMData | null;
    setJsonData: (data: Json[]) => void;
    setLLMData: (data: LLMData) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// function to access the context
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used inside a DataProvider");
    return context;
}

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const [jsonData, setJsonData] = useState<Json[]>([]);
    const [llmData, setLLMData] = useState<LLMData | null>(null);

    return (
        <DataContext.Provider value={{ jsonData, llmData, setJsonData, setLLMData }}>
            {children}
        </DataContext.Provider>
    )
}