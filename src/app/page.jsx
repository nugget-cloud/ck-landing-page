'use client';

import { useEffect, useState } from 'react';
import Chatbot from './components/Chatbot';
import StickyNav from './components/StickyNav';

export default function Page() {
  const [userType, setUserType] = useState(null); 
  const [showSelection, setShowSelection] = useState(true);
  const [showAR, setShowAR] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const handleARClick = () => {
    setShowAR(!showAR);
  };
  
  // Prediction model state
  const [predictionData, setPredictionData] = useState({
    pl_orbper: '',     // Orbital Period (days)
    pl_rade: '',       // Planet Radius (Earth radii)
    pl_bmasse: '',     // Planet Mass (Earth masses)
    pl_dens: '',       // Planet Density (g/cm^3)
    pl_orbsmax: '',    // Orbital Semi-Major Axis (AU)
    pl_orbeccen: '',   // Orbital Eccentricity
    pl_insol: '',      // Insolation Flux (Earth flux)
    pl_eqt: '',        // Equilibrium Temperature (K)
    st_teff: '',       // Stellar Effective Temperature (K)
    st_rad: '',        // Stellar Radius (Solar radii)
    st_mass: '',       // Stellar Mass (Solar masses)
    st_logg: ''        // Stellar Surface Gravity (log g)
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  // Handle prediction form input changes
  const handlePredictionInputChange = (field, value) => {
    setPredictionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit prediction to API
  const submitPrediction = async () => {
    setIsLoadingPrediction(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      // Convert string values to numbers for the API
      const numericData = Object.fromEntries(
        Object.entries(predictionData).map(([key, value]) => [
          key, 
          value === '' ? null : parseFloat(value)
        ])
      );

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Prediction failed');
      }

      setPredictionResult(result);
    } catch (error) {
      setPredictionError(error.message);
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  // Load example exoplanet data
  const loadExampleData = () => {
    setPredictionData({
      pl_orbper: '365.25',      // 1 Earth year
      pl_rade: '1.0',          // 1 Earth radius  
      pl_bmasse: '1.0',        // 1 Earth mass
      pl_dens: '5.51',         // Earth density
      pl_orbsmax: '1.0',       // 1 AU
      pl_orbeccen: '0.017',    // Earth's eccentricity
      pl_insol: '1.0',         // 1 Earth flux
      pl_eqt: '255',           // Earth equilibrium temp
      st_teff: '5778',         // Sun temperature
      st_rad: '1.0',           // 1 Solar radius
      st_mass: '1.0',          // 1 Solar mass
      st_logg: '4.44'          // Sun surface gravity
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3; 
      const rateTwo = scrolled * -0.2;
      
      const spaceBg = document.getElementById('space-bg');
      const celestialObjects = document.getElementById('celestial-objects');
      
      if (spaceBg) {
        spaceBg.style.transform = `translateY(${rate}px)`;
      }
      
      if (celestialObjects) {
        celestialObjects.style.transform = `translateY(${rateTwo}px)`;
      }
      
      const focusOverlay = document.getElementById('focus-overlay');
      if (focusOverlay) {
        focusOverlay.remove();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="main-container min-h-screen bg-transparent relative">
      <div className="fixed inset-0 w-full h-full z-[-1]" id="space-bg">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="subtle-star absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 200}%`, 
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        <div className="nebula-cloud absolute top-1/4 right-1/3 w-80 h-80 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
        <div className="nebula-cloud absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-tl from-gray-500/3 to-transparent rounded-full blur-3xl"></div>
        <div className="nebula-cloud absolute top-3/4 right-1/5 w-72 h-72 bg-gradient-to-bl from-white/3 to-transparent rounded-full blur-3xl"></div>
        <div className="nebula-cloud absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-tr from-gray-400/2 to-transparent rounded-full blur-3xl"></div>

        {[...Array(50)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="space-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 200}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${8 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none" id="celestial-objects">
        <div className="absolute top-1/5 right-1/6 w-24 h-24 rounded-full bg-white/10 blur-sm" style={{ animation: 'subtleFloat 15s ease-in-out infinite' }}></div>
        <div className="absolute top-2/3 left-1/8 w-16 h-16 rounded-full bg-gray-300/8 blur-sm" style={{ animation: 'subtleFloat 18s ease-in-out infinite -5s' }}></div>
        <div className="absolute top-1/2 right-1/2 w-12 h-12 rounded-full bg-white/5 blur-md" style={{ animation: 'subtleFloat 20s ease-in-out infinite -10s' }}></div>
        <div className="absolute top-4/5 left-3/4 w-20 h-20 rounded-full bg-gray-400/6 blur-sm" style={{ animation: 'subtleFloat 17s ease-in-out infinite -8s' }}></div>
        <div className="absolute top-1/3 left-1/5 w-14 h-14 rounded-full bg-white/8 blur-md" style={{ animation: 'subtleFloat 19s ease-in-out infinite -3s' }}></div>
      </div>

      <div className="fixed inset-0 w-full z-[-2] bg-black"></div>

      <header className="relative z-20 flex justify-between items-center p-8">
        <div className="text-white">
          <h1 className="text-3xl font-bold leading-tight gradient-text">Space</h1>
          <p className="text-xl font-light -mt-1 text-gray-300">Port</p>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-300 text-sm">
          {userType === 'beginner' ? (
            <>
              <a href="#what-are" className="hover:text-white transition-colors text-sm">What are Exoplanets</a>
              <a href="#why-search" className="hover:text-white transition-colors text-sm">Why Search</a>
              <a href="#how-find" className="hover:text-white transition-colors text-sm">How We Find</a>
              <a href="#types" className="hover:text-white transition-colors text-sm">Types</a>
              <a href="#future" className="hover:text-white transition-colors text-sm">Future</a>
              <a href="#AR" className="hover:text-white transition-colors text-sm">AR</a>
            </>
          ) : (
            <>
              <a href="#prediction" className="hover:text-white transition-colors">AI Model</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
              <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
              <a href="#examples" className="hover:text-white transition-colors">Examples</a>
            </>
          )}
        </nav>
        {userType && (
          <button 
            onClick={() => setUserType(userType === 'beginner' ? 'developer' : 'beginner')}
            className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
          >
            {userType === 'beginner' ? 'Switch to Developer →' : 'Switch to Learning →'}
          </button>
        )}
        {!userType && (
          <button 
            onClick={() => setShowSelection(true)}
            className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started →
          </button>
        )}
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-20 min-h-[80vh]">
        <div className="text-center mb-8 sm:mb-12 max-w-6xl">
          <h2 className="hero-title text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-tight mb-6 sm:mb-8">
            NASA's Exoplanet
            <br />
            <span className="gradient-text">Challenge</span>
          </h2>
          
          <p className="text-gray-300 text-xl md:text-2xl font-light max-w-4xl mx-auto mb-12 leading-relaxed">
Discover and explore exoplanets effortlessly with AI-powered detection, interactive Python SDK, intelligent assistant, and immersive AR 3D visualizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          </div>
        </div>

      </main>
      {!userType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black starry-background">
          <div className="bg-black p-6 max-w-xl mx-4 animate-fade-in starry-background">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Choose Your Path</h3>
            <p className="text-white text-center mb-6">
              Tell us about yourself so we can show you the most relevant content
            </p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setUserType('beginner')}
                className="text-white p-4 transition-all transform hover:scale-105 border border-white/20 hover:border-white/50"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div className="text-left">
                    <h4 className="text-lg font-bold">I'm New to Exoplanets</h4>
                    <p className="text-white text-sm">Learn the basics and discover amazing worlds</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setUserType('developer')}
                className="text-white p-4 transition-all transform hover:scale-105 border border-white/20 hover:border-white/50"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <div className="text-left">
                    <h4 className="text-lg font-bold">I'm a Developer/Researcher</h4>
                    <p className="text-white text-sm">Access NASA data with powerful Python tools</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beginner Learning Section */}
      {userType === 'beginner' && (
        <>
          {/* Sticky Progress Navigation */}
          <StickyNav />

          {/* Learning Hero */}
          <section className="relative z-10 py-24 px-8 text-center">
            <div className="max-w-6xl mx-auto">
              <h2 className="hero-title text-5xl md:text-7xl font-bold text-white mb-8">
                Discover <span className="gradient-text">Exoplanets</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Journey into the fascinating world of planets beyond our solar system. 
                Learn what exoplanets are, how we find them, and why they're crucial for understanding our universe.
              </p>
              
              {/* Visual Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="text-lg text-gray-400">5,000+</div>
                  <div className="text-base text-white font-medium">Discovered</div>
                </div>
                <div className="text-center p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-lg text-gray-400">100+</div>
                  <div className="text-base text-white font-medium">Earth-like</div>
                </div>
                <div className="text-center p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-lg text-gray-400">4.2</div>
                  <div className="text-base text-white font-medium">Light-years</div>
                </div>
                <div className="text-center p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="text-lg text-gray-400">Billions</div>
                  <div className="text-base text-white font-medium">In Galaxy</div>
                </div>
              </div>
            </div>
          </section>

          <section id="what-are" className="relative z-10 py-24 px-8 bg-gradient-to-b from-gray-900/30 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">What are Exoplanets?</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Exoplanets, or extrasolar planets, are planets that exist outside our solar system, 
                  orbiting stars other than our Sun.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">The Basics</h4>
                  <div className="space-y-6">
                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                      <h5 className="text-2xl font-bold text-white mb-4">Definition</h5>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        An exoplanet is any planet beyond our solar system. Most orbit other stars, 
                        but some free-floating exoplanets, called rogue planets, orbit the galactic center 
                        and are untethered to any star.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                      <h5 className="text-2xl font-bold text-white mb-4">Numbers</h5>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Over 5,000 exoplanets have been confirmed so far, with thousands more candidates 
                        awaiting confirmation. Scientists estimate there could be trillions of exoplanets 
                        in our galaxy alone.
                      </p>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                      <h5 className="text-2xl font-bold text-white mb-4">Discovery</h5>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        The first exoplanet around a main-sequence star was discovered in 1995. 
                        Since then, space telescopes like Kepler and TESS have revolutionized our 
                        ability to find these distant worlds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/20 rounded-2xl p-8 border border-gray-700">
                  <h5 className="text-xl font-bold text-white mb-4 text-center">Proxima Centauri b</h5>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 relative">
                    <div className="aspect-video bg-gray-700 rounded flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="animate-pulse">
                          <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 relative">
                            <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-6 left-12 animate-pulse"></div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">Interactive Exoplanet Visualization</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Click to explore on NASA's website
                        </p>
                      </div>
                      <a 
                        href="https://science.nasa.gov/exoplanet-catalog/proxima-centauri-b/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <span className="text-white bg-blue-600 px-4 py-2 rounded-lg">
                          View on NASA →
                        </span>
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm text-center">
                    The closest known exoplanet to Earth, located just 4.2 light-years away 
                    in the habitable zone of Proxima Centauri.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Search for Exoplanets */}
          <section id="why-search" className="relative z-10 py-24 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">Why Do We Search for Exoplanets?</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  The search for exoplanets drives some of the most important questions in science and philosophy.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Search for Life</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Finding Earth-like planets in habitable zones could reveal whether life 
                    exists elsewhere in the universe, answering one of humanity's greatest questions.
                  </p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Future Homes</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Understanding exoplanets helps us identify potential future homes for humanity 
                    and learn about planetary formation and evolution.
                  </p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Scientific Discovery</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Each exoplanet teaches us about physics, chemistry, and the incredible 
                    diversity of planetary systems in our galaxy.
                  </p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Technology Advancement</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    The challenge of detecting distant worlds drives innovation in telescopes, 
                    sensors, and data analysis techniques.
                  </p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Cosmic Perspective</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Discovering the abundance of exoplanets changes our perspective on Earth's 
                    place in the cosmos and our responsibility to protect it.
                  </p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Understanding Origins</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Studying diverse planetary systems helps us understand how our own 
                    solar system formed and evolved over billions of years.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Find Exoplanets */}
          <section id="how-find" className="relative z-10 py-24 px-8 bg-gradient-to-b from-gray-900/30 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">How Do We Find Exoplanets?</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Scientists use several clever methods to detect planets light-years away.
                </p>
              </div>

              <div className="space-y-12">
                {/* Transit Method */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h4 className="text-3xl font-bold text-white mb-6">Transit Method</h4>
                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                      <p className="text-gray-300 text-lg">
                        When a planet passes in front of its star (as seen from Earth), it blocks 
                        a tiny amount of the star's light. This creates a periodic dimming that 
                        we can detect with sensitive instruments.
                      </p>
                    </div>
                    <ul className="space-y-4 text-gray-300 text-lg">
                      <li><strong className="text-white">Success Rate:</strong> Found over 70% of confirmed exoplanets</li>
                      <li><strong className="text-white">What We Learn:</strong> Planet size, orbital period, and sometimes atmosphere</li>
                      <li><strong className="text-white">Tools:</strong> Kepler, TESS, and ground-based telescopes</li>
                    </ul>
                  </div>
                  <div className="bg-gray-900/20 rounded-2xl p-6 border border-gray-700">
                    <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center relative overflow-hidden">
                      {/* Star */}
                      <div className="absolute w-24 h-24 bg-gradient-to-br from-gray-300 to-white rounded-full shadow-2xl"></div>
                      
                      {/* Planet transit animation */}
                      <div className="absolute w-6 h-6 bg-gray-700 rounded-full animate-transit"></div>
                      
                      {/* Light curve representation */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-8 bg-gray-700 rounded flex items-center">
                          <div className="w-full h-1 bg-gray-500 rounded relative">
                            <div className="absolute w-4 h-2 bg-gray-600 rounded animate-dip"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 text-center mt-1">Light Curve</div>
                      </div>
                      
                      <div className="absolute bottom-16 left-0 right-0 text-center">
                        <div className="text-white mb-1 font-medium">Transit Method</div>
                        <div className="text-sm text-gray-400">Planet crossing star dims light</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radial Velocity Method */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="bg-gray-900/20 rounded-2xl p-6 border border-gray-700 lg:order-1">
                    <div className="bg-gray-800 rounded-lg p-4 h-64 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Central Star with wobble animation */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-300 rounded-full animate-star-wobble shadow-lg"></div>
                        
                        {/* Orbiting Planet */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-gray-600 rounded-full animate-orbit"></div>
                        </div>
                      </div>
                      
                      {/* Spectrum Display */}
                      <div className="mt-6 w-full">
                        <div className="text-xs text-gray-400 mb-2 text-center">Spectral Line Shift</div>
                        <div className="h-4 w-full rounded animate-spectrum-shift"></div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Blue Shift</span>
                          <span>Red Shift</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:order-2">
                    <h4 className="text-3xl font-bold text-white mb-6">Radial Velocity Method</h4>
                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                      <p className="text-gray-300 text-lg">
                        A planet's gravity tugs on its star, causing the star to wobble slightly. 
                        This wobble changes the star's light spectrum, which we can measure 
                        using the Doppler effect.
                      </p>
                    </div>
                    <ul className="space-y-4 text-gray-300 text-lg">
                      <li><strong className="text-white">Best For:</strong> Large planets close to their stars</li>
                      <li><strong className="text-white">What We Learn:</strong> Planet mass and orbital characteristics</li>
                      <li><strong className="text-white">Tools:</strong> High-precision spectrographs on ground telescopes</li>
                    </ul>
                  </div>
                </div>

                {/* Direct Imaging */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h4 className="text-3xl font-bold text-white mb-6">Direct Imaging</h4>
                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                      <p className="text-gray-300 text-lg">
                        Sometimes we can actually photograph exoplanets directly by blocking out 
                        the star's light with a coronagraph. This is extremely challenging but 
                        provides the most direct evidence.
                      </p>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li><strong className="text-white">Best For:</strong> Young, hot planets far from their stars</li>
                      <li><strong className="text-white">What We Learn:</strong> Atmospheric composition and temperature</li>
                      <li><strong className="text-white">Tools:</strong> Advanced ground telescopes with adaptive optics</li>
                    </ul>
                  </div>
                  <div className="bg-gray-900/20 rounded-2xl p-6 border border-gray-700">
                    <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center relative overflow-hidden">
                      {/* Star being blocked */}
                      <div className="absolute">
                        <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-300 rounded-full animate-star-block shadow-2xl"></div>
                      </div>
                      
                      {/* Coronagraph disk */}
                      <div className="absolute">
                        <div className="w-16 h-16 bg-gray-900 border-2 border-white rounded-full animate-coronagraph flex items-center justify-center">
                          <div className="text-xs text-white text-center">CORONAGRAPH</div>
                        </div>
                      </div>
                      
                      {/* Revealed exoplanet */}
                      <div className="absolute top-8 right-8">
                        <div className="w-4 h-4 bg-gray-400 rounded-full animate-planet-reveal shadow-lg"></div>
                        <div className="text-xs text-gray-400 mt-1 animate-planet-reveal">Exoplanet!</div>
                      </div>
                      
                      {/* Camera/Telescope indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="text-xs text-gray-400 text-center mt-1">Direct Imaging</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Types of Exoplanets */}
          <section id="types" className="relative z-10 py-24 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">Types of Exoplanets</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Exoplanets come in amazing variety - some like planets in our solar system, 
                  others completely alien to our experience.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-white/30 transition-all">
                  <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Earth-like</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Rocky planets similar in size to Earth, potentially in the habitable zone 
                    where liquid water could exist.
                  </p>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded">Example: Kepler-452b</div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-white/30 transition-all">
                  <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Gas Giants</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Large planets composed mainly of gas, like Jupiter and Saturn. 
                    Some are much larger than anything in our solar system.
                  </p>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded">Example: HD 106906 b</div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-white/30 transition-all">
                  <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Hot Jupiters</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Giant planets that orbit extremely close to their stars, with surface 
                    temperatures hot enough to melt metal.
                  </p>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded">Example: 51 Pegasi b</div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-white/30 transition-all">
                  <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Super-Earths</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Rocky planets larger than Earth but smaller than Neptune. 
                    They're the most common type of exoplanet we've found.
                  </p>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded">Example: Proxima Centauri b</div>
                </div>
              </div>
            </div>
          </section>

          {/* Future of Exoplanet Research */}
          <section id="future" className="relative z-10 py-24 px-8 bg-gradient-to-b from-gray-900/30 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">The Future of Exoplanet Discovery</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Exciting new missions and technologies will revolutionize our understanding of exoplanets.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-6">James Webb Space Telescope</h4>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    JWST can analyze exoplanet atmospheres in unprecedented detail, 
                    searching for signs of water vapor, oxygen, and other biosignatures.
                  </p>
                  <div className="text-base text-white bg-green-900/30 border border-green-500/30 px-4 py-2 rounded-lg">Status: Active</div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-6">Roman Space Telescope</h4>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    Will use gravitational microlensing to find exoplanets, including 
                    free-floating planets and those in wide orbits.
                  </p>
                  <div className="text-base text-white bg-yellow-900/30 border border-yellow-500/30 px-4 py-2 rounded-lg">Launch: Mid-2020s</div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-6">Extremely Large Telescopes</h4>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    Ground-based telescopes with mirrors 30+ meters across will directly 
                    image Earth-like exoplanets and study their atmospheres.
                  </p>
                  <div className="text-base text-white bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-lg">Coming: 2030s</div>
                </div>
              </div>
            </div>
          </section>

          <section id="AR" className="relative z-10 py-24 px-8 bg-gradient-to-b from-gray-900/30 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-6">Popular Exoplanets 3D Models</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Rotate and zoom in on these interactive models of famous exoplanets.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                  <h4 className="text-2xl font-bold text-white mb-6">Kepler-22b</h4>
                  {/* <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    JWST can analyze exoplanet atmospheres in unprecedented detail, 
                    searching for signs of water vapor, oxygen, and other biosignatures.
                  </p> */}
                  <div className="sketchfab-embed-wrapper">
                    <iframe
                      title="Kepler 22b"
                      allowFullScreen
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      src="https://sketchfab.com/models/3589154676b7465c815a4aa1d8c4354a/embed"
                      width="100%"
                      height="400"
                      style={{ border: "none" }}
                    ></iframe>

                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "normal",
                        margin: "5px",
                        color: "#4A4A4A",
                      }}
                    >
                      <a
                        href="https://sketchfab.com/3d-models/kepler-22b-3589154676b7465c815a4aa1d8c4354a?utm_medium=embed&utm_campaign=share-popup&utm_content=3589154676b7465c815a4aa1d8c4354a"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Kepler 22b
                      </a>{" "}
                      by{" "}
                      <a
                        href="https://sketchfab.com/per.rb1?utm_medium=embed&utm_campaign=share-popup&utm_content=3589154676b7465c815a4aa1d8c4354a"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        per.rb1
                      </a>{" "}
                      on{" "}
                      <a
                        href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=3589154676b7465c815a4aa1d8c4354a"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Sketchfab
                      </a>
                    </p>
                  </div>
                  {/* AR Button */}
                  <button
                    onClick={handleARClick}
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#1CAAD9",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {showAR ? "Hide AR Marker" : "View in AR"}
                  </button>

                  {/* Hiro Marker */}
                  {showAR && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <img
                        src="/Hiro-marker.png"
                        alt="Hiro Marker for AR"
                        style={{ maxWidth: "300px", width: "100%" }}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                  <h4 className="text-2xl font-bold text-white mb-6">Kepler 186f</h4>
                  <div className="sketchfab-embed-wrapper">
                    <iframe
                      title="Kepler-186f"
                      allowFullScreen
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      src="https://sketchfab.com/models/c484b8b4aa9248b6998b6222d62f5a77/embed"
                      width="100%"
                      height="400"
                      style={{ border: "none" }}
                    ></iframe>

                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "normal",
                        margin: "5px",
                        color: "#4A4A4A",
                      }}
                    >
                      <a
                        href="https://sketchfab.com/3d-models/kepler-186f-c484b8b4aa9248b6998b6222d62f5a77"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Kepler-186f
                      </a>{" "}
                      by{" "}
                      <a
                        href="https://sketchfab.com/uperesito"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        uperesito
                      </a>{" "}
                      on{" "}
                      <a
                        href="https://sketchfab.com"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Sketchfab
                      </a>
                    </p>
                  </div>

                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                  <h4 className="text-2xl font-bold text-white mb-6">Kepler 452b</h4>
                  <div className="sketchfab-embed-wrapper">
                    <iframe
                      title="Kepler - 452b Planet"
                      allowFullScreen
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      src="https://sketchfab.com/models/8310c4ebc8c642feaba50996911f80e9/embed"
                      width="100%"
                      height="400"
                      style={{ border: "none" }}
                    ></iframe>

                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "normal",
                        margin: "5px",
                        color: "#4A4A4A",
                      }}
                    >
                      <a
                        href="https://sketchfab.com/3d-models/kepler-452b-planet-8310c4ebc8c642feaba50996911f80e9?utm_medium=embed&utm_campaign=share-popup&utm_content=8310c4ebc8c642feaba50996911f80e9"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Kepler - 452b Planet
                      </a>{" "}
                      by{" "}
                      <a
                        href="https://sketchfab.com/ahnaf.yasintx?utm_medium=embed&utm_campaign=share-popup&utm_content=8310c4ebc8c642feaba50996911f80e9"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Ahnaf Yasin
                      </a>{" "}
                      on{" "}
                      <a
                        href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=8310c4ebc8c642feaba50996911f80e9"
                        target="_blank"
                        rel="nofollow noreferrer"
                        style={{ fontWeight: "bold", color: "#1CAAD9" }}
                      >
                        Sketchfab
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div className="max-w-7xl mx-auto">
              <iframe
                src="https://nasa-exoplanet-plot.onrender.com/"
                width="100%"
                height="600px"
                frameborder="0"
                allowfullscreen>
              </iframe></div>
          </section>
        </>
      )}

      {/* Developer/Expert Section */}
      {(userType === 'developer' || userType === null) && (
        <>

      {/* Developer Tools & SDKs Section */}
      <section id="features" className="relative z-10 py-24 px-8 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-6">
              Developer <span className="gradient-text">Tools & Solutions</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
              We provide comprehensive tools for developers and researchers to access NASA's exoplanet data. 
              Whether you need powerful Python SDKs or ready-to-use machine learning models, we have you covered.
            </p>
          </div>

          {/* Main Offerings */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Python SDK */}
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-white/30 transition-all relative">
              <button
                onClick={() => document.getElementById('python-sdk-docs').scrollIntoView({ behavior: 'smooth' })}
                className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
              >
                Read the docs →
              </button>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-white rounded-xl mr-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">Python SDK</h4>
                  <p className="text-gray-400 text-lg">For building and maintaining data pipelines</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Our comprehensive Python SDK transforms complex NASA exoplanet data access into elegant, 
                maintainable code. Build robust data pipelines that can scale from prototype to production 
                with minimal configuration and maximum flexibility.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Intuitive Query Builder</h5>
                    <p className="text-gray-400 text-sm">Method chaining for complex ADQL queries without SQL expertise</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">30+ Data Destinations</h5>
                    <p className="text-gray-400 text-sm">Load data into any database, warehouse, or storage system</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Production-Ready Architecture</h5>
                    <p className="text-gray-400 text-sm">Built-in error handling, retry logic, and pipeline monitoring</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{`# Simple 3-line pipeline setup
pipeline = NASAPipeline.for_production()
query = QueryBuilder().select_habitable_planets()
pipeline.load_custom_query(query, "bigquery")`}</code>
                </pre>
              </div>
            </div>

            {/* Out-of-the-box ML Models */}
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-white/30 transition-all relative">
              <button
                onClick={() => document.getElementById('ai-prediction').scrollIntoView({ behavior: 'smooth' })}
                className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
              >
                Try it out →
              </button>
              <div className="flex items-center mb-6 text-black">
                <div className="w-16 h-16 bg-white text-black rounded-xl mr-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-black " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">ML Models</h4>
                  <p className="text-gray-400 text-lg">Ready-to-use machine learning inference</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Access pre-trained machine learning models for exoplanet research without the complexity 
                of model training or deployment. Run inference on astronomical data with simple API calls 
                and get instant, scientifically-validated predictions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Exoplanet Classification</h5>
                    <p className="text-gray-400 text-sm">Predict if celestial objects are confirmed exoplanets</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">REST API Integration</h5>
                    <p className="text-gray-400 text-sm">Simple HTTP endpoints for any programming language</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">NASA-Trained Models</h5>
                    <p className="text-gray-400 text-sm">Models trained on official NASA Exoplanet Archive data</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{`# Instant ML inference
response = requests.post("/api/predict", {
  "pl_orbper": 365.25, "pl_rade": 1.0
})
print(response.json()["prediction"])`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* AI-Powered Exoplanet Prediction Section - RIGHT AFTER CARDS */}
                    {/* AI-Powered Exoplanet Prediction Section - RIGHT AFTER CARDS */}
          <section id="ai-prediction" className="relative z-10 py-16 px-8">
          <div className="max-w-7xl mx-auto">
              <iframe
                src="https://ml-model-code-bloooded.onrender.com/"
                width="200px"
                height="600px"
                frameBorder="0"
                allowFullScreen>
              </iframe></div>
          </section>

          {/* Python SDK Documentation Section */}
          <section id="python-sdk-docs" className="relative z-10 py-16 px-8 bg-gradient-to-b from-transparent to-gray-900/20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-white mb-6">
                  Python SDK <span className="gradient-text">Documentation</span>
                </h3>
              </div>

              <div className="mb-16">
                <p className="text-xl font-medium text-gray-300 max-w-4xl mx-auto text-center mb-12">
                  Traditional NASA data access requires complex authentication, API handling, data parsing, 
                  and database management. Space Port simplifies this into three elegant steps.
                </p>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-black text-2xl font-bold">
                      1
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">Import & Configure</h4>
                    <p className="text-gray-300">
                      Import NASAPipeline and configure your destination with a single line.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                      2
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">Build Query</h4>
                    <p className="text-gray-300">
                      Use QueryBuilder to construct your astronomical data query with method chaining.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto mb-6 flex items-center justify-center text-black text-2xl font-bold">
                      3
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">Execute Pipeline</h4>
                    <p className="text-gray-300">
                      Call load_custom_query() and let the pipeline handle the rest automatically.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12">
                  <h4 className="text-3xl font-bold text-white mb-8 text-center">
                    What Space Port Replaces
                  </h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-xl font-bold text-red-400 mb-4">Traditional Approach</h5>
                      <ul className="space-y-3 text-gray-300">
                        <li>• Manual API authentication setup</li>
                        <li>• Complex HTTP request handling</li>
                        <li>• Raw ADQL query construction</li>
                        <li>• Response parsing and validation</li>
                        <li>• Database connection management</li>
                        <li>• Error handling and retry logic</li>
                        <li>• Data transformation pipelines</li>
                        <li>• Pagination and rate limiting</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-white-400 text-bold mb-4">Space Port Approach</h5>
                      <ul className="space-y-3 text-gray-300">
                        <li>• <code className="text-blue-300">NASAPipeline.for_local_development()</code></li>
                        <li>• <code className="text-purple-300">QueryBuilder().select().where()</code></li>
                        <li>• <code className="text-green-300">pipeline.load_custom_query()</code></li>
                        <li className="text-gray-500">• Everything else handled automatically</li>
                      </ul>
                      <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-300 font-medium">
                          <strong>Result:</strong> 1000+ lines reduced to 10 lines of elegant Python
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 30+ Destinations Section */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h4 className="text-3xl font-bold text-white mb-6">
                    30+ <span className="gradient-text">Destinations</span>
                  </h4>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                    Space Port supports a wide range of destinations for your NASA exoplanet data. 
                    Simply change the destination parameter to load data into your preferred platform.
                  </p>
                </div>

                {/* Code Example showing destination flexibility */}
                <div className="max-w-4xl mx-auto mb-12">
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="ml-4 text-gray-400 text-sm font-mono">flexible_destinations.py</span>
                    </div>
                    <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                      <code>{`# Same pipeline, different destinations - just change one parameter!

# Load to Google BigQuery
pipeline.load_custom_query(query, destination="bigquery")

# Load to Snowflake
pipeline.load_custom_query(query, destination="snowflake") 

# Load to PostgreSQL
pipeline.load_custom_query(query, destination="postgres")

# Load to DuckDB (local)
pipeline.load_custom_query(query, destination="duckdb")

# Load to AWS Redshift  
pipeline.load_custom_query(query, destination="redshift")

# Load to Vector Database
pipeline.load_custom_query(query, destination="weaviate")`}</code>
                    </pre>
                  </div>
                </div>

                {/* Destinations Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  
                  {/* Cloud Data Warehouses */}
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">Cloud Warehouses</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Google BigQuery</li>
                      <li>• Amazon Redshift</li>
                      <li>• Snowflake</li>
                      <li>• Azure Synapse</li>
                      <li>• AWS Athena / Glue</li>
                    </ul>
                  </div>

                  {/* Analytics Platforms */}
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">Analytics Platforms</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Databricks</li>
                      <li>• ClickHouse</li>
                      <li>• 🧪 Dremio</li>
                      <li>• DuckDB</li>
                      <li>• MotherDuck</li>
                    </ul>
                  </div>

                  {/* Traditional Databases */}
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-600 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">SQL Databases</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• PostgreSQL</li>
                      <li>• Microsoft SQL Server</li>
                      <li>• 30+ SQL databases</li>
                      <li>• (SQLAlchemy powered)</li>
                      <li>• Custom destinations</li>
                    </ul>
                  </div>

                  {/* Modern Formats & Vector DBs */}
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">Modern & Vector</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Delta Lake</li>
                      <li>• Apache Iceberg</li>
                      <li>• Weaviate</li>
                      <li>• LanceDB</li>
                      <li>• Qdrant</li>
                    </ul>
                  </div>
                </div>

                {/* Storage Options */}
                <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
                  <h4 className="text-2xl font-bold text-white mb-6 text-center">
                    📁 Storage & Filesystem Support
                  </h4>
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <h5 className="text-xl font-bold text-white mb-2">Cloud Storage</h5>
                      <p className="text-gray-300 text-sm">
                        S3, Google Cloud Storage, Azure Blob, and other cloud filesystem destinations
                      </p>
                    </div>
                    <div>
                      <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h5 className="text-xl font-bold text-white mb-2">Local Filesystem</h5>
                      <p className="text-gray-300 text-sm">
                        Local files, network drives, and filesystem-based destinations for development
                      </p>
                    </div>
                    <div>
                      <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <h5 className="text-xl font-bold text-white mb-2">Custom Destination</h5>
                      <p className="text-gray-300 text-sm">
                        Build your own destination connector for specialized or proprietary systems
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-300 mb-6">
                    Change destinations without changing your pipeline logic - just update the configuration!
                  </p>
                  <div className="inline-block bg-gray-900/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700">
                    <code className="text-white font-mono text-sm">
                      pipeline.config.destination = <span className="text-green-300">"your_preferred_destination"</span>
                    </code>
                  </div>
                </div>
              </div>

              {/* Complete Pipeline Example */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h4 className="text-3xl font-bold text-white mb-6">
                    Complete <span className="gradient-text">Pipeline Example</span>
                  </h4>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                    See how Space Port transforms complex NASA exoplanet data pipeline into a simple, 
                    runnable script that handles everything from data fetching to database storage.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Code Example */}
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="ml-4 text-gray-400 text-sm font-mono">complete_pipeline_example.py</span>
                    </div>
                    <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                      <code>{`
# Complete NASA Exoplanet Data Pipeline Example
from nasa_port.data_bindings import NASAPipeline
from nasa_port.builder.query_builder import QueryBuilder
from nasa_port.builder.models import TableName

def run_pipeline():
    # 1. Configure pipeline
    db_path = Path("pipeline_output/discoveries.duckdb")
    db_path.parent.mkdir(parents=True, exist_ok=True)
    
    pipeline = NASAPipeline.for_local_development(
        pipeline_name="recent_discoveries",
        data_dir="pipeline_output"
    )
    pipeline.config.destination_params["database_path"] = str(db_path)
    
    # 2. Build query for 10 most recent discoveries
    recent_planets_query = (
        QueryBuilder()
        .select(['pl_name', 'hostname', 'discoverymethod', 
                'disc_year', 'sy_dist'])
        .from_table(TableName.PLANETARY_SYSTEMS)
        .where_confirmed()
        .order_by('disc_year', ascending=False)
        .limit(10)
    )
    
    load_info = pipeline.load_custom_query(
        query=recent_planets_query,
        resource_name="recent_discoveries"
    )
    
    run_pipeline()
`}</code>
                    </pre>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-8">
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold mr-3">1</div>
                      <h4 className="text-xl font-bold text-white">Pipeline Configuration</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      <code className="text-white">NASAPipeline.for_local_development()</code> automatically 
                      configures authentication, database connections, and error handling. No manual setup required.
                    </p>
                  </div>

                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-500/30 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                      <h4 className="text-xl font-bold text-white">Query Building</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      The <code className="text-gray-300">QueryBuilder</code> uses method chaining to construct 
                      complex ADQL queries. Supports filtering, sorting, joins, and advanced astronomical functions.
                    </p>
                  </div>

                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-400/30 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold mr-3">3</div>
                      <h4 className="text-xl font-bold text-white">Data Pipeline Execution</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      <code className="text-gray-300">load_custom_query()</code> executes the complete data pipeline: 
                      TAP service calls, data transformation, validation, and database storage.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-white mb-4">Output Example</h4>
                      <div className="font-mono text-sm text-gray-300 space-y-1">
                        <div>Starting NASA exoplanet pipeline...</div>
                        <div>Running pipeline...</div>
                        <div>Success! Processed 1 packages</div>
                        <div>Created tables: ['recent_discoveries']</div>
                        <div className="mt-2 text-white">Recent Exoplanet Discoveries:</div>
                        <div className="ml-4 text-gray-400">
                          TOI-715 b (orbiting TOI-715, 2024)<br />
                          K2-415 b (orbiting K2-415, 2024)<br />
                          HD 110067 c (orbiting HD 110067, 2024)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation */}
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-white mb-6">Installation</h4>
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                    <code>{`# Install Space Port Python SDK
pip install space-port

# Or with conda
conda install -c conda-forge space-port`}</code>
                  </pre>
                </div>
              </div>

              {/* Quick Start */}
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-white mb-6">Quick Start</h4>
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                    <code>{`from nasa_port.data_bindings import NASAPipeline
from nasa_port.builder.query_builder import QueryBuilder
from nasa_port.builder.models import TableName

# 1. Initialize pipeline for local development
pipeline = NASAPipeline.for_local_development(
    pipeline_name="my_exoplanet_pipeline",
    data_dir="./pipeline_output"
)

# 2. Build your query using the intuitive QueryBuilder
query = (
    QueryBuilder()
    .select(['pl_name', 'hostname', 'disc_year', 'pl_rade'])
    .from_table(TableName.PLANETARY_SYSTEMS)
    .where_confirmed()
    .where('pl_rade', '>', 0.5)
    .where('pl_rade', '<', 2.0)
    .order_by('disc_year', ascending=False)
    .limit(100)
)

# 3. Load data to your destination
load_info = pipeline.load_custom_query(
    query=query,
    resource_name="earth_like_planets"
)

print(f"✅ Successfully loaded {load_info.rows_loaded} planets!")
print(f"📊 Data saved to: {load_info.destination_path}")`}</code>
                  </pre>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">Production Configuration</h4>
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                      <code>{`# Production-ready setup
pipeline = NASAPipeline.for_production(
    pipeline_name="exoplanet_etl",
    destination="bigquery",
    project_id="my-project",
    dataset_id="nasa_data"
)

# Configure error handling
pipeline.config.retry_attempts = 3
pipeline.config.timeout_seconds = 300
pipeline.config.error_notification = "slack"

# Schedule pipeline
pipeline.schedule(cron="0 2 * * *")  # Daily at 2 AM`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">Multiple Destinations</h4>
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                      <code>{`# Load to multiple destinations
destinations = [
    "postgres://user:pass@host/db",
    "s3://bucket/prefix/",
    "duckdb://local.db"
]

for dest in destinations:
    pipeline.load_custom_query(
        query=query,
        destination=dest,
        resource_name=f"planets_{dest.split('://')[0]}"
    )`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* API Reference Link */}
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h4 className="text-2xl font-bold text-white mb-4">Need More Details?</h4>
                  <p className="text-gray-300 mb-6">
                    Check out our complete API reference for detailed documentation on all classes, methods, and configuration options.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
                      API Reference →
                    </a>
                    <a href="#" className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-500 transition-all">
                      Examples Repository →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Features Grid */}
          <div className="feature-grid grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {/* Query Builder */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
              <div className="w-16 h-16 bg-white rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Query Builder</h4>
              <p className="text-gray-300 leading-relaxed">
                Intuitive Python interface for building complex astronomical queries. 
                Chain methods to create sophisticated ADQL queries without writing raw SQL.
              </p>
              <div className="mt-6 code-block rounded p-4">
                <code className="text-sm text-green-300 font-mono">
                  {`query.select(['pl_name', 'sy_dist'])
    .where_confirmed()
    .order_by('disc_year')`}
                </code>
              </div>
            </div>

            {/* TAP Access */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
              <div className="w-16 h-16 bg-gray-600 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">TAP Services</h4>
              <p className="text-gray-300 leading-relaxed">
                Direct access to NASA Exoplanet Archive through Table Access Protocol (TAP). 
                Query live data with ADQL support for real-time astronomical research.
              </p>
              <div className="mt-6 code-block rounded p-4">
                <code className="text-sm text-purple-300 font-mono">
                  {`pipeline.tap_service.query(
    "SELECT * FROM ps WHERE pl_orbper < 1"
)`}
                </code>
              </div>
            </div>

            {/* Data Migration */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
              <div className="w-16 h-16 bg-gray-400 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Data Migration</h4>
              <p className="text-gray-300 leading-relaxed">
                Seamless data pipeline from NASA archives to your preferred database. 
                Configure once, migrate thousands of records with built-in error handling.
              </p>
              <div className="mt-6 code-block rounded p-4">
                <code className="text-sm text-gray-300 font-mono">
                  {`pipeline.load_custom_query(
    query, destination="bigquery"
)`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>
     
      <footer className="relative z-10 py-12 px-8 bg-gray-900/60 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold gradient-text mb-2">Space Port</h3>
            <p className="text-gray-400">Simplifying NASA exoplanet data access for researchers worldwide</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8">
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Examples</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-gray-500 text-sm">
            <p>&copy; 2025 Space Port. Empowering astronomical research through elegant data pipelines.</p>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
