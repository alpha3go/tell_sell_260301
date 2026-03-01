"use client";

import React, { useEffect, useState } from "react";
import { Message } from "@/components/ChatInterface";

interface FeedbackPanelProps {
    chatMessages: Message[];
}

interface FeedbackData {
    objectionHandling: { score: number; feedback: string };
    empathyRatio: { score: number; feedback: string };
    metaphorUsage: { score: number; feedback: string };
    overallAdvice: string;
}

export default function FeedbackPanel({ chatMessages }: FeedbackPanelProps) {
    const [feedback, setFeedback] = useState<FeedbackData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!chatMessages || chatMessages.length === 0) {
            setError("대화 내용이 없어 피드백을 분석할 수 없습니다.");
            setLoading(false);
            return;
        }

        const fetchFeedback = async () => {
            try {
                // Filter and map messages to fit the OpenAI messages format
                const apiMessages = chatMessages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                }));

                const res = await fetch("/api/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: apiMessages }),
                });

                if (!res.ok) throw new Error("피드백 분석 중 오류가 발생했습니다.");

                const data = await res.json();
                setFeedback(data);
            } catch (e: any) {
                setError(e.message || "Failed to fetch feedback");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [chatMessages]);

    if (loading) {
        return (
            <div className="w-full neo-card bg-zinc-100 text-black p-6 sm:p-12 relative h-full border-4 shadow-[8px_8px_0_#000] flex flex-col items-center justify-center animate-pulse">
                <div className="text-4xl sm:text-6xl mb-4">🧠</div>
                <h3 className="text-xl sm:text-2xl font-black mb-2 text-center break-keep">AI 코치가 대화를 꼼꼼히 분석하고 있습니다...</h3>
                <p className="text-zinc-500 font-bold text-center break-keep">(약 5~10초 정도 소요될 수 있습니다)</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full neo-card bg-pink-100 text-black p-6 sm:p-8 relative h-full border-4 shadow-[8px_8px_0_#000]">
                <h3 className="text-xl sm:text-2xl font-black text-red-600 mb-2">⚠️ 분석 실패</h3>
                <p className="font-bold">{error}</p>
            </div>
        );
    }

    if (!feedback) return null;

    const renderScoreBadge = (score: number) => {
        let color = "bg-green-500";
        if (score < 50) color = "bg-red-500";
        else if (score < 80) color = "bg-yellow-500";
        return <span className={`${color} text-white px-2 py-1 border-2 border-black ml-2 text-lg`}>{score}점</span>;
    };

    return (
        <div className="w-full neo-card bg-neo-blue text-white p-6 sm:p-8 relative h-full border-4 shadow-[8px_8px_0_#000] overflow-y-auto max-h-[65vh]">
            <div className="absolute top-0 right-0 bg-neo-yellow text-black neo-border px-4 py-2 sm:px-5 sm:py-2 -mt-4 mr-4 sm:mr-6 shadow-[4px_4px_0_#000]">
                <h3 className="text-lg sm:text-2xl font-black">🎯 AI 세일즈 코치 분석망</h3>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:gap-6">
                {/* 1. Objection Handling */}
                <div className="bg-white text-black p-4 sm:p-5 neo-border hover:-translate-y-1 transition-transform border-4 shadow-[4px_4px_0_#000]">
                    <div className="flex justify-between items-center border-b-4 border-black pb-2 mb-3 pr-2">
                        <h4 className="font-black text-lg sm:text-2xl break-keep w-full">1. 거절 및 다단계 편견 대처 능력</h4>
                        {renderScoreBadge(feedback.objectionHandling.score)}
                    </div>
                    <p className="text-base sm:text-lg font-medium break-keep whitespace-pre-line leading-relaxed">{feedback.objectionHandling.feedback}</p>
                </div>

                {/* 2. Empathy / Questioning Ratio */}
                <div className="bg-white text-black p-4 sm:p-5 neo-border hover:-translate-y-1 transition-transform border-4 shadow-[4px_4px_0_#000]">
                    <div className="flex justify-between items-center border-b-4 border-black pb-2 mb-3 pr-2 text-neo-pink">
                        <h4 className="font-black text-lg sm:text-2xl break-keep w-full">2. 공감 및 경청 (질문) 비중</h4>
                        {renderScoreBadge(feedback.empathyRatio.score)}
                    </div>
                    <p className="text-base sm:text-lg font-medium break-keep whitespace-pre-line leading-relaxed">{feedback.empathyRatio.feedback}</p>
                </div>

                {/* 3. Metaphor Usage */}
                <div className="bg-white text-black p-4 sm:p-5 neo-border hover:-translate-y-1 transition-transform border-4 shadow-[4px_4px_0_#000]">
                    <div className="flex justify-between items-center border-b-4 border-black pb-2 mb-3 pr-2 text-neo-green">
                        <h4 className="font-black text-lg sm:text-2xl break-keep w-full">3. 비유 화법 (파이프라인 등) 사용</h4>
                        {renderScoreBadge(feedback.metaphorUsage.score)}
                    </div>
                    <p className="text-base sm:text-lg font-medium break-keep whitespace-pre-line leading-relaxed">{feedback.metaphorUsage.feedback}</p>
                </div>

                {/* Overall Advice */}
                <div className="bg-black text-white p-4 sm:p-6 neo-border hover:-translate-y-1 transition-transform border-4 shadow-[4px_4px_0_#neo-yellow] mt-2">
                    <h4 className="font-black text-xl sm:text-2xl text-neo-yellow mb-3">💡 총평 및 개선 아이디어</h4>
                    <p className="text-base sm:text-lg font-medium break-keep whitespace-pre-line leading-relaxed">{feedback.overallAdvice}</p>
                </div>
            </div>
        </div>
    );
}
