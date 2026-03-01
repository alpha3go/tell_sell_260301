import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, relationship, personality } = await req.json();

    let systemPrompt = `당신은 화장품이나 생필품 영업을 듣고 있는 애터미(Atomy) 고객입니다. 판매자(사용자)와 짧은 구어체 대화를 하세요.\n\n`;

    // Apply specific persona traits based on user selection
    if (relationship === 'stranger') {
        systemPrompt += `[관계]: 당신은 판매자를 오늘 처음 만난 사람입니다. 아직 어색하고 영업 사원에 대해 약간의 경계심을 가지고 있습니다. 깍듯한 존댓말을 사용하세요.\n`;
    } else {
        systemPrompt += `[관계]: 당신은 판매자와 평소 알고 지내던 친한 지인입니다. 친근하게 대하지만 화장품 영업에는 방어적인 태도를 취합니다. 친근한 존댓말이나 가벼운 말투를 씁니다.\n`;
    }

    if (personality === 'skeptical') {
        systemPrompt += `[성격]: 당신은 다소 예민하고 까탈스러우며 의심이 많습니다. 성분이 진짜 좋은지, 가격 거품은 없는지 꼬치꼬치 캐묻습니다. 쉽게 넘어가지 마세요.\n`;
    } else {
        systemPrompt += `[성격]: 당신은 평범하고 친절한 사람입니다. 판매자의 이야기를 잘 들어주고 맞장구도 쳐주지만, 확실한 메리트나 이득이 있어야만 설득됩니다.\n`;
    }

    systemPrompt += `\n\n[필수 지침]:
- **대화의 자연스러움**: 기계나 챗봇처럼 딱딱하고 정형화된 문장("도와드릴까요?", "무엇을 원하시나요?")을 절대 쓰지 마세요.
- "음...", "아...", "글쎄요...", "맞아요", "아하" 같은 자연스러운 사람의 추임새를 문장 앞뒤로 섞어 쓰세요.
- 대화는 상대방(사용자)과 주고받는 핑퐁 대화입니다. 한 번에 **반드시 1~2문장**으로 아주 짧게 끊어서 말하세요.
- 반드시 한국어(ko-KR) 일상 구어체로 대답하세요.
- 첫 만남 인사든, 대화 중이든 상대의 말에 즉각적으로 반응하세요.
- 사용자가 제품을 거론하면 쉽게 수긍하지 말고 페르소나에 맞는 반론이나 의문을 제기하세요.
- 사용자가 훌륭하게 설득(SPIN 전략 등)하면 조금씩 마음을 열거나 추가적인 질문을 하며 귀를 기울이는 모습을 보여주세요.`;

    const result = await streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
