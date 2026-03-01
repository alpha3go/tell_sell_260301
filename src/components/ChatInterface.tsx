"use client";

import React from "react";

export interface Message {
    id: string;
    sender: "user" | "ai";
    text: string;
}

interface ChatInterfaceProps {
    messages: Message[];
    interimTranscript?: string;
}

export default function ChatInterface({ messages, interimTranscript }: ChatInterfaceProps) {
    return (
        <div className="flex flex-col h-[600px] w-full neo-card bg-zinc-50 dark:bg-zinc-800 p-6 relative border-4">
            <div className="absolute top-0 left-0 bg-white neo-border px-5 py-2 -mt-4 ml-6 shadow-[4px_4px_0_#000]">
                <h3 className="text-xl sm:text-2xl font-bold">💬 고객과의 대화</h3>
            </div>

            <div className="flex-1 overflow-y-auto mt-8 flex flex-col gap-6 p-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] p-4 neo-border shadow-[4px_4px_0_#000] border-2 ${msg.sender === "user" ? "bg-neo-pink text-black text-right" : "bg-white text-black"
                                }`}
                        >
                            <p className="font-bold text-xl sm:text-2xl leading-relaxed break-keep">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {interimTranscript && (
                    <div className="flex w-full justify-end">
                        <div className="max-w-[85%] p-4 neo-border shadow-[4px_4px_0_#000] border-2 bg-neo-pink text-black text-right opacity-70 border-dashed">
                            <p className="font-bold text-xl sm:text-2xl leading-relaxed break-keep">{interimTranscript}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
