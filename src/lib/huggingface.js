import { Client } from "@gradio/client";
import { HfInference } from "@huggingface/inference";

class HuggingFaceModelService {
  constructor() {
    this.modelId = process.env.HUGGING_FACE_MODEL_ID;
    this.apiKey = process.env.HUGGING_FACE_API_KEY;
    this.baseUrl = 'https://huggingface.co';
    this.hfInference = this.apiKey ? new HfInference(this.apiKey) : null;
  }

  /**
   * Predict using Hugging Face Space API (Gradio format)
   * @param {Array} features - Input features for prediction
   * @returns {Promise<Object>} - The prediction result
   */
  async predictWithSpace(features) {
    try {
      const spaceUrl = process.env.HUGGING_FACE_SPACE_URL;
      if (!spaceUrl) {
        throw new Error('HUGGING_FACE_SPACE_URL not configured');
      }

      console.log('Connecting to Gradio Space:', spaceUrl);
      
      // Create Gradio client
      const client = await Client.connect(spaceUrl);
      
      // Convert features to comma-separated string format expected by your Gradio app
      const featuresString = features.join(',');
      
      console.log('Calling predict_api with features:', featuresString);
      
      // Call the named API endpoint we created with api_name="predict"
      const result = await client.predict("predict", [featuresString]);

      console.log('Gradio Space result:', result);
      
      // Handle the result from Gradio
      let parsedResult = result.data;
      
      // If the result is a string, try to parse it as JSON
      if (typeof parsedResult === 'string') {
        try {
          parsedResult = JSON.parse(parsedResult);
        } catch (e) {
          console.warn('Could not parse result as JSON, using as-is');
        }
      }
      
      // If it's an array, take the first element (common Gradio pattern)
      if (Array.isArray(parsedResult)) {
        parsedResult = parsedResult[0];
      }
      
      return {
        success: true,
        prediction: parsedResult.prediction,
        probabilities: parsedResult.probabilities,
        confidence: parsedResult.confidence || (parsedResult.probabilities ? Math.max(...parsedResult.probabilities) : null),
        prediction_label: parsedResult.prediction_label,
        note: parsedResult.note || 'Prediction from Hugging Face Space',
        model_info: parsedResult.model_info,
        input_features_count: parsedResult.input_features_count,
        processed_features_count: parsedResult.processed_features_count,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Hugging Face Space API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to make prediction with Space',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Predict using Hugging Face Inference API (for compatible models)
   * @param {Array} features - Input features for prediction
   * @returns {Promise<Object>} - The prediction result
   */
  async predictWithInferenceEndpoint(features) {
    try {
      if (!this.modelId || !this.apiKey) {
        throw new Error('Hugging Face model ID and API key must be configured');
      }

      // Use Hugging Face Inference API
      const response = await fetch(`https://api-inference.huggingface.co/models/${this.modelId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: features
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Inference API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        prediction: result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Hugging Face Inference API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to make prediction',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Fallback: Simple mock prediction for development/demo
   * @param {Array} features - Input features
   * @returns {Promise<Object>} - Mock prediction result
   */
  async mockPredict(features) {
    try {
      // Simple mock prediction logic
      const prediction = features.reduce((sum, val) => sum + val, 0) > 10 ? 1 : 0;
      const confidence = Math.random() * 0.5 + 0.5; // Random confidence between 0.5-1.0

      return {
        success: true,
        prediction: prediction,
        confidence: confidence,
        note: 'This is a mock prediction. Set up Hugging Face Inference Endpoint for real predictions.',
        inputFeatures: features,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Mock prediction failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Main predict method that tries different approaches
   * @param {Array} features - Input features for prediction
   * @returns {Promise<Object>} - The prediction result
   */
  async predict(features) {
    try {
      // First, try Hugging Face Space API (if configured)
      if (process.env.HUGGING_FACE_SPACE_URL) {
        console.log('Attempting prediction with Hugging Face Space...');
        const spaceResult = await this.predictWithSpace(features);
        if (spaceResult.success) {
          return spaceResult;
        }
        console.warn('Space API failed, trying Inference API:', spaceResult.error);
      }

      // Second, try the Inference API
      if (this.modelId && this.apiKey) {
        console.log('Attempting prediction with Inference API...');
        const inferenceResult = await this.predictWithInferenceEndpoint(features);
        
        if (inferenceResult.success) {
          return inferenceResult;
        }
        console.warn('Inference API failed, using mock prediction:', inferenceResult.error);
      }

      // If both APIs fail, fall back to mock prediction
      console.log('Using mock prediction as fallback');
      return await this.mockPredict(features);

    } catch (error) {
      console.error('Prediction failed:', error);
      return {
        success: false,
        error: error.message || 'Prediction failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Make a prediction for tabular data (wrapper for main predict method)
   * @param {Array} features - Array of feature values
   * @returns {Promise<Object>} - The prediction result
   */
  async predictTabular(features) {
    return this.predict(features);
  }

  /**
   * Check if the model repository is accessible
   * @returns {Promise<boolean>} - True if model repository is accessible
   */
  async checkModelAccess() {
    try {
      if (!this.modelId || !this.apiKey) {
        return false;
      }

      // Try to access the Inference API to check if model is available
      const response = await fetch(`https://api-inference.huggingface.co/models/${this.modelId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [1, 2, 3 ,4 ,4, 4, 4,4,4,4] // Simple test input
        })
      });

      // Even if the model returns an error, if we get a response it means the model exists
      return response.status !== 404;
      
    } catch (error) {
      console.error('Model access check failed:', error);
      return false;
    }
  }

  /**
   * Get repository information
   * @returns {Promise<Object>} Repository info
   */
  async getRepositoryInfo() {
    try {
      const url = `https://huggingface.co/api/models/${this.modelId}`;
      const headers = {};
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to get repository info: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        info: data,
        files: data.siblings || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
const huggingFaceService = new HuggingFaceModelService();
export default huggingFaceService;