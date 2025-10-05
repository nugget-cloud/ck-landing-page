import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('Gemini API Key Loaded:', !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const schema = `kepid,kepoi_name,kepler_name,koi_disposition,koi_pdisposition,koi_score,koi_fpflag_nt,koi_fpflag_ss,koi_fpflag_co,koi_fpflag_ec,koi_period,koi_period_err1,koi_period_err2,koi_time0bk,koi_time0bk_err1,koi_time0bk_err2,koi_impact,koi_impact_err1,koi_impact_err2,koi_duration,koi_duration_err1,koi_duration_err2,koi_depth,koi_depth_err1,koi_depth_err2,koi_prad,koi_prad_err1,koi_prad_err2,koi_teq,koi_teq_err1,koi_teq_err2,koi_insol,koi_insol_err1,koi_insol_err2,koi_model_snr,koi_tce_plnt_num,koi_tce_delivname,koi_steff,koi_steff_err1,koi_steff_err2,koi_slogg,koi_slogg_err1,koi_slogg_err2,koi_srad,koi_srad_err1,koi_srad_err2,ra,dec,koi_kepmag`;

export async function POST(req) {
  try {
    const { message, context } = await req.json();

    // 🧠 Different prompt styles based on tab context
    let prompt = '';

    if (context === 'stats') {
      prompt = `
You are an AI Exoplanet Statistical Analyst.
Your role is to interpret scientific datasets like NASA Kepler, TESS, or confirmed exoplanets data.
The user will ask questions related to patterns, trends, or statistics about exoplanets.
User can ask for playful queries like "Tell me a joke about exoplanets" or "What's a fun fact about exoplanets?"

Your response must:
- Include meaningful numeric summaries (counts, means, ratios, etc.)
- Be concise and factual.
- Use plain English and avoid unnecessary markdown or symbols.
- Avoid hallucination; answer only based on known astronomy facts or datasets.
- When you feel the query is not complete, give the skeleton query in what you think the user is trying to ask.

User Query: ${message}
`;
    }
    else if (context === 'query') { 
prompt = `
You are an AI Exoplanet Statistical Analyst.
Your role is to interpret scientific datasets like NASA Kepler, TESS, or confirmed exoplanets data.
The user will ask questions related to patterns, trends, or statistics about exoplanets.
Your task is to build a SQL Query based on the user's request with the schema below:
Your response must:
- Analyze whether the user query can be answered with the given schema.
- You can use angular coordinates (ra, dec) for spatial/distance queries.
- If yes, construct a SQL query to retrieve the relevant data.
- If no, respond with "Cannot be answered with a SQL Query, try shifting to other chat modes"
- Be concise and factual.
- When used angular coordinates (ra, dec), use the Haversine formula to calculate distances and also mention that you are using this formula to caluclate.
- Use plain English and avoid unnecessary markdown or symbols.
- Avoid hallucination; answer only based on known astronomy facts or datasets.

User Query: ${message}
Schema: ${schema}
`;
    } 
    else {
      // default or 'chat'
      prompt = `
You are Space Port, an AI Assistant specialized in exoplanet exploration and NASA data.
You help users understand datasets, detection methods, discoveries, and research.
If the user asks for:
- Dataset details → explain columns and attributes.
- Astronomical terms → define simply.
- General queries → respond naturally with educational tone.
- Unrelated queries → politely refuse and redirect to exoplanet context.

Keep your response conversational, plain text only.

User Query: ${message}
`;
    }

    console.log('Active Context:', context);
    console.log('Prompt Sent to Gemini:\n', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('Gemini Response:', responseText);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}
