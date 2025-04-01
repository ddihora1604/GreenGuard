import os
import base64
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from disease_predict import analyze_image
from groq_demo import generate_response

app = Flask(__name__)
CORS(app)

# Setup upload folder
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowable file extensions for images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_disease_related(message, disease):
    """Check if the user's message is related to the disease context."""
    # List of disease-related keywords
    disease_keywords = [
        'disease', 'treatment', 'symptoms', 'cure', 'prevent', 'spread', 
        'control', 'causes', 'affected', 'infection', 'remedy', 'solution',
        'manage', 'handle', 'rice', 'plant', 'crop', 'farm', 'field',
    ]
    disease = disease.lower()
    
    message_lower = message.lower()
    
    # Check if any disease-related keyword is in the message
    return any(keyword in message_lower for keyword in disease_keywords)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        print("API predict endpoint called")
        # Create temp folder if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Check if the 'image' key exists in request.files
        if 'image' not in request.files:
            print("No image file found in request")
            return jsonify({'error': 'No image file provided', 'status': 'failed'}), 400
        
        file = request.files['image']
        
        # Check if a file was actually selected
        if file.filename == '':
            print("Empty filename received")
            return jsonify({'error': 'No file selected', 'status': 'failed'}), 400
        
        # Check if the file has a valid extension
        if not allowed_file(file.filename):
            print(f"Invalid file type: {file.filename}")
            return jsonify({'error': 'Invalid file type. Only image files are allowed.', 'status': 'failed'}), 400
        
        # Secure the filename and save the image
        filename = secure_filename(file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(image_path)
        
        print(f"Image saved to {image_path}, analyzing...")

        # Predict disease from the image
        analysis_result = analyze_image(image_path)
        if analysis_result['status'] == 'success':
            print("\nDisease Prediction Test Results:")
            print("-" * 30)
            print(f"Crop Type: {analysis_result['crop_type']}")
            print(f"Condition: {analysis_result['condition']}")
            print(f"Confidence: {analysis_result['confidence']*100:.2f}%")
            
            print("\nProbabilities by crop type:")
            for crop, prob in analysis_result['crop_probabilities'].items():
                print(f"{crop}: {prob*100:.2f}%")
                
            # Generate detailed explanation for the disease
            prompt = (
                f"What is {analysis_result['condition']} in {analysis_result['crop_type']} plants? Please provide a detailed response covering: "
                f"1. Disease description and symptoms "
                f"2. Spreadability "
                f"3. Common causes "
                f"4. Treatment methods "
                f"5. Prevention measures"
            )
            explanation = generate_response(prompt)
            
            # Clean up the uploaded image file after processing
            try:
                os.remove(image_path)
                print(f"Temporary image removed: {image_path}")
            except Exception as cleanup_err:
                print(f"Warning: Failed to remove temporary image: {str(cleanup_err)}")
            
            # Return the prediction and explanation
            response_data = {
                'disease': analysis_result.get('condition', 'Unknown'),
                'confidence': analysis_result.get('confidence', 0.0),
                'explanation': explanation,
                'crop_type': analysis_result.get('crop_type', 'Unknown'),
                'crop_confidence': analysis_result.get('crop_confidence', 0.0),
                'status': analysis_result.get('status', 'failed')
            }
            
            # Ensure confidence values are float
            if response_data['confidence'] is not None:
                response_data['confidence'] = float(response_data['confidence'])
            if response_data['crop_confidence'] is not None:
                response_data['crop_confidence'] = float(response_data['crop_confidence'])
                
            print("Analysis complete, returning results to frontend")
            return jsonify(response_data)
        else:
            # Clean up the uploaded image file
            try:
                os.remove(image_path)
            except:
                pass
                
            # Return the error
            return jsonify({
                'error': analysis_result.get('error', 'Disease detection failed'),
                'status': 'failed'
            }), 500
            
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        traceback.print_exc()
        # Catch all errors and return them
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        context = data.get('context', [])
        
        # Look for the disease in the context if it's already detected
        disease = None
        for msg in context:
            if msg.get('type') == 'bot' and 'Disease detected:' in msg.get('content', ''):
                # Extract the disease name from the bot's response
                disease = msg['content'].split('Disease detected:')[1].split('\n')[0].strip()
                break
        
        # If no disease context was found, return a message with 200 status
        if not disease:
            return jsonify({
                'message': 'I apologize, but I cannot find any disease context in our conversation. '
                          'Please upload an image first so I can detect the disease and assist you better.',
                'error': False
            }), 200
        
        # Check if the user's message is related to the disease context
        if not is_disease_related(user_message, disease):
            return jsonify({
                'message': 'I apologize, but your question doesn\'t seem to be related to the detected '
                          f'rice plant disease ({disease}). Please ask questions about the disease, its '
                          'symptoms, treatment, or prevention for me to help you better.',
                'error': False
            }), 200
            
        # Generate a response for disease-related queries
        prompt = f"Regarding {disease} disease in Rice plants: {user_message}"
        response = generate_response(prompt)
        return jsonify({
            'message': response,
            'error': False
        }), 200

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        traceback.print_exc()
        # Catch all errors and return them
        return jsonify({
            'message': str(e),
            'error': True
        }), 500

if __name__ == '__main__':
    app.run(debug=False, port=5000)