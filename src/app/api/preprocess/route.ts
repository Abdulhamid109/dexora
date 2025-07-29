// here we will be preprocessing the data from the excel file

import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx"
// import OpenAI from 'openai';
// import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";


// combinations of x/y columns based on the heuristics
const generateCombos = (scheme: Record<string, string>) => {
    const keys = Object.keys(scheme);
    console.log("Keys---"+keys)
    const combos = [];
    for (const xkeys of keys) {
        for (const ykeys of keys) {
            if (xkeys == ykeys) continue


            const xType = scheme[xkeys];
            const yType = scheme[ykeys];

            // heuristics -->combinations + stats
            // bar chart
            if ((xType === "categorical" || xType === "data") && yType === "numerical") {
                combos.push({ chart: "bar", xkeys, ykeys })
            }
            // Line: date vs numerical
            if (xType === "date" && yType === "numerical") {
                combos.push({ chart: "line", xkeys, ykeys })
            }

            // Pie: categorical vs numerical
            if (xType === "categorical" && yType === "numerical") {
                combos.push({ chart: "pie", xkeys, ykeys })
            }

            // Scatter: numerical vs numerical
            if (xType === "numerical" && yType === "numerical") {
                combos.push({ chart: "scatter", xkeys, ykeys })
            }
        }
    }
    return combos;
}
// AIzaSyDrXbQI0gZ9hKeMkOeLRcjJJrxP3BafuMs
// using the llm model to understand what the column name means and based ont ha
const understandingTheSchema = async (schema: Record<string, string>) => {
  const keys = Object.keys(schema);

  const ai = new GoogleGenerativeAI(
        process.env.GOOGLE_GENERATIVE_AI_API_KEY!
);

const prompt = `
You are a data analyst assistant.
Columns: ${keys.join(", ")}
Instructions: 
1. For each column, identify the likely data type (e.g., number, date, category, text).
2. If you found the numerical type then identify the xKey and yKey
3. Suggest 1 smart charts that would help visualize the data based on the columns.
4. Output the result as JSON in the format:
{
  "<column_name>": {
    "type": "string | number | date | category | boolean",
    "xkey": "number",
    "ykey":"number"
    "charts": "bar | line | box | histogram | pie | scatter "
  }
}
Please return only valid JSON.
`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 512,
      },
    });

    const response = await result.response;
    const text = response.text();
    // const cleanText = text.replace(/```json|```/g, "").trim();

    console.log("Schema Understanding Result:", text);
    // const jsonresult = JSON.parse(cleanText);
    // console.log("jsonObj => "+jsonresult)
    return text;
  } catch (error) {
    console.error("Failed to understand the schema:", error);
    throw new Error("Something went wrong while understanding the schema: " + error);
  }
};





export async function POST(request: NextRequest) {
    try {
        const formdata = await request.formData();
        const file = formdata.get('file') as File;
        if (!file) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            )
        }


        // here we will extarct the data and convert it into json
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        // here we will be identifying the column type
        const sample = json[0];
        const schema = Object.fromEntries(Object.entries(sample as JSON).map(([Key, value]) => {
            if (typeof value === "number") return [Key, "numerical"]
            // else if (!isNaN(Date.parse(value))) return [Key, "date"]
            // 
            else {
                // console.log(Key)
                return [Key, "categorical"]}
        }))

        const data = generateCombos(schema);
        data.map((key,val)=>{
            console.log(key.chart+" "+key.xkeys+" "+key.ykeys+" "+val)
        })

        const result = await understandingTheSchema(schema);
        
        return NextResponse.json(
            { success: true, data: json, schema ,llmdata:result},
            { status: 200 }
        )

    } catch (error) {
        console.log('Internal Server error' + error);
        return NextResponse.json(
            { error: "Internal Server error " + error },
            { status: 500 }
        )
    }
}