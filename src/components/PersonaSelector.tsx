"use client";

import React, { useState } from "react";

export interface Persona {
    id: string;
    name: string;
    description: string;
    color: string;
}

const personas: Persona[] = [
    {
        id: "angry",
        name: "😠 화난 고객",
        description: "현재 쓰는 제품에 불만이 많음.",
        color: "bg-neo-pink",
    },
    {
        id: "skeptical",
        name: "🤔 의심하는 고객",
        description: "진짜 효과가 있는지 계속 따짐.",
        color: "bg-neo-blue text-white",
    },
    {
        id: "budget",
        name: "💸 돈이 없다는 고객",
        description: "제품은 좋지만 당장 살 돈이 없음.",
        color: "bg-neo-yellow text-black",
    }
];

export default function PersonaSelector() {
    const [selected, setSelected] = useState<string>("angry");

    return (
        <div className="w-full">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="bg-white neo-border px-3 py-1 text-lg">1단계</span> 상대방 선택하기
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {personas.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelected(p.id)}
                        className={`neo-card p-5 text-left transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] border-4 ${selected === p.id ? `${p.color} border-black translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0_#000]` : "bg-white"
                            }`}
                    >
                        <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                        <p className="text-lg font-medium opacity-90 break-keep">{p.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
