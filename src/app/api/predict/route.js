
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const pythonScript = path.join(process.cwd(), 'src', 'python', 'predict.py');
    const scriptArgs = [JSON.stringify(data)];
    const pythonProcess = spawn('python3', [pythonScript, ...scriptArgs]);
    let predictionResult = '';
    let error = '';

    for await (const chunk of pythonProcess.stdout) {
      predictionResult += chunk.toString();
    }

    for await (const chunk of pythonProcess.stderr) {
      error += chunk.toString();
    }

    const exitCode = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });

    if (exitCode !== 0) {
      console.error(`Python script error: ${error}`);
      return NextResponse.json({ error: 'Failed to make prediction.', details: error }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(predictionResult));

  } catch (e) {
    console.error(`API error: ${e}`);
    return NextResponse.json({ error: 'An unexpected error occurred.', details: e.message }, { status: 500 });
  }
}
