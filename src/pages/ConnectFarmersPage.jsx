import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing marker icon issue in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Separate Map component to handle map rendering
const ProfessionalsMap = ({ searchResults, selectedProfessional, setSelectedProfessional, getProfessionalIcon }) => {
  const defaultCenter = [20.5937, 78.9629];
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = L.map(mapRef.current).setView(defaultCenter, 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // Handle markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    searchResults.filter(p => p.lat && p.lon).forEach((professional) => {
      const marker = L.marker([professional.lat, professional.lon], {
        icon: getProfessionalIcon(professional.expertise, professional.gender)
      }).addTo(map);

      marker.bindPopup(`
        <div class="popup-content text-center">
          <img 
            src="${professional.expertise === 'Farmer' ? 
              'https://cdn-icons-png.flaticon.com/128/10476/10476884.png' : 
              professional.expertise === 'Agricultural Officer' ? 
              'https://cdn-icons-png.flaticon.com/128/3522/3522598.png' : 
              professional.gender === 'male' ? 
              'https://cdn-icons-png.flaticon.com/128/2088/2088111.png' : 
              professional.gender === 'female' ? 
              'https://cdn-icons-png.flaticon.com/128/2923/2923137.png' : 
              'https://cdn-icons-png.flaticon.com/128/1995/1995450.png'}"
            alt="${professional.expertise}"
            class="w-12 h-12 rounded-full mx-auto mb-2"
          />
          <h3 class="font-semibold text-green-800">${professional.name}</h3>
          ${professional.expertise ? `<p class="text-sm">${professional.expertise}</p>` : ''}
          ${professional.location ? `<p class="text-sm">${professional.location}</p>` : ''}
          ${professional.cropSpecialization ? `<p class="text-sm">Crop: ${professional.cropSpecialization}</p>` : ''}
        </div>
      `);

      marker.on('click', () => setSelectedProfessional(professional));
    });
  }, [map, searchResults, getProfessionalIcon, setSelectedProfessional]);

  // Handle selected professional
  useEffect(() => {
    if (!map || !selectedProfessional) return;

    if (selectedProfessional.lat && selectedProfessional.lon) {
      map.flyTo([selectedProfessional.lat, selectedProfessional.lon], 14, {
        duration: 1
      });
    }
  }, [map, selectedProfessional]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '500px', width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};

ProfessionalsMap.propTypes = {
  searchResults: PropTypes.array.isRequired,
  selectedProfessional: PropTypes.object,
  setSelectedProfessional: PropTypes.func.isRequired,
  getProfessionalIcon: PropTypes.func.isRequired
};

