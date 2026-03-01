"use client";

import React, { useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceControlsProps {
    onInterim: (text: string) => void;
    onNewMessage: (text: string) => void;
    triggerAIResponse: (prevText: string) => void;
}

export default function VoiceControls({ onInterim, onNewMessage, triggerAIResponse }: VoiceControlsProps) {
    const { isListening, transcript, interimTranscript, error, startListening, stopListening, clearTranscript } = useSpeechRecognition();

    // Pass the real-time interim typing out
    useEffect(() => {
        onInterim(interimTranscript);
    }, [interimTranscript, onInterim]);

    // When the user stops listening and there's a finalized transcript, send it
    useEffect(() => {
        if (!isListening && transcript.trim()) {
            onNewMessage(transcript);
            triggerAIResponse(transcript);
            clearTranscript();
        }
    }, [isListening, transcript, onNewMessage, triggerAIResponse, clearTranscript]);

    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const getStateStyles = () => {
        if (isListening) return "bg-neo-pink animate-pulse text-white";
        // To keep it simple, we treat "processing" as just the AI responding in the parent for now
        return "bg-neo-yellow hover:bg-white text-black";
    };

    const getStateText = () => {
        if (isListening) return "말씀하세요 (듣고 있습니다...)";
        if (error) return "오류 발생! 다시 시도해주세요";
        return "🎤 요기 누르고 말하기";
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 neo-card bg-zinc-50 dark:bg-zinc-800 border-4">
            <button
                onClick={toggleMic}
                className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] flex items-center justify-center text-6xl sm:text-7xl transition-all ${getStateStyles()} active:translate-y-2 active:translate-x-2 active:shadow-none`}
            >
                {isListening ? "🔴" : "🎤"}
            </button>
            <p className="mt-8 font-black text-2xl sm:text-3xl bg-white dark:bg-black px-6 py-3 border-4 border-black dark:border-white text-center break-keep w-full">
                {getStateText()}
            </p>
        </div>
    );
}
