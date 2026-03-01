"use client";

import React from "react";

export default function FeedbackPanel() {
    return (
        <div className="w-full neo-card bg-neo-blue text-white p-6 sm:p-8 relative h-full border-4 shadow-[8px_8px_0_#000]">
            <div className="absolute top-0 right-0 bg-neo-yellow text-black neo-border px-5 py-2 -mt-4 mr-6 shadow-[4px_4px_0_#000]">
                <h3 className="text-xl sm:text-2xl font-black">🎯 AI 코치의 조언</h3>
            </div>

            <div className="mt-8 flex flex-col gap-6">
                <div className="bg-white text-black p-5 neo-border hover:-translate-y-1 transition-transform border-4">
                    <h4 className="font-black text-xl sm:text-2xl border-b-4 border-black pb-2 mb-3">1. 질문하기</h4>
                    <p className="text-lg sm:text-xl font-medium break-keep">고객의 현재 상황을 잘 물어보셨네요! 아주 좋습니다.</p>
                </div>

                <div className="bg-white text-black p-5 neo-border hover:-translate-y-1 transition-transform border-4">
                    <h4 className="font-black text-xl sm:text-2xl border-b-4 border-black pb-2 mb-3 text-neo-pink">2. 문제찾기</h4>
                    <p className="text-lg sm:text-xl font-medium break-keep">현재 쓰고 있는 화장품의 &apos;불편한 점&apos;을 놓치셨어요. 다시 한번 물어보세요!</p>
                </div>

                <div className="bg-white text-black p-5 neo-border hover:-translate-y-1 transition-transform border-4 opacity-70">
                    <h4 className="font-black text-xl sm:text-2xl border-b-4 border-black pb-2 mb-3">3. 필요성</h4>
                    <p className="text-lg sm:text-xl font-medium break-keep italic">대화가 조금 더 필요해요...</p>
                </div>
            </div>
        </div>
    );
}
