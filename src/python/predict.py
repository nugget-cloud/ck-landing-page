
import joblib
import pandas as pd
import numpy as np
import sys
import json
import os

def predict(data):
    """
    Loads the model and preprocessing objects to make a prediction.
    """
    try:
        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_dir = os.path.join(script_dir, 'model_export')

        # Load all the components
        model = joblib.load(os.path.join(model_dir, 'exoplanet_ensemble_model.joblib'))
        scaler = joblib.load(os.path.join(model_dir, 'feature_scaler.joblib'))
        imputer = joblib.load(os.path.join(model_dir, 'feature_imputer.joblib'))
        selector = joblib.load(os.path.join(model_dir, 'variance_selector.joblib'))
        feature_info = joblib.load(os.path.join(model_dir, 'feature_info.joblib'))

        # Get the feature names
        original_features = feature_info['original_features']
        selected_features = feature_info['selected_features']

        # Create a pandas DataFrame from the input data
        input_df = pd.DataFrame([data], columns=original_features)

        # Preprocess the data
        # 1. Impute missing values
        imputed_data = imputer.transform(input_df)
        imputed_df = pd.DataFrame(imputed_data, columns=original_features)

        # 2. Apply variance thresholding
        selected_data = selector.transform(imputed_df)
        selected_df = pd.DataFrame(selected_data, columns=imputed_df.columns[selector.get_support()])

        # 3. Scale the features
        scaled_data = scaler.transform(selected_df)
        scaled_df = pd.DataFrame(scaled_data, columns=selected_features)

        # Make prediction
        prediction = model.predict(scaled_df)
        prediction_proba = model.predict_proba(scaled_df)

        # Return the result as a dictionary
        result = {
            'prediction': int(prediction[0]),
            'confidence': {
                'not_planet': prediction_proba[0][0],
                'planet': prediction_proba[0][1]
            }
        }
        return result

    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    try:
        # The input data is passed as a JSON string in the first command-line argument
        input_data = json.loads(sys.argv[1])
        
        # Make the prediction
        prediction_result = predict(input_data)
        
        # Print the result as a JSON string to stdout
        print(json.dumps(prediction_result))

    except Exception as e:
        # If there's an error, print it as a JSON object to stdout
        # This helps in debugging from the Node.js side
        error_result = {'error': f"An error occurred in the Python script: {str(e)}"}
        print(json.dumps(error_result))
        sys.exit(1)
