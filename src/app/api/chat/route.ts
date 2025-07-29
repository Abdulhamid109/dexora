import { redis } from '@/redis/connection';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();
        const data = await redis.get("jsondata");
        const prompt = `You are a data analyst named Dexora. 
                        Your task is to answer questions exclusively 
                        related to data analysis based on the provided
                        data, which is in JSON format. 
                        This is the actual data->${data}.And Please ensure
                        that your responses are derived solely from the
                        Provided data. For any other questions, respond 
                        sarcastically, reminding the user to only ask 
                        questions related to data analysis from the
                        provided data.`;

        const result = streamText({
            model: google("gemini-1.5-flash"),
            messages,
            system: prompt,
        });

        console.log("Stream result:", result);

        // Convert the stream result to a response and log it
        const response = result.toDataStreamResponse();
        console.log("Stream response:", response);

        return result.toDataStreamResponse();;
    } catch (error) {
        console.log("Internal Server error", error);
        return NextResponse.json(
            { error: "Internal Server error" + error },
            { status: 500 }
        )
    }
}
