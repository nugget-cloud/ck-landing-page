import { NextResponse } from 'next/server';
import huggingFaceService from '../../../lib/huggingface.js';

export async function GET() {
  try {
    // Check environment variables
    const hasApiKey = !!process.env.HUGGING_FACE_API_KEY;
    const hasModelId = !!process.env.HUGGING_FACE_MODEL_ID;
    
    if (!hasApiKey || !hasModelId) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing Hugging Face configuration',
        config: {
          hasApiKey,
          hasModelId,
          modelId: process.env.HUGGING_FACE_MODEL_ID || 'not-set'
        }
      }, { status: 500 });
    }

    // Test model access
    const modelAccessible = await huggingFaceService.checkModelAccess();
    
    return NextResponse.json({
      status: modelAccessible ? 'healthy' : 'error',
      message: modelAccessible ? 'Hugging Face model is accessible' : 'Cannot access Hugging Face model',
      config: {
        hasApiKey,
        hasModelId,
        modelId: process.env.HUGGING_FACE_MODEL_ID,
        modelAccessible
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}