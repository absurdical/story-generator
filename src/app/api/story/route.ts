import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storyTypeDescriptions: Record<string, string> = {
  Fairytale: "magical settings, royalty, good vs evil, whimsical characters, and a happy or moral ending",
  Mystery: "a puzzling event, investigation, clues, suspense, and surprising revelations",
  Adventure: "action, exploration, danger, and excitement in exotic or unknown settings",
  SciFi: "futuristic technology, space, time travel, or speculative ideas, often exploring big questions",
};

const modeDescriptions: Record<string, string> = {
  kids: "The story is for a child audience, ages 2–5. Keep it light, friendly, imaginative, and appropriate.",
  adult: "Embrace your inner Tarantino — the story can have dark humor, edgy twists, and mature themes.",
};

export async function POST(req: Request) {
  const { storyType, person, place, thing, previous, mode, actNumber } = await req.json();

  const prompt = `
You are a storyteller writing Act ${actNumber} of a 3-act story.

Story so far:
${previous || '---'}

This is Act ${actNumber}/3.
This is a ${storyType} story, which typically involves: ${storyTypeDescriptions[storyType]}.
${modeDescriptions[mode]}

Feature a ${person}, at a ${place}, with a ${thing}.
Write 2–3 engaging paragraphs that continue the narrative from the previous acts.
If this is Act 3/3, make sure to resolve the story and end it satisfyingly.
`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  const content = chat.choices[0].message.content;

  return NextResponse.json({ story: content });
}
