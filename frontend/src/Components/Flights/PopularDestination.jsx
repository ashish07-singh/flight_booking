import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import image1 from '../../assets/1.jpg';
import image2 from '../../assets/2.jpg';
import image3 from '../../assets/3.jpg';
import image4 from '../../assets/4.jpg';
import image5 from '../../assets/5.jpg';
import image6 from '../../assets/sing.jpg'; // Add this import for Singapore image

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
// === useMediaQuery Hook ===
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener); // Fallback
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);
  return matches;
};
// ===========================
const PopularDestinations = () => {
  const navigate = useNavigate();
  // ✅ Media query detection
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = !isMobile && !isTablet;
  // ✅ Local YYYY-MM-DD formatter
  const formatLocalYMD = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const tomorrowStr = (() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return formatLocalYMD(t);
  })();
  const destinations = [
    { name: 'Paris', code: 'PAR', image: image1, origin: 'DEL', airline: 'AF', flightNo: 'AF101', passengerName: 'J. DOE', gate: 'A01' },
    { name: 'Moscow', code: 'SVO', image: image2, origin: 'DEL', airline: 'SU', flightNo: 'SU200', passengerName: 'P.PATEL', gate: 'B02' },
    { name: 'Maldives', code: 'MLE', image: image3, origin: 'DEL', airline: '6E', flightNo: '6E123', passengerName: 'H.CHEN', gate: 'C03' },
    { name: 'Bangkok', code: 'BKK', image: image4, origin: 'DEL', airline: 'TG', flightNo: 'TG300', passengerName: 'S.KP', gate: 'D04' },
    { name: 'Dubai', code: 'DXB', image: image5, origin: 'DEL', airline: 'EK', flightNo: 'EK510', passengerName: 'JP.N', gate: 'E05' },
    { name: 'Singapore', code: 'SIN', image: image6, origin: 'DEL', airline: 'SQ', flightNo: 'SQ403', passengerName: 'A.SINGH', gate: 'F06' }, // Added Singapore
  ];
  // ✅ Price state
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const controller = new AbortController();
    const fetchAll = async () => {
      try {
        console.log('🚀 PopularDestination: Starting flight data fetch...', { API_BASE, tomorrowStr });
        const requests = destinations.map((d) => {
          const url = `${API_BASE}/api/flights/search?origin=${encodeURIComponent(d.origin)}&destination=${encodeURIComponent(d.code)}&depart_date=${encodeURIComponent(tomorrowStr)}&one_way=true`;
          console.log(`📡 PopularDestination: Fetching ${d.code} from ${d.origin}`, url);
          return fetch(url, { signal: controller.signal })
            .then((r) => r.json())
            .catch((e) => ({ error: e?.message || 'Network error' }));
        });
        const results = await Promise.all(requests);
        console.log('📊 PopularDestination: API Results:', results);
        const priceMap = {};
        const errMap = {};
        results.forEach((res, i) => {
          const code = destinations[i].code;
          console.log(`🔍 PopularDestination: Processing ${code}:`, res);
          if (res?.success && Array.isArray(res.data)) {
            const minPrice = res.data.reduce((min, f) => {
              const p = Number(f?.price ?? f?.value ?? Infinity);
              return isFinite(p) && p < min ? p : min;
            }, Infinity);
            if (isFinite(minPrice)) {
              priceMap[code] = minPrice;
              console.log(`✅ PopularDestination: ${code}: ₹${minPrice}`);
            } else {
              errMap[code] = 'No fares';
              console.log(`❌ PopularDestination: ${code}: No fares found`);
            }
          } else {
            errMap[code] = res?.error || 'API error';
            console.log(`❌ PopularDestination: ${code}: API error`, res?.error);
          }
        });
        console.log('💰 PopularDestination: Final priceMap:', priceMap);
        console.log('🚫 PopularDestination: Final errMap:', errMap);
        setPrices(priceMap);
        setErrors(errMap);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => controller.abort();
  }, []); // run once
  const handleViewFlights = (destination) => {
    navigate('/flights/results', {
      state: {
        origin: 'DEL',
        destination: destination.code,
        depart_date: tomorrowStr,
        one_way: true,
        originInput: 'New Delhi, India',
        destinationInput: destination.name,
        currency: 'inr',
      },
    });
  };
  // ==== Animation Variants ====
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    whileHover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  // ============================
  return (
    <>
      <style>
        {`
          .ticket-perforation-line {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 2px;
            background-image: radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 1px);
            background-size: 8px 2px;
            background-repeat: repeat-x;
            transform: translateY(-50%);
            z-index: 1;
          }
          .stub-destination-name {}
          .destination-card {
            transition: all 0.3s ease;
          }
          .destination-card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
      <div className="mb-20 mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore the world's most breathtaking places and find your next adventure.
          </p>
        </motion.div>
        
        {/* Grid Container */}
        <div className={`
          grid grid-cols-1 gap-6
          ${isTablet ? 'md:grid-cols-2' : ''}
          ${isDesktop ? 'lg:grid-cols-3' : ''}
        `}>
          {destinations.map((destination, index) => {
            const livePrice = prices[destination.code];
            const err = errors[destination.code];
            
            // Debug logging for each destination
            console.log(`🎯 PopularDestination Rendering ${destination.code}:`, { 
              livePrice, 
              err, 
              loading, 
              priceExists: !!livePrice,
              errorExists: !!err 
            });
            return (
              <motion.div
                key={destination.name}
                className="destination-card flex bg-white rounded-3xl shadow-xl border border-gray-100 cursor-pointer overflow-hidden"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                onClick={() => handleViewFlights(destination)}
              >
                {/* === Left Stub === */}
                <div className="relative flex-shrink-0 w-20 bg-gradient-to-br from-gray-50 to-gray-100 border-r-2 border-dashed border-gray-200 p-2 overflow-hidden">
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 -rotate-90 text-[8px] font-semibold text-gray-500 uppercase tracking-widest opacity-75">
                    BOARDING PASS
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-lg font-bold text-gray-800 tracking-wider">
                    {destination.name.toUpperCase()}
                  </div>
                </div>
                {/* === Main Body === */}
                <div className="flex-grow flex flex-col bg-white">
                  <div className={`relative overflow-hidden ${isMobile ? 'h-40' : 'h-44'}`}>
                    <img src={destination.image} alt={destination.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="p-4 flex-grow relative flex flex-col justify-between">
                    <div className="ticket-perforation-line -mt-4"></div>
                    <div>
                      <div className="flex items-center justify-between mb-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Flight</p>
                          <p className={`font-bold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
                            {destination.airline}{destination.flightNo}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase font-medium">Origin</p>
                          <p className={`font-bold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
                            {destination.origin}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Passenger</p>
                          <p className={`font-semibold text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {destination.passengerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase font-medium">Gate</p>
                          <p className={`font-semibold text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {destination.gate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start mt-auto">
                      <p className="text-sm text-gray-500">Flights starting from</p>
                      <p className={`font-extrabold text-blue-600 mt-1 ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                        {loading && !livePrice && !err
                          ? 'Fetching…'
                          : err
                          ? '—'
                          : `₹${Number(livePrice).toLocaleString('en-IN')}`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default PopularDestinations;