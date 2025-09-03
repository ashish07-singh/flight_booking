import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FlightDealsGrid from "../Components/Flights/DestinationCarousel";
import PopularDestinations from "../Components/Flights/PopularDestination";
import FeatureHighlight from "../Components/Flights/FeatureHighlight";
import FAQFlight from "../Components/Flights/FAQFlight";
import bcg from '../assets/bcg.webp';

const navItems = [
  { name: "Flights", icon: "✈️", path: "/" },
  { name: "Hotels", icon: "🏨", path: "/soon" },
  { name: "Homestays & Villas", icon: "🏠", path: "/soon" },
  { name: "Holiday Packages", icon: "🌴", path: "/soon" },
  { name: "Trains", icon: "🚆", path: "/soon" },
  { name: "Buses", icon: "🚌", path: "/soon" },
  { name: "Cabs", icon: "🚕", path: "/soon" },
  { name: "Tours & Attractions", icon: "🎈", path: "/soon" },
  { name: "Visa", icon: "🛂", path: "/soon" },
  { name: "Cruise", icon: "🛳️", path: "/soon" },
  { name: "ForexCard & Currency", icon: "💵", path: "/soon" },
  { name: "Travel Insurance", icon: "🛡️", path: "/soon" },
];

const Flight = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneWay");
  const [fromLocation, setFromLocation] = useState({
    city: "Delhi",
    airport: "DEL, Delhi Airport India",
    code: "DEL"
  });
  const [toLocation, setToLocation] = useState({
    city: "Mumbai",
    airport: "BOM, Chhatrapati Shivaji International...",
    code: "BOM"
  });
  // Set default date to tomorrow
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  const [departureDate, setDepartureDate] = useState(getTomorrowDate());
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  
  // Autocomplete states
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  
  // Refs for timers
  const fromTimer = useRef(null);
  const toTimer = useRef(null);

  // Fetch city suggestions
  const fetchCitySuggestions = async (input, setSuggestions) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestionLoading(true);
    try {
      const res = await axios.get('https://autocomplete.travelpayouts.com/places2', {
        params: { term: input, locale: 'en' },
      });
      console.log('API Response:', res.data); // Debug log
      setSuggestions(res.data || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
      setSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Handle input changes with debouncing
  const handleFromInputChange = (e) => {
    const value = e.target.value;
    setFromLocation({ ...fromLocation, city: value });
    
    // Clear previous timer
    if (fromTimer.current) {
      clearTimeout(fromTimer.current);
    }
    
    // Set new timer for debounced search
    fromTimer.current = setTimeout(() => {
      if (value.length >= 2) {
        fetchCitySuggestions(value, setFromSuggestions);
        setShowFromSuggestions(true);
      } else {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      }
    }, 300);
  };

  const handleToInputChange = (e) => {
    const value = e.target.value;
    setToLocation({ ...toLocation, city: value });
    
    // Clear previous timer
    if (toTimer.current) {
      clearTimeout(toTimer.current);
    }
    
    // Set new timer for debounced search
    toTimer.current = setTimeout(() => {
      if (value.length >= 2) {
        fetchCitySuggestions(value, setToSuggestions);
        setShowToSuggestions(true);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
    }, 300);
  };

  // Handle suggestion selection
  const selectFromSuggestion = (suggestion) => {
    console.log('Selecting from suggestion:', suggestion); // Debug log
    setFromLocation({
      city: suggestion.name || suggestion.city_name,
      airport: `${suggestion.code || suggestion.iata}, ${suggestion.name || suggestion.city_name}`,
      code: suggestion.code || suggestion.iata
    });
    setShowFromSuggestions(false);
    setFromSuggestions([]);
  };

  const selectToSuggestion = (suggestion) => {
    console.log('Selecting to suggestion:', suggestion); // Debug log
    setToLocation({
      city: suggestion.name || suggestion.city_name,
      airport: `${suggestion.code || suggestion.iata}, ${suggestion.name || suggestion.city_name}`,
      code: suggestion.code || suggestion.iata
    });
    setShowToSuggestions(false);
    setToSuggestions([]);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (fromTimer.current) clearTimeout(fromTimer.current);
      if (toTimer.current) clearTimeout(toTimer.current);
    };
  }, []);

  // Swap From ↔ To
  const handleSwap = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };



  // Search Submit
  const handleSearch = () => {
    // Validate required fields
    if (!departureDate) {
      alert("Please select a departure date");
      return;
    }

    if (!fromLocation.code || !toLocation.code) {
      alert("Please select valid origin and destination");
      return;
    }

    const searchData = {
      tripType,
      origin: fromLocation.code,
      destination: toLocation.code,
      depart_date: departureDate,
      return_date: tripType === "roundTrip" ? returnDate : null,
      one_way: tripType === "oneWay",
      travellers,
      travelClass,
      originInput: fromLocation.city,
      destinationInput: toLocation.city,
      currency: 'inr'
    };

    console.log("Search Query:", searchData);
    
    // Navigate to results page with search data
    navigate('/flights/results', {
      state: searchData
    });
  };

  return (
    <>
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bcg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>

        <div className="relative z-10 pt-20 sm:pt-28 pb-16 min-h-screen flex flex-col items-center px-4 sm:px-0">
          {/* Navigation */}
          <div className="bg-gray-200 rounded-t-lg mt-16 sm:mt-20 shadow-lg flex w-full max-w-6xl mx-auto overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 mx-1 cursor-pointer relative
                  ${item.name === "Flights" ? "text-blue-600" : "text-gray-700"}
                `}
              >
                <span className="text-2xl sm:text-3xl">{item.icon}</span>
                <span className="text-[10px] sm:text-xs mt-1 font-medium text-center">
                  {item.name}
                </span>
                {item.name === "Flights" && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 pt-6 sm:pt-8 w-full max-w-7xl mx-auto flex flex-col space-y-4 sm:space-y-6">
            {/* Trip Type */}
            <div className="flex flex-wrap items-center gap-4 sm:space-x-6 text-gray-800">
              {["oneWay",].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value={type}
                    checked={tripType === type}
                    onChange={() => setTripType(type)}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">
                    {type === "oneWay" ? "One Way" : type === "roundTrip" ? "Round Trip" : "Multi City"}
                  </span>
                </label>
              ))}
            </div>

            {/* Flight Search Inputs */}
            <div className="flex flex-col lg:flex-row bg-gray-50 border border-gray-200 rounded-lg divide-y lg:divide-y-0 lg:divide-x divide-gray-200 shadow-sm mb-4 sm:mb-6">
              {/* From */}
              <div className="flex-1 p-3 sm:p-4 hover:bg-gray-100 relative">
                <span className="block text-[11px] sm:text-xs text-gray-500 font-medium mb-1">From</span>
                <input
                  type="text"
                  value={fromLocation.city}
                  onChange={handleFromInputChange}
                  onFocus={() => fromSuggestions.length > 0 && setShowFromSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 300)}
                  className="w-full bg-transparent text-lg sm:text-xl font-bold text-gray-800 outline-none"
                  placeholder="Enter city or airport"
                />
                <p className="text-xs sm:text-sm text-gray-600 truncate">{fromLocation.airport}</p>
                
                {/* From Suggestions Dropdown */}
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestionLoading ? (
                      <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : (
                      fromSuggestions.slice(0, 10).map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectFromSuggestion(suggestion);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        >
                          <div className="font-medium text-gray-800">
                            {suggestion.name || suggestion.city_name || suggestion.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {suggestion.code || suggestion.iata} - {suggestion.country_name || suggestion.country}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Swap */}
              <div className="flex items-center justify-center p-2 sm:p-3 lg:p-2 cursor-pointer" onClick={handleSwap}>
                <span className="text-2xl sm:text-3xl text-gray-400 rotate-90">↔️</span>
              </div>

              {/* To */}
              <div className="flex-1 p-3 sm:p-4 hover:bg-gray-100 relative">
                <span className="block text-[11px] sm:text-xs text-gray-500 font-medium mb-1">To</span>
                <input
                  type="text"
                  value={toLocation.city}
                  onChange={handleToInputChange}
                  onFocus={() => toSuggestions.length > 0 && setShowToSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 300)}
                  className="w-full bg-transparent text-lg sm:text-xl font-bold text-gray-800 outline-none"
                  placeholder="Enter city or airport"
                />
                <p className="text-xs sm:text-sm text-gray-600 truncate">{toLocation.airport}</p>
                
                {/* To Suggestions Dropdown */}
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestionLoading ? (
                      <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : (
                      toSuggestions.slice(0, 10).map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectToSuggestion(suggestion);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        >
                          <div className="font-medium text-gray-800">
                            {suggestion.name || suggestion.city_name || suggestion.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {suggestion.code || suggestion.iata} - {suggestion.country_name || suggestion.country}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Departure */}
              <div className="flex-1 p-3 sm:p-4 hover:bg-gray-100">
                <span className="block text-[11px] sm:text-xs text-gray-500 font-medium mb-1">Departure</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent text-lg sm:text-xl font-bold text-gray-800 outline-none"
                />
              </div>

              {/* Return (only if round trip) */}
              {/* {tripType === "roundTrip" && (
                <div className="flex-1 p-4 hover:bg-gray-100">
                  <span className="block text-xs text-gray-500 font-medium mb-1">Return</span>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-gray-800 outline-none"
                  />
                </div>
              )} */}
            </div>

            {/* Travellers & Class */}
            {/* <div className="flex items-center space-x-6">
              <div>
                <label className="block text-xs text-gray-500">Travellers</label>
                <input
                  type="number"
                  min="1"
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Class</label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
              </div>
            </div> */}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="mt-4 -mb-4 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-xl font-bold py-2 px-6 sm:px-10 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105"
          >
            SEARCH
          </button>


        </div>
      </div>

      {/* Other Components */}
      <FlightDealsGrid />
      <PopularDestinations />
      <FeatureHighlight />
      <FAQFlight />
    </>
  );
};

export default Flight;
