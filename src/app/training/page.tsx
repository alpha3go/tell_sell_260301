"use client";

import React, { useState, useEffect } from "react";
import PersonaSelector from "@/components/PersonaSelector";
import VoiceControls from "@/components/VoiceControls";
import ChatInterface, { Message } from "@/components/ChatInterface";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
// Removed useChat import

export default function TrainingPage() {
    const [step, setStep] = useState(1);

    const [relationship, setRelationship] = useState("stranger");
    const [personality, setPersonality] = useState("normal");

    const [interim, setInterim] = useState("");
    const { speak } = useSpeechSynthesis();

    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<'idle' | 'streaming'>('idle');

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
        setChatMessages(prev => [...prev, userMsg]);
        setStatus('streaming');

        const aiId = "ai_" + Date.now().toString();
        let aiMsgText = "";

        setChatMessages(prev => [...prev, { id: aiId, sender: 'ai', text: "" }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    relationship,
                    personality,
                    messages: [
                        ...chatMessages.map(m => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text
                        })),
                        { role: 'user', content: text }
                    ]
                })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                aiMsgText += decoder.decode(value, { stream: true });

                setChatMessages(prev => prev.map(m =>
                    m.id === aiId ? { ...m, text: aiMsgText } : m
                ));
            }

            // Output fully generated text to TTS
            speak(aiMsgText);

        } catch (error) {
            console.error(error);
        } finally {
            setStatus('idle');
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black font-sans p-6 sm:p-12 transition-all">
            <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black bg-neo-yellow text-black neo-border px-4 py-2 sm:px-6 sm:py-3 border-4 -rotate-1 sm:rotate-1 shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] text-center">
                    🏆 텔 앤 셀 트레이닝 <span className="block sm:inline text-lg sm:text-xl mt-1 sm:mt-0">[{step}/5 단계]</span>
                </h1>
                <a href="/" className="neo-btn bg-white text-black px-6 py-3 text-lg font-bold border-4">
                    ← 종료하기
                </a>
            </div>

            <div className="w-full max-w-4xl neo-card p-4 sm:p-8 bg-white dark:bg-zinc-900 border-4 relative overflow-hidden transition-all duration-300 min-h-[500px] sm:min-h-[600px] flex flex-col justify-between">
                <div>
                    {/* Step 1: Mindset */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in pb-8">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">1단계: 영업 마인드 세팅</div>
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-black mb-1 sm:mb-2 leading-tight bg-neo-yellow inline-block max-w-[100%] break-keep px-2">"우리는 파는 사람이 아니라 가치를 전하는 사람입니다."</h2>
                            <p className="text-base sm:text-xl mb-2 sm:mb-4 text-zinc-700 dark:text-zinc-300 font-medium">영업을 시작하기 전, 스스로 장착해야 할 4가지 마인드셋입니다.</p>

                            <div className="grid gap-6 mt-2">
                                <div className="p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h3 className="font-bold text-2xl text-neo-blue mb-2">💎 물건이 아닌 '가치'를 제공합니다</h3>
                                    <p className="text-lg mb-3">고객이 지불하는 돈보다 <span className="font-bold underline decoration-neo-pink decoration-4">더 큰 가치(건강, 미용, 경제적 이득)</span>를 돌려주는 일입니다.</p>
                                    <div className="bg-zinc-100 p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">💡 예시 상황</p>
                                        <p>단순히 화장품 하나를 파는 것이 아니라, "고객님의 푸석했던 피부를 생기 있게 만들어 잃어버린 자신감을 되찾아주는 일"이라고 생각하세요.</p>
                                    </div>
                                </div>

                                <div className="p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h3 className="font-bold text-2xl text-neo-blue mb-2">⏳ 시간과 노력(비용)의 절약</h3>
                                    <p className="text-lg mb-3">어차피 평생 써야 하는 생필품! 마트에서 고민하는 시간, 잘못된 제품을 사서 버리는 돈을 아껴주는 <span className="font-bold underline decoration-neo-pink decoration-4">합리적인 큐레이터</span>가 되어주세요.</p>
                                    <div className="bg-zinc-100 p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">💡 예시 상황</p>
                                        <p>"마트 가서 샴푸 어떤 거 살지 한참 고민하시죠? 게다가 비싸기만 하고 머릿결도 안 좋아지고요. 제가 딱 맞는 절대품질, 절대가격 제품으로 추천해 드릴 테니 시간 낭비, 돈 낭비 하지 마세요."</p>
                                    </div>
                                </div>

                                <div className="p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h3 className="font-bold text-2xl text-neo-blue mb-2">🤝 거절은 나를 향한 것이 아닙니다</h3>
                                    <p className="text-lg mb-3">오늘의 거절은 '나'에 대한 거절이 아니라 <span className="font-bold underline decoration-neo-pink decoration-4">단지 '오늘의 제안'에 대한 거절일 뿐</span>입니다.</p>
                                    <div className="bg-zinc-100 p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">💡 예시 상황</p>
                                        <p>상대방이 "나 화장품 안 필요해"라고 거절하더라도 상처받지 마세요. 좋은 관계를 맺어두면 나중에 치약이 떨어졌을 때, 혹은 다른 지인을 소개해 줄 때 나를 가장 먼저 떠올리게 됩니다.</p>
                                    </div>
                                </div>

                                <div className="p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h3 className="font-bold text-2xl text-neo-blue mb-2">🌱 함께 성장하는 든든한 전문가</h3>
                                    <p className="text-lg mb-3">나는 고객에게 아쉬운 소리를 하는 것이 아니라, 고객의 삶을 긍정적으로 바꿔주는 <span className="font-bold underline decoration-neo-pink decoration-4">전문가(도우미)</span>입니다.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Strategy (SPIN & Psychology) */}
                    {step === 2 && (
                        <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in overflow-y-auto max-h-[65vh] pb-8 pr-2 sm:pr-4">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">2단계: 말하기 전략 익히기</div>
                            <p className="text-base sm:text-xl text-zinc-700 dark:text-zinc-300 font-medium break-keep">영업 고수들이 무의식적으로 사용하는 질문의 기술과 심리적 무기 6가지를 배워보세요.</p>

                            <div className="bg-zinc-100 border-4 p-3 sm:p-5">
                                <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-4 bg-neo-yellow inline-block px-2 break-keep">세일즈 필수 4단계 공식 (SPIN 전략)</h2>
                                <p className="mb-4 text-lg">고객이 스스로 문제와 이득을 깨닫도록 가이드를 제시하는 전략입니다.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 border-4 bg-white shadow-[4px_4px_0_#000]">
                                        <div className="inline-block bg-zinc-200 font-bold px-2 py-1 mb-2">1단계</div>
                                        <h3 className="font-bold text-2xl">🤔 S (상황 파악 질문)</h3>
                                        <p className="mt-2 text-md text-zinc-600">고객의 현재 일상, 패턴, 사용 중인 제품에 대해 자연스럽게 물어봅니다.</p>
                                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400">
                                            <p className="font-bold text-blue-800">🗣 예시 말하기</p>
                                            <p className="italic">"선배님, 요즘 평소에 스킨이나 로션은 어떤 브랜드 주로 쓰세요?"</p>
                                        </div>
                                    </div>

                                    <div className="p-5 border-4 bg-white shadow-[4px_4px_0_#000]">
                                        <div className="inline-block bg-zinc-200 font-bold px-2 py-1 mb-2">2단계</div>
                                        <h3 className="font-bold text-2xl">🚨 P (문제 인식 질문)</h3>
                                        <p className="mt-2 text-md text-zinc-600">사용하면서 느꼈던 불편함이나 품질/가격 불만을 짚어줍니다.</p>
                                        <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400">
                                            <p className="font-bold text-red-800">🗣 예시 말하기</p>
                                            <p className="italic">"그 브랜드 비싸던데... 혹시 쓰시면서 너무 건조하다거나 가성비가 떨어져서 아쉬웠던 적은 없으셨어요?"</p>
                                        </div>
                                    </div>

                                    <div className="p-5 border-4 bg-white shadow-[4px_4px_0_#000]">
                                        <div className="inline-block bg-zinc-200 font-bold px-2 py-1 mb-2">3단계</div>
                                        <h3 className="font-bold text-2xl text-neo-pink">⚠️ I (시사: 손해/공포 강조)</h3>
                                        <p className="mt-2 text-md text-zinc-600">불만족을 그대로 방치할 경우 생기는 금전적, 심리적 손해를 일깨워줍니다.</p>
                                        <div className="mt-3 p-3 bg-pink-50 border-l-4 border-neo-pink">
                                            <p className="font-bold text-neo-pink">🗣 예시 말하기</p>
                                            <p className="italic">"만약 그 건조한 걸 계속 방치하면 나중에 주름 잡배고 피부과 시술에 수십, 수백만 원 깨져요. 비싼 걸 쓰는데 오히려 손해보고 계신 거예요."</p>
                                        </div>
                                    </div>

                                    <div className="p-5 border-4 bg-white shadow-[4px_4px_0_#000]">
                                        <div className="inline-block bg-zinc-200 font-bold px-2 py-1 mb-2">4단계</div>
                                        <h3 className="font-bold text-2xl text-neo-blue">✅ N (해결책: 이득 제시)</h3>
                                        <p className="mt-2 text-md text-zinc-600">내 제안(애터미)이 그 문제를 어떻게 완벽하게 해결해주는지 제시합니다.</p>
                                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-neo-blue">
                                            <p className="font-bold text-neo-blue">🗣 예시 말하기</p>
                                            <p className="italic">"차라리 백화점 성분 그대로 들어갔는데 마트 가격인 애터미 앰플로 싹 바꿔보세요. 피부과 갈 돈 아끼면서 홈쇼핑 퀄리티 누릴 수 있어요!"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 sm:mt-4">
                                <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-4 bg-neo-yellow inline-block px-2 break-keep">설득의 심리학 6가지 무기</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="p-4 border-4 bg-white">
                                        <h3 className="font-bold text-xl mb-1 mt-1">🎁 상호성의 법칙 (주면 받는다)</h3>
                                        <p className="text-zinc-600 mb-2">사람은 호의를 받으면 보답하려 합니다.</p>
                                        <p className="text-sm bg-zinc-100 p-2 italic">예: 샘플이나 사은품을 먼저 쥐어주며 체험하게 하기</p>
                                    </div>
                                    <div className="p-4 border-4 bg-white">
                                        <h3 className="font-bold text-xl mb-1 mt-1">⏳ 희소성의 법칙 (한정된 것에 끌림)</h3>
                                        <p className="text-zinc-600 mb-2">얼마 없을수록 가치있게 느낍니다.</p>
                                        <p className="text-sm bg-zinc-100 p-2 italic">예: "이거 이번 달 프로모션에만 나오는 특별 세트예요."</p>
                                    </div>
                                    <div className="p-4 border-4 bg-white">
                                        <h3 className="font-bold text-xl mb-1 mt-1">👀 사회 증명의 법칙 (다수의 선택)</h3>
                                        <p className="text-zinc-600 mb-2">남들이 많이 하는 것을 안전하다고 느낍니다.</p>
                                        <p className="text-sm bg-zinc-100 p-2 italic">예: "제 또래 엄마들은 거짓말 안 하고 이거 다 써요. 후기도 수백 개예요."</p>
                                    </div>
                                    <div className="p-4 border-4 bg-white">
                                        <h3 className="font-bold text-xl mb-1 mt-1">👑 권위의 법칙 (전문가의 한 마디)</h3>
                                        <p className="text-zinc-600 mb-2">지위, 권위자의 말에 복종하는 심리입니다.</p>
                                        <p className="text-sm bg-zinc-100 p-2 italic">예: "이건 한국콜마 원자력연구원에서 10년 연구해서 특허받은 기술력이에요."</p>
                                    </div>
                                    <div className="p-4 border-4 bg-white">
                                        <h3 className="font-bold text-xl mb-1 mt-1">❤️ 호감의 법칙 (공감대 형성)</h3>
                                        <p className="text-zinc-600 mb-2">친근한 사람, 칭찬하는 사람의 부탁은 거절하기 힘듭니다.</p>
                                        <p className="text-sm bg-zinc-100 p-2 italic">예: "머리 새로 하셨어요? 진짜 잘 어울리세요! (칭찬하며 마음 열기)"</p>
                                    </div>
                                    <div className="p-4 border-4 bg-white">
                                        <h3 className="font-bold text-xl mb-1 mt-1">🔗 일관성의 법칙 (작은 약속부터)</h3>
                                        <p className="text-zinc-600 mb-2">작은 승낙을 한 사람은 큰 제안도 쉽게 승낙합니다.</p>
                                        <p className="text-sm bg-zinc-100 p-2 italic">예: 처음부터 수십만 원짜리 세트가 아니라 "딱 3천원짜리 치약 하나만 써보세요(미끼/로볼 상품)"로 시작하기</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neo-pink border-4 p-4 sm:p-5 shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] text-base sm:text-xl font-bold leading-relaxed text-white break-keep mt-4">
                                💡 실전 요약: 문제 제기(공포) → 해결책 제시(기대) → 증명(후기) → 앵커링(타사 대비 가성비) → 미끼 상품(쉬운 승낙) 순으로 실전에 적용해보세요!
                            </div>
                        </div>
                    )}

                    {/* Step 3: Persona Selection */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">3단계: 연습 상대방 설정하기</div>
                            <p className="text-base sm:text-xl break-keep">오늘 상대해 볼 고객의 관계와 성격을 선택해주세요.</p>

                            <div className="flex flex-col gap-8 mt-2">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 bg-neo-yellow inline-block px-2 border-4 shadow-[4px_4px_0_#000]">1. 나와의 관계</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button onClick={() => setRelationship('stranger')} className={`p-6 border-4 text-left font-bold text-xl transition ${relationship === 'stranger' ? 'bg-neo-pink text-white -translate-y-1 shadow-[6px_6px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[4px_4px_0_#000]'}`}>
                                            🤝 처음 만나는 사람
                                            <p className={`font-normal text-lg mt-2 ${relationship === 'stranger' ? 'text-pink-100' : 'text-zinc-600'}`}>"어색하고 방어적입니다."</p>
                                        </button>
                                        <button onClick={() => setRelationship('acquaintance')} className={`p-6 border-4 text-left font-bold text-xl transition ${relationship === 'acquaintance' ? 'bg-neo-pink text-white -translate-y-1 shadow-[6px_6px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[4px_4px_0_#000]'}`}>
                                            👋 알고 지내던 지인
                                            <p className={`font-normal text-lg mt-2 ${relationship === 'acquaintance' ? 'text-pink-100' : 'text-zinc-600'}`}>"친근하지만 영업은 거절합니다."</p>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-4 bg-neo-yellow inline-block px-2 border-4 shadow-[4px_4px_0_#000]">2. 고객의 성격</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button onClick={() => setPersonality('normal')} className={`p-6 border-4 text-left font-bold text-xl transition ${personality === 'normal' ? 'bg-neo-blue text-white -translate-y-1 shadow-[6px_6px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[4px_4px_0_#000]'}`}>
                                            🙂 평범하고 친절한 성격
                                            <p className={`font-normal text-lg mt-2 ${personality === 'normal' ? 'text-blue-100' : 'text-zinc-600'}`}>"이야기는 잘 들어줍니다."</p>
                                        </button>
                                        <button onClick={() => setPersonality('skeptical')} className={`p-6 border-4 text-left font-bold text-xl transition ${personality === 'skeptical' ? 'bg-neo-blue text-white -translate-y-1 shadow-[6px_6px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[4px_4px_0_#000]'}`}>
                                            🧐 예민하고 까탈스러운 평
                                            <p className={`font-normal text-lg mt-2 ${personality === 'skeptical' ? 'text-blue-100' : 'text-zinc-600'}`}>"의심이 많고 꼬치꼬치 묻습니다."</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: AI Voice Chat */}
                    {step === 4 && (
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 animate-fade-in w-full h-full">
                            <div className="flex-1 w-full flex flex-col items-center">
                                <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] w-full mb-4 sm:mb-6">4단계: 실전 대화 연습</div>
                                <VoiceControls
                                    onInterim={setInterim}
                                    onNewMessage={(text) => sendMessage(text)}
                                    triggerAIResponse={() => { }} // Now handled by AI SDK automatically via sendMessage()
                                />
                                {status === 'streaming' && <p className="mt-4 font-bold text-neo-pink text-sm sm:text-xl animate-pulse">AI가 응답을 준비하고 있습니다...</p>}
                            </div>
                            <div className="flex-1 w-full">
                                <ChatInterface messages={chatMessages} interimTranscript={interim} />
                            </div>
                        </div>
                    )}

                    {/* Step 5: Feedback */}
                    {step === 5 && (
                        <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in h-full">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">5단계: 훈련 피드백</div>
                            <p className="text-base sm:text-xl break-keep">수고하셨습니다! 방금 진행한 대화에 대한 피드백입니다.</p>
                            <FeedbackPanel />
                        </div>
                    )}
                </div>

                {/* Wizard Navigation Controls */}
                <div className="mt-8 sm:mt-12 flex justify-between border-t-4 pt-4 sm:pt-6 gap-2">
                    {step > 1 ? (
                        <button onClick={prevStep} className="neo-btn bg-white text-black px-4 py-2 sm:px-6 sm:py-3 font-bold text-sm sm:text-xl border-4">
                            이전 단계
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 5 ? (
                        <button onClick={nextStep} className="neo-btn bg-black text-white px-4 py-2 sm:px-8 sm:py-3 font-bold text-lg sm:text-2xl border-4 shadow-[3px_3px_0_#neo-yellow] hover:shadow-[1px_1px_0_#neo-yellow] sm:shadow-[4px_4px_0_#neo-yellow] sm:hover:shadow-[2px_2px_0_#neo-yellow] active:shadow-none hover:bg-zinc-800 focus:outline-none">
                            다음 단계 →
                        </button>
                    ) : (
                        <button onClick={() => { setStep(1); /* Reset messages if needed, useChat handles its own state */ }} className="neo-btn bg-neo-pink text-black px-4 py-2 sm:px-8 sm:py-3 font-bold text-lg sm:text-2xl border-4 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] active:shadow-none break-keep flex flex-col sm:flex-row items-center justify-center">
                            <span>다시 훈련하기</span><span className="ml-1">🔄</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
