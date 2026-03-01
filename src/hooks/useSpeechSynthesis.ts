"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useSpeechSynthesis() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const speak = useCallback(async (text: string) => {
        try {
            // Cancel any ongoing speech
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            setIsSpeaking(true);

            // Fetch the audio stream from our secure backend
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('TTS fetch failed');
            }

            // Create an object URL from the audio blob and play it
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url); // Clean up memory
            };
            audio.onerror = (e) => {
                console.error("Audio Playback Error:", e);
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();

        } catch (error) {
            console.error("Speech generation error:", error);
            setIsSpeaking(false);
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking, supported: true };
}
