"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize SpeechRecognition
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setError("Browser does not support Speech Recognition.");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "ko-KR";

            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognition.onresult = (event: any) => {
                let currentTranscript = "";
                let currentInterim = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        currentTranscript += result[0].transcript;
                    } else {
                        currentInterim += result[0].transcript;
                    }
                }

                if (currentTranscript) {
                    setTranscript((prev) => prev + (prev ? " " : "") + currentTranscript);
                }
                setInterimTranscript(currentInterim);
            };

            recognition.onerror = (event: any) => {
                // 'no-speech' is a normal timeout if the user doesn't say anything.
                if (event.error !== 'no-speech') {
                    console.error("Speech recognition error:", event.error);
                    setError(`Error: ${event.error}`);
                } else {
                    // Just turn off listening state if it times out
                    setIsListening(false);
                }

                // Auto-restart if we get audio-capture/network errors to keep it continuous
                if (event.error === 'network' || event.error === 'audio-capture') {
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                // We handle intentional stopping in stopListening
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = useCallback(() => {
        setError(null);
        setTranscript("");
        setInterimTranscript("");
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e: any) {
                console.warn("Could not start recognition:", e.message);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    // Expose a clear function for when external components want to consume the text
    const clearTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        startListening,
        stopListening,
        clearTranscript
    };
}
