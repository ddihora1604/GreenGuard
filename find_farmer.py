import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Helper component to handle map zooming
function MapZoomHandler({ selectedProfessional }) {
  const map = useMap();
  const DEFAULT_CENTER = [20.5937, 78.9629]; // India coordinates
  const DEFAULT_ZOOM = 5;

  useEffect(() => {
    if (selectedProfessional && selectedProfessional.lat && selectedProfessional.lon) {
      map.flyTo([selectedProfessional.lat, selectedProfessional.lon], 14, {
        duration: 1
      });
    }
  }, [selectedProfessional, map]);

  return null;
}

const AgricultureSearchMap = () => {
  // State variables
  const [searchParams, setSearchParams] = useState({
    expertise: 'Any',
    location: 'Any',
    cropType: 'Any',
    keywords: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter options
  const commonExpertise = [
    "Any", "Farmer", "Agronomist", "Agricultural Officer", "Soil Scientist", 
    "Seed Supplier", "Irrigation Expert", "Organic Farming", "Pesticide Expert", 
    "Crop Insurance Agent", "Agricultural Engineer", "Extension Worker", 
    "Veterinarian", "Animal Husbandry", "Agricultural Consultant", 
    "Market Liaison", "Farm Equipment Supplier", "Agricultural Researcher"
  ];

  const commonLocations = [
    "Any", "Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Karnataka", 
    "Tamil Nadu", "Andhra Pradesh", "West Bengal", "Gujarat", "Rajasthan", 
    "Madhya Pradesh", "Bihar", "Telangana", "Kerala", "Assam", "Odisha"
  ];

  const cropTypes = [
    "Any", "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Pulses", 
    "Millets", "Oilseeds", "Vegetables", "Fruits", "Spices", "Tea", 
    "Coffee", "Jute", "Coconut", "Floriculture", "Horticulture"
  ];

  // Gender detection function (simple heuristic)
  const detectGender = (name) => {
    const femaleIndicators = ['a', 'i', 'e', 'ya', 'ka', 'priya', 'sharma', 'devi', 'kumari'];
    const maleIndicators = ['kumar', 'singh', 'raj', 'verma', 'patel', 'reddy', 'nath'];
    
    const lowercaseName = name.toLowerCase();
    
    // Check for female indicators first
    if (femaleIndicators.some(ind => lowercaseName.includes(ind))) {
      return 'female';
    }
    
    // Then check for male indicators
    if (maleIndicators.some(ind => lowercaseName.includes(ind))) {
      return 'male';
    }
    
    // Default to unknown
    return 'unknown';
  };

  // Function to generate random coordinates within a region's general area
  const getRandomCoordinates = (region) => {
    // Default coordinates (Central India)
    let lat = 20.5937;
    let lon = 78.9629;
    
    // Region-specific base coordinates
    const regionCoordinates = {
      "Punjab": { lat: 31.1471, lon: 75.3412 },
      "Haryana": { lat: 29.0588, lon: 76.0856 },
      "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
      "Maharashtra": { lat: 19.7515, lon: 75.7139 },
      "Karnataka": { lat: 15.3173, lon: 75.7139 },
      "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
      "Andhra Pradesh": { lat: 15.9129, lon: 79.7400 },
      "West Bengal": { lat: 22.9868, lon: 87.8550 },
      "Gujarat": { lat: 22.2587, lon: 71.1924 },
      "Rajasthan": { lat: 27.0238, lon: 74.2179 },
      "Madhya Pradesh": { lat: 22.9734, lon: 78.6569 },
      "Bihar": { lat: 25.0961, lon: 85.3131 },
      "Telangana": { lat: 18.1124, lon: 79.0193 },
      "Kerala": { lat: 10.8505, lon: 76.2711 },
      "Assam": { lat: 26.2006, lon: 92.9376 },
      "Odisha": { lat: 20.9517, lon: 85.0985 }
    };
    
    // If we have coordinates for the region, use them as base
    if (region && regionCoordinates[region]) {
      lat = regionCoordinates[region].lat;
      lon = regionCoordinates[region].lon;
    }
    
    // Add random offset (0.01 to 0.05 degrees) to create markers in the general area
    const latOffset = (Math.random() * 0.8 - 0.4); // -0.4 to +0.4
    const lonOffset = (Math.random() * 0.8 - 0.4); // -0.4 to +0.4
    
    return {
      lat: lat + latOffset,
      lon: lon + lonOffset
    };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Search for agricultural professionals
  const searchAgriProfessionals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct search query
      const queryParts = ["Agricultural professionals"];
      
      if (searchParams.expertise !== "Any") {
        queryParts.push(searchParams.expertise);
      }
      
      if (searchParams.location !== "Any") {
        queryParts.push(`in ${searchParams.location}`);
      } else {
        queryParts.push("India");
      }
      
      if (searchParams.cropType !== "Any") {
        queryParts.push(`for ${searchParams.cropType}`);
      }
      
      if (searchParams.keywords) {
        queryParts.push(searchParams.keywords);
      }
      
      const searchQuery = queryParts.join(" ");
      
      // Step 1: Call Serper API
      const serperResponse = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': '00bed6629055f888ce9b8a4d47d1f17dab6214d7',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 10
        })
      });
      
      if (!serperResponse.ok) {
        throw new Error(`API Error: ${serperResponse.status}`);
      }
      
      const searchData = await serperResponse.json();
      
      // Step 2: Process with Gemini API
      const simplifiedResults = searchData.organic?.map(result => ({
        title: result.title || '',
        link: result.link || '',
        snippet: result.snippet || '',
        position: result.position || 0
      })) || [];
      
      const geminiPrompt = `
      Analyze these agricultural professional search results and extract structured information about individual farmers, agronomists, or agricultural authorities.
      For each professional you can identify, provide:
      1. Name
      2. Expertise (from: ${commonExpertise.join(', ')})
      3. Location (region)
      4. Crop specialization (if mentioned)
      5. Contact info (if available)
      6. Website/source link
      7. Gender (male/female/unknown - based on name if not specified)
      
      Format the response as a JSON array of objects with these properties:
      - name (string)
      - expertise (string)
      - location (string)
      - cropSpecialization (string)
      - contact (string)
      - link (string)
      - address (string if available)
      - gender (string: male/female/unknown)
      
      Search results to analyze:
      ${JSON.stringify(simplifiedResults, null, 2)}
      `;
      const geminiApiKey = "AIzaSyABP0FhpPcNotV7TqlUw38Qm0YpAovfoIY";
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: geminiPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 8192
          }
        })
      });
      
      if (!geminiResponse.ok) {
        throw new Error(`Gemini API Error: ${geminiResponse.status} - ${await geminiResponse.text()}`);
      }
      
      const geminiData = await geminiResponse.json();
      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]'; 
      
      let parsedResults = [];
      try {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        parsedResults = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
      } catch (e) {
        console.error("Error parsing Gemini response:", e);
        throw new Error("Could not parse agricultural professional information from the API response");
      }
      
      // Step 3: Add random coordinates based on location and detect gender if not provided
      const resultsWithCoords = parsedResults.map((professional) => {
        const region = professional.location || (searchParams.location !== "Any" ? searchParams.location : "Maharashtra");
        const coords = getRandomCoordinates(region);
        
        // If gender wasn't detected by Gemini, try to detect it from name
        if (!professional.gender || professional.gender === 'unknown') {
          professional.gender = detectGender(professional.name);
        }
        
        return {
          ...professional,
          lat: coords.lat,
          lon: coords.lon,
          id: Math.random().toString(36).substring(7)
        };
      });
      
      setSearchResults(resultsWithCoords.filter(p => p.name));
      setIsLoading(false);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Custom icons based on expertise and gender
  const getProfessionalIcon = (expertise, gender) => {
    // Base icons based on gender
    const baseIcons = {
      male: 'https://cdn-icons-png.flaticon.com/128/2088/2088111.png',
      female: 'https://cdn-icons-png.flaticon.com/128/2923/2923137.png',
      unknown: 'https://cdn-icons-png.flaticon.com/128/1995/1995450.png'
    };
    
    // Icons for specific roles (regardless of gender)
    const expertiseIcons = {
      "Agricultural Officer": 'https://cdn-icons-png.flaticon.com/128/3522/3522598.png',
      "Agronomist": 'https://cdn-icons-png.flaticon.com/128/5980/5980927.png',
      "Farmer": 'https://cdn-icons-png.flaticon.com/128/10476/10476884.png',
      "Irrigation Expert": 'https://cdn-icons-png.flaticon.com/128/3105/3105868.png'
    };
    
    // Choose appropriate icon URL
    let iconUrl = baseIcons[gender] || baseIcons.unknown;
    if (expertise && expertiseIcons[expertise]) {
      iconUrl = expertiseIcons[expertise];
    }
    
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowSize: [41, 41]
    });
  };

  // Default center (Central India)
  const defaultCenter = [20.5937, 78.9629];

  return (
    <div className="agri-search-container">
      <h1>🌱 Agricultural Professional Search and Mapping Tool</h1>
      
      <div className="search-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label>Expertise:</label>
            <select 
              name="expertise" 
              value={searchParams.expertise}
              onChange={handleInputChange}
            >
              {commonExpertise.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Location:</label>
            <select 
              name="location" 
              value={searchParams.location}
              onChange={handleInputChange}
            >
              {commonLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Crop Type:</label>
            <select 
              name="cropType" 
              value={searchParams.cropType}
              onChange={handleInputChange}
            >
              {cropTypes.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group keywords">
            <label>Additional Keywords:</label>
            <input
              type="text"
              name="keywords"
              value={searchParams.keywords}
              onChange={handleInputChange}
              placeholder="e.g., organic, certification, disease control"
            />
          </div>
          
          <button 
            className="search-button"
            onClick={searchAgriProfessionals}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search for Agricultural Professionals'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      <div className="results-layout">
        <div className="professionals-list">
          <h2>Search Results</h2>
          
          {isLoading ? (
            <div className="loading-message">Loading agricultural professional information...</div>
          ) : searchResults.length === 0 ? (
            <div className="info-message">
              No agricultural professionals found yet. Use the filters above to search.
            </div>
          ) : (
            <div className="results-container">
              {searchResults.map((professional) => (
                <div 
                  key={professional.id} 
                  className={`professional-card ${selectedProfessional?.id === professional.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProfessional(professional)}
                >
                  <div className="professional-card-header">
                    <img 
                      src={professional.expertise === 'Farmer' ? 
                        'https://cdn-icons-png.flaticon.com/128/10476/10476884.png' : 
                        professional.expertise === 'Agricultural Officer' ? 
                        'https://cdn-icons-png.flaticon.com/128/3522/3522598.png' : 
                        professional.gender === 'male' ? 
                        'https://cdn-icons-png.flaticon.com/128/2088/2088111.png' : 
                        professional.gender === 'female' ? 
                        'https://cdn-icons-png.flaticon.com/128/2923/2923137.png' : 
                        'https://cdn-icons-png.flaticon.com/128/1995/1995450.png'} 
                      alt={professional.expertise || 'Agricultural Professional'}
                      className="professional-avatar"
                    />
                    <h3>{professional.name}</h3>
                  </div>
                  <p><strong>Expertise:</strong> {professional.expertise || 'Not specified'}</p>
                  <p><strong>Location:</strong> {professional.location || 'Not specified'}</p>
                  {professional.cropSpecialization && <p><strong>Crop Specialization:</strong> {professional.cropSpecialization}</p>}
                  {professional.contact && <p><strong>Contact:</strong> {professional.contact}</p>}
                  {professional.link && (
                    <p>
                      <strong>Website:</strong> 
                      <a href={professional.link} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="map-section">
          <h2>Agricultural Professional Locations</h2>
          <div className="map-wrapper">
            <MapContainer 
              center={defaultCenter} 
              zoom={5} 
              style={{ height: '600px', width: '100%' }}
            >
              <MapZoomHandler selectedProfessional={selectedProfessional} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {searchResults.filter(p => p.lat && p.lon).map((professional) => (
                <Marker 
                  key={`marker-${professional.id}`} 
                  position={[professional.lat, professional.lon]} 
                  icon={getProfessionalIcon(professional.expertise, professional.gender)}
                  eventHandlers={{
                    click: () => setSelectedProfessional(professional)
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <img 
                        src={professional.expertise === 'Farmer' ? 
                          'https://cdn-icons-png.flaticon.com/128/10476/10476884.png' : 
                          professional.expertise === 'Agricultural Officer' ? 
                          'https://cdn-icons-png.flaticon.com/128/3522/3522598.png' : 
                          professional.gender === 'male' ? 
                          'https://cdn-icons-png.flaticon.com/128/2088/2088111.png' : 
                          professional.gender === 'female' ? 
                          'https://cdn-icons-png.flaticon.com/128/2923/2923137.png' : 
                          'https://cdn-icons-png.flaticon.com/128/1995/1995450.png'} 
                        alt={professional.expertise}
                        className="popup-avatar"
                      />
                      <b>{professional.name}</b><br />
                      {professional.expertise && <span>Expertise: {professional.expertise}<br /></span>}
                      {professional.location && <span>Location: {professional.location}<br /></span>}
                      {professional.cropSpecialization && <span>Crop: {professional.cropSpecialization}<br /></span>}
                      {professional.contact && <span>Contact: {professional.contact}<br /></span>}
                      {professional.link && (
                        <a href={professional.link} target="_blank" rel="noopener noreferrer">
                          More info
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          {selectedProfessional && (
            <div className="selected-professional-details">
              <h3>Selected Professional Details</h3>
              <div className="details-content">
                <div className="selected-professional-header">
                  <img 
                    src={selectedProfessional.expertise === 'Farmer' ? 
                      'https://cdn-icons-png.flaticon.com/128/10476/10476884.png' : 
                      selectedProfessional.expertise === 'Agricultural Officer' ? 
                      'https://cdn-icons-png.flaticon.com/128/3522/3522598.png' : 
                      selectedProfessional.gender === 'male' ? 
                      'https://cdn-icons-png.flaticon.com/128/2088/2088111.png' : 
                      selectedProfessional.gender === 'female' ? 
                      'https://cdn-icons-png.flaticon.com/128/2923/2923137.png' : 
                      'https://cdn-icons-png.flaticon.com/128/1995/1995450.png'} 
                    alt={selectedProfessional.expertise}
                    className="selected-professional-avatar"
                  />
                  <div>
                    <p><strong>Name:</strong> {selectedProfessional.name}</p>
                    <p><strong>Gender:</strong> {selectedProfessional.gender || 'Not specified'}</p>
                  </div>
                </div>
                <p><strong>Expertise:</strong> {selectedProfessional.expertise || 'Not specified'}</p>
                <p><strong>Location:</strong> {selectedProfessional.location || 'Not specified'}</p>
                {selectedProfessional.cropSpecialization && <p><strong>Crop Specialization:</strong> {selectedProfessional.cropSpecialization}</p>}
                {selectedProfessional.contact && <p><strong>Contact:</strong> {selectedProfessional.contact}</p>}
                {selectedProfessional.address && <p><strong>Address:</strong> {selectedProfessional.address}</p>}
                {selectedProfessional.link && (
                  <p>
                    <strong>Website:</strong> 
                    <a href={selectedProfessional.link} target="_blank" rel="noopener noreferrer">
                      {selectedProfessional.link}
                    </a>
                  </p>
                )}
                {selectedProfessional.lat && selectedProfessional.lon && (
                  <p>
                    <strong>Coordinates:</strong> 
                    {selectedProfessional.lat.toFixed(4)}, {selectedProfessional.lon.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .agri-search-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        h1, h2, h3 {
          color: #2e7d32;
        }
        
        .search-controls {
          background: #f1f8e9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .filter-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
        
        .filter-group.keywords {
          flex: 3;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #33691e;
        }
        
        select, input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #aed581;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .search-button {
          background-color: #689f38;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 10px 0;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
          align-self: flex-end;
        }
        
        .search-button:hover {
          background-color: #558b2f;
        }
        
        .search-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .results-layout {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }
        
        .professionals-list {
          flex: 1;
          min-width: 350px;
          max-height: 800px;
          overflow-y: auto;
        }
        
        .map-section {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .map-wrapper {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border: 2px solid #aed581;
        }
        
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .professional-card {
          padding: 15px;
          border-radius: 5px;
          background: #fff;
          border: 1px solid #dcedc8;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .professional-card:hover {
          border-color: #8bc34a;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .professional-card.selected {
          border-left: 4px solid #689f38;
          background-color: #f1f8e9;
        }
        
        .professional-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .professional-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .professional-card h3 {
          margin: 0;
          color: #33691e;
        }
        
        .professional-card p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .professional-card a {
          color: #689f38;
          text-decoration: none;
        }
        
        .professional-card a:hover {
          text-decoration: underline;
        }
        
        .selected-professional-details {
          background: #f1f8e9;
          padding: 15px;
          border-radius: 5px;
          margin-top: 10px;
          border: 1px solid #dcedc8;
        }
        
        .selected-professional-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .selected-professional-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .details-content {
          font-size: 14px;
        }
        
        .details-content p {
          margin: 8px 0;
        }
        
        .popup-content {
          text-align: center;
        }
        
        .popup-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        
        .loading-message, .info-message, .error-message {
          padding: 15px;
          border-radius: 5px;
          margin: 10px 0;
        }
        
        .loading-message {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .info-message {
          background: #f1f8e9;
          color: #558b2f;
        }
        
        .error-message {
          background: #ffebee;
          color: #c62828;
        }
        
        @media (max-width: 768px) {
          .results-layout {
            flex-direction: column;
          }
          
          .professionals-list {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AgricultureSearchMap;