const ConnectFarmersPage = ({ isCollapsed }) => {
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
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed

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

  // Database of agricultural professionals (simulating a backend database)
  const professionalDatabase = [
    {
      id: "prof001",
      name: "Sunita Sharma",
      expertise: "Agronomist",
      location: "Punjab",
      cropSpecialization: "Rice",
      contact: "+91 99432 10987",
      link: "https://farmer-profile.example.com/sunita",
      address: "45 Crop Avenue, Town Harvest",
      gender: "female",
      lat: 31.1471,
      lon: 75.3412
    },
    {
      id: "prof002",
      name: "Rajesh Kumar",
      expertise: "Farmer",
      location: "Haryana",
      cropSpecialization: "Wheat",
      contact: "+91 98765 43210",
      link: "https://farmer-profile.example.com/rajesh",
      address: "123 Farm Road, Village Greenfield",
      gender: "male",
      lat: 29.0588,
      lon: 76.0856
    },
    {
      id: "prof003",
      name: "Amit Singh",
      expertise: "Extension Worker",
      location: "Punjab",
      cropSpecialization: "Rice",
      contact: "farmer@example.com",
      link: "https://krishi-sevak.example.com/amit",
      address: "Agricultural Research Center, District Farmland",
      gender: "male",
      lat: 31.3260,
      lon: 75.5762
    },
    {
      id: "prof004",
      name: "Priya Patel",
      expertise: "Agricultural Officer",
      location: "Gujarat",
      cropSpecialization: "Cotton",
      contact: "+91 87654 32109",
      link: "https://agri-connect.example.com/priya",
      address: "Government Agricultural Office, Ahmedabad",
      gender: "female",
      lat: 22.2587,
      lon: 71.1924
    },
    {
      id: "prof005",
      name: "Vikram Reddy",
      expertise: "Soil Scientist",
      location: "Karnataka",
      cropSpecialization: "Coffee",
      contact: "soil.expert@example.com",
      link: "https://agri-connect.example.com/vikram",
      address: "Soil Testing Center, Bengaluru Rural",
      gender: "male",
      lat: 15.3173,
      lon: 75.7139
    },
    {
      id: "prof006",
      name: "Meena Rani",
      expertise: "Veterinarian",
      location: "Punjab",
      cropSpecialization: "Rice",
      contact: "+91 76543 21098",
      link: "https://animal-health.example.com/meena",
      address: "Veterinary Hospital, Ludhiana",
      gender: "female",
      lat: 30.9010,
      lon: 75.8573
    },
    {
      id: "prof007",
      name: "Sanjay Verma",
      expertise: "Agricultural Officer",
      location: "Punjab",
      cropSpecialization: "Rice",
      contact: "agri.dept@example.com",
      link: "https://agri-dept.example.com/sanjay",
      address: "Block Development Office, Amritsar",
      gender: "male",
      lat: 31.6340,
      lon: 74.8723
    },
    {
      id: "prof008",
      name: "Aarti Devi",
      expertise: "Organic Farming",
      location: "Uttar Pradesh",
      cropSpecialization: "Vegetables",
      contact: "organic@example.com",
      link: "https://organic-india.example.com/aarti",
      address: "Organic Farm Collective, Varanasi",
      gender: "female",
      lat: 26.8467,
      lon: 80.9462
    },
    {
      id: "prof009",
      name: "Deepak Gupta",
      expertise: "Irrigation Expert",
      location: "Rajasthan",
      cropSpecialization: "Millets",
      contact: "+91 65432 10987",
      link: "https://water-management.example.com/deepak",
      address: "Water Conservation Institute, Jodhpur",
      gender: "male",
      lat: 27.0238,
      lon: 74.2179
    },
    {
      id: "prof010",
      name: "Nandini Kumari",
      expertise: "Market Liaison",
      location: "Maharashtra",
      cropSpecialization: "Fruits",
      contact: "market.connect@example.com",
      link: "https://market-connect.example.com/nandini",
      address: "Agricultural Market Committee, Pune",
      gender: "female",
      lat: 19.7515,
      lon: 75.7139
    },
    {
      id: "prof011",
      name: "Arjun Nath",
      expertise: "Pesticide Expert",
      location: "West Bengal",
      cropSpecialization: "Jute",
      contact: "pest.control@example.com",
      link: "https://crop-protection.example.com/arjun",
      address: "Plant Protection Center, Kolkata",
      gender: "male",
      lat: 22.9868,
      lon: 87.8550
    },
    {
      id: "prof012",
      name: "Kavita Mishra",
      expertise: "Agricultural Consultant",
      location: "Bihar",
      cropSpecialization: "Maize",
      contact: "agri.consultancy@example.com",
      link: "https://agri-consultants.example.com/kavita",
      address: "Rural Development Center, Patna",
      gender: "female",
      lat: 25.0961,
      lon: 85.3131
    }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Search button click - forces a refresh of search results
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true); // Only set hasSearched to true when user clicks search
    searchAgriProfessionals();
  };

  // Search for agricultural professionals
  const searchAgriProfessionals = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedProfessional(null);
    
    try {
      // Filter professionals based on search parameters
      let filteredResults = [...professionalDatabase];
      
      // Filter by expertise
      if (searchParams.expertise !== "Any") {
        filteredResults = filteredResults.filter(prof => 
          prof.expertise === searchParams.expertise
        );
      }
      
      // Filter by location
      if (searchParams.location !== "Any") {
        filteredResults = filteredResults.filter(prof => 
          prof.location === searchParams.location
        );
      }
      
      // Filter by crop type
      if (searchParams.cropType !== "Any") {
        filteredResults = filteredResults.filter(prof => 
          prof.cropSpecialization === searchParams.cropType
        );
      }
      
      // Filter by keywords
      if (searchParams.keywords.trim() !== "") {
        const keywords = searchParams.keywords.toLowerCase().split(" ");
        filteredResults = filteredResults.filter(prof => {
          return keywords.some(keyword => 
            prof.name.toLowerCase().includes(keyword) ||
            prof.expertise.toLowerCase().includes(keyword) ||
            prof.location.toLowerCase().includes(keyword) ||
            prof.cropSpecialization.toLowerCase().includes(keyword) ||
            (prof.address && prof.address.toLowerCase().includes(keyword))
          );
        });
      }
      
      // Set search results
      setSearchResults(filteredResults);
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
      popupAnchor: [0, -32]
    });
  };

  return (
    <div className={`main-content-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="agri-search-container p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mt-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Connect with Agricultural Professionals
          </h2>
        </div>
        
        <div className="search-controls bg-green-50 p-6 rounded-lg shadow-md mb-6">
          <div className="filter-row grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="filter-group">
              <label className="block text-green-800 mb-2">Expertise:</label>
              <select 
                name="expertise" 
                value={searchParams.expertise}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {commonExpertise.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="block text-green-800 mb-2">Location:</label>
              <select 
                name="location" 
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {commonLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="block text-green-800 mb-2">Crop Type:</label>
              <select 
                name="cropType" 
                value={searchParams.cropType}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {cropTypes.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-row flex flex-col md:flex-row gap-4 items-end">
            <div className="filter-group flex-grow">
              <label className="block text-green-800 mb-2">Additional Keywords:</label>
              <input
                type="text"
                name="keywords"
                value={searchParams.keywords}
                onChange={handleInputChange}
                placeholder="e.g., organic, certification, disease control"
                className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-300 flex-shrink-0"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search for Professionals'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            Error: {error}
          </div>
        )}
        
        {hasSearched ? (
          <div className="results-layout grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="professionals-list lg:col-span-1">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Search Results</h2>
              
              {isLoading ? (
                <div className="bg-green-50 p-4 rounded text-green-700">Loading agricultural professional information...</div>
              ) : searchResults.length === 0 ? (
                <div className="bg-blue-50 p-4 rounded text-blue-700">
                  No agricultural professionals match your search criteria. Please try different filters.
                </div>
              ) : (
                <div className="results-container space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {searchResults.map((professional) => (
                    <div 
                      key={professional.id} 
                      className={`professional-card bg-white p-4 rounded-lg border-l-4 ${
                        selectedProfessional?.id === professional.id 
                          ? 'border-green-600 shadow-md' 
                          : 'border-green-200'
                      } cursor-pointer transition-all hover:shadow-md`}
                      onClick={() => setSelectedProfessional(professional)}
                    >
                      <div className="flex items-center gap-3 mb-2">
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
                          className="w-10 h-10 rounded-full"
                        />
                        <h3 className="font-semibold text-green-800">{professional.name}</h3>
                      </div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Expertise:</span> {professional.expertise || 'Not specified'}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Location:</span> {professional.location || 'Not specified'}</p>
                      {professional.cropSpecialization && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Crop:</span> {professional.cropSpecialization}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="map-section lg:col-span-2">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Agricultural Professional Locations</h2>
              <div className="map-wrapper rounded-lg overflow-hidden border-2 border-green-200 mb-4">
                {searchResults.length > 0 && (
                  <ProfessionalsMap 
                    searchResults={searchResults}
                    selectedProfessional={selectedProfessional}
                    setSelectedProfessional={setSelectedProfessional}
                    getProfessionalIcon={getProfessionalIcon}
                  />
                )}
              </div>
              
              {selectedProfessional && (
                <div className="selected-professional-details bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Selected Professional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
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
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-green-900 text-lg">{selectedProfessional.name}</h4>
                        <p className="text-sm text-green-700">{selectedProfessional.gender || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm"><span className="font-medium text-green-800">Expertise:</span><br/>{selectedProfessional.expertise || 'Not specified'}</p>
                        <p className="text-sm"><span className="font-medium text-green-800">Location:</span><br/>{selectedProfessional.location || 'Not specified'}</p>
                        
                        {selectedProfessional.cropSpecialization && (
                          <p className="text-sm">
                            <span className="font-medium text-green-800">Crop Specialization:</span><br/>
                            {selectedProfessional.cropSpecialization}
                          </p>
                        )}
                        
                        {selectedProfessional.contact && (
                          <p className="text-sm">
                            <span className="font-medium text-green-800">Contact:</span><br/>
                            {selectedProfessional.contact}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {selectedProfessional.address && (
                      <p className="text-sm col-span-2">
                        <span className="font-medium text-green-800">Address:</span><br/>
                        {selectedProfessional.address}
                      </p>
                    )}
                    
                    {selectedProfessional.link && (
                      <p className="text-sm col-span-2">
                        <span className="font-medium text-green-800">Website:</span><br/>
                        <a 
                          href={selectedProfessional.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Use the filters above and click "Search for Professionals" to find agricultural experts in your area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

ConnectFarmersPage.propTypes = {
  isCollapsed: PropTypes.bool
};

export default ConnectFarmersPage; 