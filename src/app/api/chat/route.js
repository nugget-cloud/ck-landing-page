import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(req) {
  try {
    const { message } = await req.json();

    const prompt = `
Consider the user query relating it to Exoplanets datasets such as Kepler or TESS.
Analyze the question and:
- If tabular data is requested, summarize parameters in a table.
- Otherwise, answer in clear sentences.
- If unrelated, return a polite guardrail message.

User Query: ${message}
`;

    console.log('Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('Response:', responseText);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}
