import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = await req.json(); // Default Voice

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2', // Multilingual model supports Korean naturally
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('ElevenLabs API error response:', errText);
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        console.error('TTS Route Error:', error);
        return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }
}
