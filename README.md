# GreenGuard - An AI-driven Interactive Chatbot for Real-time Crop Disease Detection using AGDFNet

Prototype: https://youtu.be/OE9KS9Ulcos?si=G_Co71CIU6b5h9o2

Research Paper: https://docs.google.com/document/d/16dlcJQwMlwsY-dh49TIpj6FXRT9mQ0T65wFbP-Y_faE/edit?tab=t.0

## Project Overview
GreenGuard is an AI-powered, interactive web application designed to assist farmers and agricultural specialists in detecting and identifying plant diseases using image-based diagnostics. By leveraging the AGDFNet (Attention-Guided Multi-Scale Disease Feature Network) deep learning model, the system provides real-time disease identification, treatment recommendations, and preventive insights, all integrated into an intuitive chatbot interface.

## 💡 Key Features

### 🧠 Real-time Plant Disease Detection
- Upload or capture leaf images for instant analysis
- Offline model inference using AGDFNet architecture
- Real-time feedback with disease probability scores
- Support for both online and offline modes

### 🌾 Multi-Crop, Multi-Disease Coverage
- Comprehensive coverage of 61 disease classes
- Support for 11 major crop types:
  - Bean
  - Cotton
  - Groundnut
  - Maize
  - Pepper Bell
  - Potato
  - Rice
  - Spinach
  - Sugarcane
  - Tomato
  - Turmeric

### 📊 Rich Disease Reports
- Class-specific precision, recall, and F1-scores
- Disease probability heatmaps
- Growth stage analysis
- Severity assessment
- Environmental factor correlation

### 💊 Treatment & Prevention
- Personalized treatment prescriptions
- Preventive measures and best practices
- Fertilizer recommendations
- Integrated pest management suggestions
- Seasonal care guidelines

### 💬 AI Chatbot Interface
- Interactive diagnosis conversations
- Treatment recommendations
- Fertilizer information
- Location-based mapping
- Weather integration
- Growth stage advice

### 🕒 Detection History
- Comprehensive scan history
- Progress tracking
- Treatment effectiveness analysis
- Exportable reports
- Seasonal comparison
- Growth pattern analysis

### 📱 Mobile Optimization
- Offline model inference
- Online treatment recommendations
- Camera integration
- Mobile-friendly UI
- Offline storage
- Network-optimized images

## 📚 Usage Guide

### 1. Home Page
- Upload or capture a crop leaf image
- Support for JPG, PNG, and JPEG formats
- Maximum file size: 5MB
- Real-time image preview

### 2. Detection Process
- Image processed through AGDFNet
- Multi-scale feature extraction
- Attention-based disease localization
- Real-time probability calculation

### 3. Report Generation
- Display of detected disease class
- Probability score visualization
- Treatment recommendations
- Prevention measures
- Export options

### 4. Chatbot Interaction
- Ask questions about diagnosis
- Get localized advice
- Treatment follow-up
- Prevention queries
- Growth stage information

### 5. History Management
- Access previous scans
- Compare results
- Track treatment progress
- Export historical data
- Analyze patterns

## 🛠 Troubleshooting

### 1. Upload Errors
- **Error**: Unsupported file format
  - **Solution**: Use JPG, PNG, or JPEG only
  - **Tip**: Convert images using free tools

- **Error**: File size too large
  - **Solution**: Compress image before upload
  - **Tip**: Use image compression tools

### 2. Backend Connection
- **Error**: Flask server not running
  - **Solution**: Start backend server
  - **Command**: `python backend.py`
  - **Port**: 5000

### 3. Model Loading
- **Error**: Missing model file
  - **Solution**: Place `adgf_net.keras` in `models/`
  - **Location**: `backend/models/adgf_net.keras`
  - **Tip**: Verify file permissions

### 4. Chatbot Issues
- **Error**: API key not found
  - **Solution**: Check `.env` file
  - **Variable**: `GROQ_API_KEY`
  - **Tip**: Get key from Groq Dashboard

## 🛠️ Technologies Used

### Layer Stack

#### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **UI Components**: Material UI
- **State Management**: React Context
- **Image Processing**: HTML5 Canvas

#### Backend
- **Framework**: Flask 2.x
- **CORS**: Flask-CORS
- **ML Integration**: TensorFlow 2.x
- **Chat Integration**: LangChain
- **API Routing**: Flask-RESTful
- **Error Handling**: Flask-Error

#### Machine Learning
- **Model Architecture**: AGDFNet
- **Loss Function**: Adaptive Focal Loss
- **Attention Mechanisms**: Spatial & Channel Attention
- **Transfer Learning**: Pre-trained CNN
- **Optimization**: AdamW
- **Metrics**: Precision, Recall, F1-Score

#### Storage & Data
- **Session Management**: SessionStorage
- **Image Storage**: Temporary filesystem
- **History**: IndexedDB
- **Cache**: Redis (optional)

#### API & Integration
- **LLM Provider**: Groq
- **Weather API**: OpenWeatherMap
- **Geolocation**: Geolocation API
- **Image Processing**: Pillow
- **Database**: SQLite (optional)


## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- NPM or Yarn
- Internet connection for API calls
- Git
- Python virtual environment

### Frontend Setup
```bash
# Clone the repository
$ git clone <repository-url>
$ cd GreenGuard

# Install dependencies
$ npm install

# Run development server
$ npm run dev

# Access the application at http://localhost:5173
```

### Backend Setup
```bash
# Navigate to the backend directory
$ cd backend

# Create and activate virtual environment
$ python -m venv venv
# On Windows:
$ venv\Scripts\activate
# On macOS/Linux:
$ source venv/bin/activate

# Install dependencies
$ pip install -r requirements.txt

# Run the backend server
$ python backend.py

# The API will be available at http://localhost:5000
```

### Environment Configuration
1. Create a `.env` file in the backend directory with:
```
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

2. Get your API keys from:
- Groq Dashboard: [https://console.groq.com](https://console.groq.com)
- OpenWeatherMap: [https://openweathermap.org/api](https://openweathermap.org/api)


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
