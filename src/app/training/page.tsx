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

    const [scenario, setScenario] = useState("A");
    const [persona, setPersona] = useState("1");

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
                    scenario,
                    persona,
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
                    {/* Step 1: Psychology & Behavioral Economics */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in pb-8">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">1단계: 고객의 마음을 여는 4가지 마음의 법칙 & 실수 활용법</div>
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-black mb-1 sm:mb-2 leading-tight bg-neo-yellow inline-block max-w-[100%] break-keep px-2">"사람은 누구나 마음의 지름길을 사용해 결정을 내립니다."</h2>
                            <p className="text-base sm:text-xl mb-2 sm:mb-4 text-zinc-700 dark:text-zinc-300 font-medium break-keep">이 지름길을 알면 거절당할 두려움이 줄고, 자연스럽게 '네'라는 답을 듣게 됩니다.</p>

                            {/* Part 1 */}
                            <h3 className="text-2xl sm:text-3xl font-black mt-4 bg-black text-white px-4 py-2 inline-block shadow-[4px_4px_0_#neo-yellow]">💡 설득 심리학 4가지 법칙</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2">
                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-neo-blue mb-2">🎁 보답의 법칙 (호혜성)</h4>
                                    <p className="text-base sm:text-lg mb-3">사람은 받은 호의를 돌려주고 싶어합니다.</p>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">👉 애터미 실전 적용</p>
                                        <p className="text-sm sm:text-base mt-1">건강에 좋은 간단한 정보나 작은 샘플을 드립니다. "가입비/유지비가 없는 것" 자체가 큰 호의이며, 고객님은 고마워서 다시 사게 됩니다.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-neo-blue mb-2">👥 주변 따라하기 (사회적 증거)</h4>
                                    <p className="text-base sm:text-lg mb-3">불확실할 땐 많은 사람이 가는 쪽을 따릅니다.</p>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">👉 애터미 실전 적용</p>
                                        <p className="text-sm sm:text-base mt-1">석세스 아카데미나 세미나에 함께 가보자고 초대합니다. 수천 명이 박수 치는 모습을 보면 "이 길이 안전하구나" 하고 마음이 움직입니다.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-neo-blue mb-2">👑 권위의 법칙</h4>
                                    <p className="text-base sm:text-lg mb-3">믿을 만한 전문가의 말은 잘 믿게 됩니다.</p>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">👉 애터미 실전 적용</p>
                                        <p className="text-sm sm:text-base mt-1">한국원자력연구원과 콜마BNH가 만든 기술, 해모힘의 임상 결과를 공유하세요. 본인 스스로 깔끔한 옷차림으로 전문가처럼 보여야 합니다.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-neo-blue mb-2">🔗 일관성의 법칙</h4>
                                    <p className="text-base sm:text-lg mb-3">작은 약속부터 지키면 큰 일도 하게 됩니다.</p>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">👉 애터미 실전 적용</p>
                                        <p className="text-sm sm:text-base mt-1">"제품 한번 써보시고 짧은 후기만 공유해주세요." 작은 참여가 쌓이다 보면 자연스럽게 사업 이야기도 듣게 됩니다.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Part 2 */}
                            <h3 className="text-2xl sm:text-3xl font-black mt-8 bg-black text-white px-4 py-2 inline-block shadow-[4px_4px_0_#neo-yellow]">💡 행동경제학 4가지 기술</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2">
                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-red-600 mb-2">💸 손해 보는 게 더 아픈 마음 (손실 회피)</h4>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-red-600">
                                        <p className="font-bold text-neo-pink">👉 이렇게 말해보세요</p>
                                        <p className="text-sm sm:text-base mt-1 font-bold">"지금 이 제품으로 바꾸지 않으면 매달 5만 원씩 계속 손해 보는 셈입니다!"</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-neo-blue mb-2">⚓ 처음 가격이 기준! (기준점 효과)</h4>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-neo-blue">
                                        <p className="font-bold text-neo-pink">👉 이렇게 말해보세요</p>
                                        <p className="text-sm sm:text-base mt-1">"백화점 비슷한 스킨케어는 20~30만원 하죠?" 먼저 비싼 가격을 말한 뒤 애터미 절대가격을 말하면 극강의 가성비로 느껴집니다.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-green-600 mb-2">🤔 선택지가 너무 많으면 포기합니다</h4>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-green-600">
                                        <p className="font-bold text-neo-pink">👉 집중 추천 전략</p>
                                        <p className="text-sm sm:text-base mt-1">100가지를 나열하지 말고 고객 상황에 맞춰 <span className="font-bold">해모힘, 화장품 등 2~3가지만 집중 추천</span>하여 피로를 줄여주세요.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border-4 bg-white shadow-[4px_4px_0_#000]">
                                    <h4 className="font-bold text-xl sm:text-2xl text-purple-600 mb-2">🎢 절정과 마지막이 기억에 남습니다</h4>
                                    <div className="bg-zinc-100 p-3 sm:p-4 border-l-4 border-purple-600">
                                        <p className="font-bold text-neo-pink">👉 피크-앤드 법칙</p>
                                        <p className="text-sm sm:text-base mt-1">강렬한 전/후 사진을 중간에 꼭 보여주고, 시연 끝에는 "함께 잘 살아보자"는 따뜻한 진심 어린 격려로 마무리하세요.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Success Stories & System */}
                    {step === 2 && (
                        <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in overflow-y-auto max-h-[65vh] pb-8 pr-2 sm:pr-4">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">2단계: 성공 리더들의 진짜 이야기 & 시스템 복제</div>
                            <p className="text-base sm:text-xl text-zinc-700 dark:text-zinc-300 font-medium break-keep">가장 큰 울림을 주는 극복 스토리와, 누구나 따라 할 수 있는 성공 파이프라인(8 CORE)입니다.</p>

                            {/* Part 3 */}
                            <h3 className="text-2xl sm:text-3xl font-black mt-4 bg-black text-white px-4 py-2 inline-block shadow-[4px_4px_0_#neo-yellow]">💡 실제 성공한 선배님들의 이야기</h3>
                            <div className="flex flex-col gap-4 mt-2">
                                <div className="p-4 sm:p-5 border-4 bg-white shadow-[4px_4px_0_#000] flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="bg-neo-blue text-white font-black text-2xl w-12 h-12 flex items-center justify-center shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-xl sm:text-2xl mb-2">이덕우 임페리얼마스터 <span className="text-neo-blue text-lg">"성공하지 못하면 기적이다"</span></h4>
                                        <p className="text-zinc-700 text-sm sm:text-base leading-relaxed break-keep">
                                            17년간 타 다단계에서 5번 실패해 신용불량자가 되고 비닐하우스에 살던 그는, 애터미를 만나 <span className="font-bold bg-yellow-100 px-1">가입비/유지비 없는 회사에 대한 엄청난 감사함</span>과 거절을 이겨내는 힘으로 임페리얼마스터가 되었습니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 border-4 bg-white shadow-[4px_4px_0_#000] flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="bg-neo-pink text-black border-4 border-black font-black text-2xl w-12 h-12 flex items-center justify-center shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-xl sm:text-2xl mb-2">김연숙 임페리얼마스터 <span className="text-neo-pink text-lg">"철저한 제품 애용"</span></h4>
                                        <p className="text-zinc-700 text-sm sm:text-base leading-relaxed break-keep">
                                            IMF 때 30만 원짜리 월세방에서 쫓겨나던 시절, "그 얼굴로 화장품을 팔겠냐"는 핀잔에 충격을 받아 스스로 철저하게 화장품을 애용했습니다. <span className="font-bold bg-pink-100 px-1">피부가 눈에 띄게 좋아지자 제품은 저절로 퍼져나갔습니다.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 border-4 bg-white shadow-[4px_4px_0_#000] flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="bg-neo-yellow text-black border-4 border-black font-black text-2xl w-12 h-12 flex items-center justify-center shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-xl sm:text-2xl mb-2">박정수 임페리얼마스터 <span className="text-yellow-600 text-lg">"장점만을 보는 리더십"</span></h4>
                                        <p className="text-zinc-700 text-sm sm:text-base leading-relaxed break-keep">
                                            최초의 임페리얼마스터인 그녀는 파트너십의 비결로 '장점 보기'를 꼽습니다. "애터미는 사람 관계 사업이다. <span className="font-bold bg-yellow-100 px-1">상대의 재능을 인정하면 조직이 폭발적으로 커진다</span>"며 시스템 합류를 강조합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Part 4 & 5 */}
                            <h3 className="text-2xl sm:text-3xl font-black mt-8 bg-black text-white px-4 py-2 inline-block shadow-[4px_4px_0_#neo-yellow]">💡 성공을 복제하는 8 CORE 행동 습관</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <ul className="list-disc pl-5 space-y-2 text-base sm:text-lg font-bold border-4 bg-zinc-50 p-4 sm:p-6 shadow-[4px_4px_0_#000]">
                                    <li>📖 15분 성공 책 읽기</li>
                                    <li>📺 성공 VOD 시청하기</li>
                                    <li>🧑‍🤝‍🧑 미팅이나 세미나 참석</li>
                                    <li>💄 제품 100% 직접 애용하기</li>
                                </ul>
                                <ul className="list-disc pl-5 space-y-2 text-base sm:text-lg font-bold border-4 bg-zinc-50 p-4 sm:p-6 shadow-[4px_4px_0_#000]">
                                    <li>🗣️ 꾸준한 사업 설명(STP) 연습</li>
                                    <li>🎁 매일 주변에 제품 전달하기</li>
                                    <li>🤝 스폰서와 정기적 상담하기</li>
                                    <li>😊 파트너와 신뢰(미소/칭찬) 쌓기</li>
                                </ul>
                            </div>

                            <div className="bg-neo-pink border-4 p-4 sm:p-5 shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] text-base sm:text-xl font-bold leading-relaxed text-white break-keep mt-4">
                                💡 2025 마케팅 트렌드: 고객 구매 주기에 맞춰 섬세하게 안부 문자를 주거나, "내가 직접 써보고 좋아진" 진정성 있는 1분 릴스(숏폼) 영상을 공유해보세요!
                            </div>
                        </div>
                    )}

                    {/* Step 3: Scenario & Persona Selection */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in overflow-y-auto max-h-[65vh] pb-8 pr-2 sm:pr-4">
                            <div className="bg-neo-blue text-white px-3 py-1 sm:px-4 sm:py-2 border-4 text-lg sm:text-2xl font-bold w-max shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">3단계: 실전 시나리오 & 페르소나 설정</div>
                            <p className="text-base sm:text-xl break-keep">실제 현장에서 가장 자주 만나는 8가지 고객 유형과 4가지 상황 중 하나를 선택하세요.</p>

                            <div className="flex flex-col gap-8 mt-2">
                                {/* Scenarios */}
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-neo-yellow inline-block px-2 border-4 shadow-[4px_4px_0_#000]">🎯 실전 훈련 시나리오 (4가지)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <button onClick={() => setScenario('A')} className={`p-4 border-4 text-left font-bold transition ${scenario === 'A' ? 'bg-neo-pink text-white -translate-y-1 shadow-[4px_4px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0_#000]'}`}>
                                            <span className="text-lg">A. 안부 인사 및 초대 (콜드/웜)</span>
                                            <p className={`font-normal text-sm mt-1 ${scenario === 'A' ? 'text-pink-100' : 'text-zinc-600'}`}>부담 없이 궁금증 유발 & 세미나/초대 연결</p>
                                        </button>
                                        <button onClick={() => setScenario('B')} className={`p-4 border-4 text-left font-bold transition ${scenario === 'B' ? 'bg-neo-blue text-white -translate-y-1 shadow-[4px_4px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0_#000]'}`}>
                                            <span className="text-lg">B. 제품 판매 (STP-Product)</span>
                                            <p className={`font-normal text-sm mt-1 ${scenario === 'B' ? 'text-blue-100' : 'text-zinc-600'}`}>기능 나열이 아닌 '삶의 혜택' 중심으로 추천</p>
                                        </button>
                                        <button onClick={() => setScenario('C')} className={`p-4 border-4 text-left font-bold transition ${scenario === 'C' ? 'bg-neo-green text-black -translate-y-1 shadow-[4px_4px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0_#000]'}`}>
                                            <span className="text-lg">C. 보상 플랜 비전 제시 (STP-Plan)</span>
                                            <p className={`font-normal text-sm mt-1 ${scenario === 'C' ? 'text-zinc-800' : 'text-zinc-600'}`}>비즈니스 소득(파이프라인)과 시스템 비전 전달</p>
                                        </button>
                                        <button onClick={() => setScenario('D')} className={`p-4 border-4 text-left font-bold transition ${scenario === 'D' ? 'bg-neo-yellow text-black -translate-y-1 shadow-[4px_4px_0_#000]' : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0_#000]'}`}>
                                            <span className="text-lg">D. 클로징 및 거절 처리</span>
                                            <p className={`font-normal text-sm mt-1 ${scenario === 'D' ? 'text-zinc-800' : 'text-zinc-600'}`}>"생각해볼게요" 거절의 진짜 이유 듣고 확신 주기</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Personas */}
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-neo-yellow inline-block px-2 border-4 shadow-[4px_4px_0_#000]">👥 네트워크 마케팅 8대 상대방 유형</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        {[
                                            { id: '1', title: "보상플랜 분석가형", desc: "수익구조/성분 꼬치꼬치 캐묻는 깐깐한 타잎", color: "bg-black text-white" },
                                            { id: '2', title: "다단계 편견/회의형", desc: "'민폐 끼치는 거 싫어요' 방어적이고 냉소적임", color: "bg-neo-pink text-white" },
                                            { id: '3', title: "우유부단/자신감부족형", desc: "'좋은 건 알겠는데 제가 영업 체질이 아니라서'", color: "bg-neo-blue text-white" },
                                            { id: '4', title: "과거 실패 상처형", desc: "예전에 타사에서 재고 떠안은 실패 경험 있음", color: "bg-orange-500 text-white" },
                                            { id: '5', title: "매니아 소비자형", desc: "'저는 폰팔이 안해요, 그냥 제품만 쓸게요'", color: "bg-green-600 text-white" },
                                            { id: '6', title: "꿈이 큰 야심형 (2030)", desc: "'빨리 경제적 자유!' 차/집/여행에 관심 많은 MZ", color: "bg-neo-yellow text-black" },
                                            { id: '7', title: "예산 민감 현실주의자", desc: "'초기 비용 없나요? 리스크 있는 거 아니죠?'", color: "bg-zinc-600 text-white" },
                                            { id: '8', title: "게이트키퍼 (배우자/절친)", desc: "'너 또 이상한 거 하냐?' '남편한테 허락받을게'", color: "bg-purple-600 text-white" },
                                        ].map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => setPersona(p.id)}
                                                className={`p-4 border-4 text-left font-bold transition flex flex-col justify-between h-full ${persona === p.id ? `${p.color} -translate-y-1 shadow-[4px_4px_0_#000]` : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0_#000]'}`}
                                            >
                                                <span className="text-base sm:text-lg">{p.id}. {p.title}</span>
                                                <p className={`font-normal text-sm mt-2 opacity-90`}>{p.desc}</p>
                                            </button>
                                        ))}
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
                            <FeedbackPanel chatMessages={chatMessages} />
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
