"use client"
import Navbar from '@/components/navbar'
import { redis } from '@/redis/connection'
import { useChat } from '@ai-sdk/react'
import React, { useEffect } from 'react'

const TalkWithAI = () => {
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    useEffect(() => {
        console.log("Messages:", messages);
    }, [messages]);

    useEffect(() => {
        // Cleanup function
        const cleanup = async () => {
            try {
                // Pass an array of keys to delete
                await redis.del("jsondata"); // Use an array with the key(s)
                console.log("Data deleted from Redis");
            } catch (error) {
                console.error("Error deleting data from Redis:", error);
            }
        };
        // Return the cleanup function
        return () => {
            cleanup(); // Call the cleanup function
        };
    }, []);


    return (
        <div className=''>
            <div className='fixed top-0 mb-10'><Navbar /></div>

            <section className='flex flex-col justify-center items-center mt-20'>
                <span className='font-bold p-2 text-3xl text-yellow-600'>DexoraAI</span>
                <div className='font-bold p-1 text-2xl'>An Ai based Data Analyst</div>
            </section>
            <section className='flex flex-col w-full max-w-md py-24 mx-auto stretch  z-10'>
                {messages.map((message) => (
                    <div key={message.id} className='whitespace-pre-wrap'>
                        {message.role === "user" ? <div className='font-bold p-2'>User</div> : <div className='font-bold text-green-600 p-2'>Data-Analyst</div>}
                        {message.parts.map((part, i) => {
                            switch (part.type) {
                                case "text":
                                    return <div key={`${message.id}-${i}`} className='ml-2'>{part.text}</div>
                                default:
                                    return null;
                            }
                        })}
                    </div>
                ))}

                {/* a form which is gonna come from the usechat hook */}
                <form onSubmit={handleSubmit} className='bottom-0'>
                    <input
                        className='z-20 fixed bottom-0 w-full overflow-hidden bg-zinc-300 max-w-md p-2 mb-2 border border-zinc-700'
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Talk with your data'
                    />
                </form>
            </section>
        </div>
    )
}

export default TalkWithAI
