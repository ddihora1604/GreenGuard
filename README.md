# GreenGuard - Plant Disease Detection System

GreenGuard is an AI-powered web application designed to help farmers and agricultural specialists detect and identify plant diseases through image analysis. By leveraging advanced machine learning techniques, GreenGuard provides quick and accurate disease identification along with detailed treatment recommendations and preventive measures.

![GreenGuard Logo](Logo3-removebg-preview.png)

## Project Overview

GreenGuard combines a React-based frontend with a Python Flask backend to create a seamless user experience for plant disease detection. The system supports multiple crop types including Rice, Cotton, Groundnut, Maize, Potato, Tomato, and more.

### Key Features
- **Real-time Plant Disease Detection**: Upload or capture images for immediate analysis
- **Multi-crop Support**: Identifies diseases across various crop types
- **Detailed Analysis Reports**: Provides comprehensive information about detected diseases
- **Treatment Recommendations**: Suggests effective treatment methods
- **Interactive Chat Interface**: Ask follow-up questions about detected diseases
- **Detection History**: Track and review previous disease detections
- **Responsive Design**: Works on both desktop and mobile devices

## Project Structure

```
GreenGuard/
├── backend/                  # Python Flask API
│   ├── models/               # ML model files
│   │   └── adgf_net.keras    # Custom CNN model
│   ├── temp_uploads/         # Temporary storage for uploaded images
│   ├── backend.py            # Main Flask application
│   ├── disease_predict.py    # ML model implementation
│   ├── groq_demo.py          # Integration with Groq API
│   └── requirements.txt      # Python dependencies
│
├── src/                      # React frontend
│   ├── assets/               # Static assets
│   ├── components/           # Reusable UI components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Application pages
│   ├── App.jsx               # Main application component
│   ├── App.css               # Application styles
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
│
├── public/                   # Public static files
├── .gitignore                # Git ignore rules
├── package.json              # NPM dependencies
├── tailwind.config.js        # Tailwind CSS configuration
└── vite.config.js            # Vite configuration
```

## Machine Learning Model

GreenGuard uses a custom Convolutional Neural Network (CNN) architecture with an Adaptive Lesion Module for improved disease detection accuracy. The model:

- Supports 60+ different plant diseases across 11 crop types
- Utilizes adaptive focal loss for handling class imbalance
- Implements attention mechanisms to focus on disease-specific regions
- Achieves high accuracy through transfer learning techniques

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- NPM or Yarn
- Internet connection for API calls

### Frontend Setup
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd GreenGuard

# Install dependencies
npm install

# Run development server
npm run dev

# Access the application at http://localhost:5173
```

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python backend.py

# The API will be available at http://localhost:5000
```

### Environment Configuration
1. Create a `.env` file in the backend directory with:
```
GROQ_API_KEY=your_groq_api_key
```
2. Get your Groq API key from the [Groq Dashboard](https://console.groq.com)

## Usage Guide

1. **Home Screen**: Upload an image or use the camera to capture a plant leaf
2. **Disease Detection**: The system will analyze the image and display results
3. **Detailed Information**: View comprehensive details about the detected disease
4. **Treatment Options**: Get recommended treatments and preventive measures
5. **Chat Interface**: Ask follow-up questions about the disease or treatment
6. **History**: Access previous detection results from the sidebar

## Troubleshooting

- **Image Upload Issues**: Ensure image is in JPG, PNG, or JPEG format
- **Backend Connection Errors**: Check if the Flask server is running on port 5000
- **Model Loading Errors**: Verify the model file exists in the correct location
- **API Key Issues**: Ensure your Groq API key is valid and properly set in the .env file

## Technologies Used
- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Material UI
- **Backend**: Flask, Flask-CORS, TensorFlow, LangChain
- **AI/ML**: TensorFlow, Custom CNN, Groq LLM API
- **Data Storage**: SessionStorage for detection history

## Project Cleanup
- Removed redundant code and optimized model loading
- Cleaned up build artifacts and bytecode files
- Added comprehensive .gitignore rules
- Organized codebase for better maintainability

## License
This project is licensed under the MIT License - see the LICENSE file for details.
