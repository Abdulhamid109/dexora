import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx"
import { redis } from "@/redis/connection";

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
        // setting the entire data in the redis

        await redis.set("jsondata",JSON.stringify(json));
        return NextResponse.json(
            { success: true, data: json},
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