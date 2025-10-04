
import { NextResponse } from 'next/server';
import huggingFaceService from '../../../lib/huggingface.js';

export async function POST(request) {
  try {
    const data = await request.json();
    
    let features;
    
    // Handle both array format and object format
    if (data.features && Array.isArray(data.features)) {
      // Array format: { features: [1.2, 3.4, 5.6, ...] }
      features = data.features;
    } else if (data && typeof data === 'object' && !data.features) {
      // Object format from frontend: { pl_orbper: "365.25", pl_rade: "1.0", ... }
      const expectedFields = [
        'pl_orbper', 'pl_rade', 'pl_bmasse', 'pl_dens', 'pl_orbsmax', 
        'pl_orbeccen', 'pl_insol', 'pl_eqt', 'st_teff', 'st_rad', 'st_mass', 'st_logg'
      ];
      
      features = expectedFields.map(field => {
        const value = data[field];
        if (value === null || value === '' || value === undefined) {
          return 0; // Use 0 as default for missing values
        }
        return parseFloat(value);
      });
    } else {
      return NextResponse.json(
        { error: 'Input data must contain either a "features" array or planetary parameters object' }, 
        { status: 400 }
      );
    }

    // Validate that features are numbers
    const validFeatures = features.every(feature => typeof feature === 'number' && !isNaN(feature));
    if (!validFeatures) {
      return NextResponse.json(
        { error: 'All features must be valid numbers' }, 
        { status: 400 }
      );
    }

    console.log('Processing prediction with features:', features);

    // Make prediction using Hugging Face service
    const predictionResult = await huggingFaceService.predict(features);
    
    if (!predictionResult.success) {
      console.error('Hugging Face prediction error:', predictionResult.error);
      return NextResponse.json({
        error: 'Failed to make prediction with Hugging Face model',
        details: predictionResult.error,
        note: predictionResult.note || 'Check your Hugging Face configuration'
      }, { status: 500 });
    }

    // Format confidence scores for frontend
    let confidence = predictionResult.confidence;
    if (typeof confidence === 'number') {
      // If single confidence value, create probability distribution
      confidence = {
        planet: predictionResult.prediction === 1 ? confidence : (1 - confidence),
        not_planet: predictionResult.prediction === 1 ? (1 - confidence) : confidence
      };
    } else if (predictionResult.probabilities && Array.isArray(predictionResult.probabilities)) {
      // If probabilities array is available, use it
      confidence = {
        not_planet: predictionResult.probabilities[0] || 0,
        planet: predictionResult.probabilities[1] || 0
      };
    } else if (!confidence) {
      // Fallback confidence based on prediction
      confidence = {
        planet: predictionResult.prediction === 1 ? 0.8 : 0.2,
        not_planet: predictionResult.prediction === 1 ? 0.2 : 0.8
      };
    }

    return NextResponse.json({
      success: true,
      prediction: predictionResult.prediction,
      confidence: confidence,
      note: predictionResult.note,
      inputFeatures: predictionResult.inputFeatures || features,
      timestamp: predictionResult.timestamp,
      model: process.env.HUGGING_FACE_MODEL_ID || 'default-model',
      model_info: predictionResult.model_info,
      input_features_count: predictionResult.input_features_count,
      processed_features_count: predictionResult.processed_features_count
    });

  } catch (e) {
    console.error(`API error: ${e}`);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred.',
        details: e.message 
      }, 
      { status: 500 }
    );
  }
}
