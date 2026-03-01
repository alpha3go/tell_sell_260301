import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
        return Response.json({ error: "No messages to analyze" }, { status: 400 });
    }

    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
            objectionHandling: z.object({
                score: z.number().min(0).max(100),
                feedback: z.string(),
            }),
            empathyRatio: z.object({
                score: z.number().min(0).max(100),
                feedback: z.string(),
            }),
            metaphorUsage: z.object({
                score: z.number().min(0).max(100),
                feedback: z.string(),
            }),
            overallAdvice: z.string(),
        }),
        system: `당신은 애터미(Atomy) 네트워크 마케팅 세일즈 코치입니다. 사용자와 가상 고객 간의 대화 기록을 분석하여 다음 3가지 핵심 포인트를 기준으로 세심하고 디테일하게 평가해주세요.

1. '다단계' 언급 시 대처 능력 (objectionHandling): 사용자가 당황하지 않고 법적 근거, 합법적 유통의 본질(무자본/무유지비 등)을 잘 설명했는지 체크합니다. 만약 대화에 거절이나 다단계 언급이 없었다면 일반적인 거절 처리나 매끄러운 진행 능력을 평가하세요.
2. 공감 및 경청 비중 (empathyRatio): 일방적인 Pitching만 하지 않았는지, 질문을 통해 상대방의 니즈를 파악하고 공감했는지 분석합니다.
3. 비유 화법 사용 여부 (metaphorUsage): 파이프라인, 프랜차이즈, 플랫폼 비즈니스 등 네트워크 마케팅의 본질을 쉽게 설명하는 비유를 썼는지 평가합니다.

피드백은 반드시 **한국어 일상 구어체**로 부드럽고 꼼꼼하게 작성해주세요. 각 항목별로 0~100점의 점수(score)와 1~3문장의 구체적인 조언(feedback)을 제공하세요.`,
        messages: [
            ...messages,
            { role: "user", content: "이 대화를 바탕으로 나의 세일즈 코칭 피드백을 제공해줘." }
        ],
    });

    return Response.json(object);
}
