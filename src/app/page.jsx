'use client';

import { useEffect } from 'react';
import Chatbot from './components/Chatbot';

export default function Page() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      const rateTwo = scrolled * -0.3;
      const rateThree = scrolled * -0.1;
      
      // Parallax effect on space background
      const spaceBg = document.getElementById('space-bg');
      const celestialObjects = document.getElementById('celestial-objects');
      
      if (spaceBg) {
        spaceBg.style.transform = `translateY(${rate}px)`;
      }
      
      if (celestialObjects) {
        celestialObjects.style.transform = `translateY(${rateTwo}px)`;
      }
      
      // Create focus zone with dimming above and below viewport
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Define focus zone - main viewport plus some buffer
        const focusZoneTop = -viewportHeight * 0.2; // 20% above viewport
        const focusZoneBottom = viewportHeight * 1.2; // 20% below viewport
        
        // Calculate section center position
        const sectionCenter = rect.top + rect.height / 2;
        
        if (sectionCenter >= focusZoneTop && sectionCenter <= focusZoneBottom) {
          // Section is in the focus zone - full brightness
          section.style.opacity = 1;
        } else {
          // Section is outside focus zone - calculate dimming
          let distanceFromFocusZone;
          
          if (sectionCenter < focusZoneTop) {
            // Section is above focus zone
            distanceFromFocusZone = focusZoneTop - sectionCenter;
          } else {
            // Section is below focus zone  
            distanceFromFocusZone = sectionCenter - focusZoneBottom;
          }
          
          // Apply gradual dimming based on distance from focus zone
          const maxDimmingDistance = viewportHeight * 0.5;
          const dimmingFactor = Math.min(distanceFromFocusZone / maxDimmingDistance, 1);
          const minOpacity = 0.3;
          const opacity = 1 - (dimmingFactor * (1 - minOpacity));
          
          section.style.opacity = Math.max(minOpacity, opacity);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Sophisticated Space Background */}
      <div className="fixed inset-0 z-0" id="space-bg">
        {/* Subtle starfield */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="subtle-star absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Nebula clouds */}
        <div className="nebula-cloud absolute top-1/4 right-1/3 w-80 h-80 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
        <div className="nebula-cloud absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-tl from-gray-500/3 to-transparent rounded-full blur-3xl"></div>

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="space-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${8 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Subtle celestial objects */}
      <div className="fixed inset-0 z-0 pointer-events-none" id="celestial-objects">
        {/* Distant planet silhouettes */}
        <div className="absolute top-1/5 right-1/6 w-24 h-24 rounded-full bg-white/10 blur-sm" style={{ animation: 'subtleFloat 15s ease-in-out infinite' }}></div>
        <div className="absolute top-2/3 left-1/8 w-16 h-16 rounded-full bg-gray-300/8 blur-sm" style={{ animation: 'subtleFloat 18s ease-in-out infinite -5s' }}></div>
        <div className="absolute top-1/2 right-1/2 w-12 h-12 rounded-full bg-white/5 blur-md" style={{ animation: 'subtleFloat 20s ease-in-out infinite -10s' }}></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 flex justify-between items-center p-8">
        <div className="text-white">
          <h1 className="text-3xl font-bold leading-tight gradient-text">Space</h1>
          <p className="text-xl font-light -mt-1 text-gray-300">Port</p>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-300 text-sm">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          <a href="#examples" className="hover:text-white transition-colors">Examples</a>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
          <a href="#models" className="hover:text-white transition-colors">Models</a>
        </nav>
        <button className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
          Get Started →
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-20 min-h-[80vh]">
        <div className="text-center mb-8 sm:mb-12 max-w-6xl">
          <h2 className="hero-title text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-tight mb-6 sm:mb-8">
            NASA Exoplanet
            <br />
            <span className="gradient-text">Data Pipeline</span>
          </h2>
          
          <p className="text-gray-300 text-xl md:text-2xl font-light max-w-4xl mx-auto mb-12 leading-relaxed">
            Transform thousands of lines of complex astronomical data processing into elegant, 
            simple queries. Access NASA's exoplanet archives with Query Builder, TAP services, 
            and seamless data migration.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl">
              🚀 Start Exploring
            </button>
            <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-black transition-all">
              📖 View Documentation
            </button>
          </div>
        </div>

        {/* Code Preview */}
        <div className="w-full max-w-4xl mt-16">
          <div className="code-block rounded-xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-gray-400 text-sm font-mono">simple_pipeline.py</span>
            </div>
            <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
              <code>{`# Transform complex NASA data access into simple queries
from nasa_port.data_bindings import NASAPipeline
from nasa_port.builder.query_builder import QueryBuilder

# Create pipeline instance
pipeline = NASAPipeline.for_local_development(
    pipeline_name="exoplanet_discoveries"
)

# Build query for recent discoveries
query = (
    QueryBuilder()
    .select(['pl_name', 'hostname', 'disc_year'])
    .from_table(TableName.PLANETARY_SYSTEMS)
    .where_confirmed()
    .order_by('disc_year', ascending=False)
    .limit(10)
)

# Execute and get results - thousands of lines replaced!
results = pipeline.load_custom_query(query, "recent_discoveries")`}</code>
            </pre>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-8 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-5xl font-bold text-center text-white mb-16">
            Powerful <span className="gradient-text">Features</span>
          </h3>
          
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
                <code className="text-sm text-blue-300 font-mono">
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
                <code className="text-sm text-green-300 font-mono">
                  {`pipeline.load_custom_query(
    query, destination="duckdb"
)`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="relative z-10 py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-6">
              From Thousands of Lines to <span className="gradient-text">Three Steps</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditional NASA data access requires complex authentication, API handling, data parsing, 
              and database management. Space Port simplifies this into three elegant steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
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

          <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h4 className="text-3xl font-bold text-white mb-6 text-center">
              🎯 What Space Port Replaces
            </h4>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h5 className="text-xl font-bold text-red-400 mb-4">❌ Traditional Approach</h5>
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
                <h5 className="text-xl font-bold text-green-400 mb-4">✅ Space Port Approach</h5>
                <ul className="space-y-3 text-gray-300">
                  <li>• <code className="text-blue-300">NASAPipeline.for_local_development()</code></li>
                  <li>• <code className="text-purple-300">QueryBuilder().select().where()</code></li>
                  <li>• <code className="text-green-300">pipeline.load_custom_query()</code></li>
                  <li className="text-gray-500">• Everything else handled automatically</li>
                </ul>
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 font-medium">
                    🚀 <strong>Result:</strong> 1000+ lines reduced to 10 lines of elegant Python
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Example Section */}
      <section id="examples" className="relative z-10 py-24 px-8 bg-gradient-to-b from-gray-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-6">
              Complete <span className="gradient-text">Pipeline Example</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              See how Space Port transforms complex NASA exoplanet data pipeline into a simple, 
              runnable script that handles everything from data fetching to database storage.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Code Example */}
            <div className="code-block rounded-xl p-6 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm font-mono">complete_pipeline_example.py</span>
              </div>
              <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto">
                <code>{`#!/usr/bin/env python3
"""
A complete NASA Port data pipeline example.
Demonstrates the three core steps:
1. Import NASAPipeline
2. Create pipeline instance  
3. Execute with load_* method
"""

import sys
from pathlib import Path
import duckdb

# Add src to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from nasa_port.data_bindings import NASAPipeline
from nasa_port.builder.query_builder import QueryBuilder
from nasa_port.builder.models import TableName

def run_pipeline():
    print("🚀 Starting NASA exoplanet pipeline...")
    
    # 1. Configure pipeline for local development
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
    
    # 3. Execute pipeline - handles everything automatically!
    print("⏳ Running pipeline...")
    load_info = pipeline.load_custom_query(
        query=recent_planets_query,
        resource_name="recent_discoveries"
    )
    
    print(f"✅ Success! Processed {len(load_info.load_packages)} packages")
    
    # 4. Query results from created database
    with duckdb.connect(str(db_path), read_only=True) as con:
        tables = con.execute("SHOW TABLES").fetchall()
        print(f"📊 Created tables: {[t[0] for t in tables]}")
        
        if tables:
            results = con.execute(
                f"SELECT pl_name, hostname, disc_year "
                f"FROM {tables[0][0]} LIMIT 5"
            ).fetchall()
            
            print("\\n🪐 Recent Exoplanet Discoveries:")
            for planet, host, year in results:
                print(f"  {planet} (orbiting {host}, {year})")

if __name__ == "__main__":
    run_pipeline()
    print("\\n🎉 Pipeline complete!")`}</code>
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
            </div>              <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">🎯 Output Example</h4>
                <div className="font-mono text-sm text-gray-300 space-y-1">
                  <div>🚀 Starting NASA exoplanet pipeline...</div>
                  <div>⏳ Running pipeline...</div>
                  <div>✅ Success! Processed 1 packages</div>
                  <div>📊 Created tables: ['recent_discoveries']</div>
                  <div className="mt-2 text-white">🪐 Recent Exoplanet Discoveries:</div>
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
      </section>

      {/* Community Section */}
      <section id="community" className="relative z-10 py-24 px-8 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-6">
              <span className="gradient-text">Community</span> Contributions
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Join the Space Port community! Share your pipeline implementations, contribute to the ecosystem, 
              and help fellow researchers access NASA's exoplanet data more efficiently.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Share Your Pipeline */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold mr-3">+</span>
                Share Your Pipeline
              </h4>
              <p className="text-gray-300 mb-6">
                Contribute your Space Port pipeline implementations to help the community. Share specialized 
                queries, data processing workflows, and analysis tools.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pipeline Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Multi-Star System Analysis"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe what your pipeline does and its use cases..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                  <input
                    type="text"
                    placeholder="exoplanets, habitable-zone, transit-analysis"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Submit Pipeline
                </button>
              </form>
            </div>

            {/* Community Stats */}
            <div className="space-y-8">
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">Community Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">1,247</div>
                    <div className="text-sm text-gray-400">Shared Pipelines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">3,892</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">15.2M</div>
                    <div className="text-sm text-gray-400">Exoplanets Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">847</div>
                    <div className="text-sm text-gray-400">Contributors</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">Featured Contributors</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-xs font-bold">
                        AE
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">AstroExplorer</div>
                        <div className="text-gray-400 text-xs">23 pipelines</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">⭐ 1,247</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        DR
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">DataRanger</div>
                        <div className="text-gray-400 text-xs">18 pipelines</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">⭐ 892</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-black text-xs font-bold">
                        SP
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">SpacePython</div>
                        <div className="text-gray-400 text-xs">15 pipelines</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">⭐ 743</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Pipelines Grid */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold text-white mb-8 text-center">Recent Community Contributions</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Habitable Zone Hunter",
                  author: "AstroExplorer",
                  description: "Identifies potentially habitable exoplanets based on distance from their host star and planetary characteristics.",
                  tags: ["habitable-zone", "earth-like", "analysis"],
                  stars: 234,
                  language: "Python"
                },
                {
                  title: "Transit Light Curves",
                  author: "DataRanger", 
                  description: "Processes NASA transit photometry data to extract planetary radius and orbital period measurements.",
                  tags: ["transit", "photometry", "kepler"],
                  stars: 189,
                  language: "Python"
                },
                {
                  title: "Multi-Star Systems",
                  author: "SpacePython",
                  description: "Analyzes complex multi-star systems and their planetary companions using advanced orbital mechanics.",
                  tags: ["binary-stars", "orbital-dynamics", "complex-systems"],
                  stars: 156,
                  language: "Python"
                },
                {
                  title: "Atmospheric Analysis", 
                  author: "CosmicCoder",
                  description: "Pipeline for processing spectroscopic data to determine exoplanet atmospheric composition.",
                  tags: ["spectroscopy", "atmosphere", "jwst"],
                  stars: 143,
                  language: "Python"
                },
                {
                  title: "Planet Population Stats",
                  author: "StatSpace",
                  description: "Statistical analysis of exoplanet populations across different stellar types and galactic regions.",
                  tags: ["statistics", "population", "demographics"],
                  stars: 128,
                  language: "Python"
                },
                {
                  title: "Radial Velocity Hunter",
                  author: "VelocityVoyager",
                  description: "Detects exoplanets using radial velocity method and calculates precise orbital parameters.",
                  tags: ["radial-velocity", "doppler", "detection"],
                  stars: 112,
                  language: "Python"
                }
              ].map((pipeline, index) => (
                <div key={index} className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-white/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="text-lg font-bold text-white">{pipeline.title}</h5>
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {pipeline.stars}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{pipeline.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pipeline.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">by {pipeline.author}</div>
                    <button className="text-white hover:text-gray-300 transition-colors text-sm">
                      View Code →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" className="relative z-10 py-24 px-8 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-6">
              Hosted <span className="gradient-text">Models</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Access pre-trained models and analytical tools hosted by the Space Port community. 
              These models are ready to use with your NASA exoplanet data pipelines.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Exoplanet Classification Model",
                description: "Machine learning model that classifies exoplanets into categories: terrestrial, super-Earth, Neptune-like, and gas giant based on physical properties.",
                author: "MLAstronomer",
                status: "Active",
                usage: "1.2K",
                endpoint: "/api/models/classify",
                features: ["Mass prediction", "Radius estimation", "Composition analysis"]
              },
              {
                title: "Habitability Score Calculator", 
                description: "Calculates habitability scores for exoplanets based on stellar flux, atmospheric conditions, and orbital characteristics.",
                author: "HabitableWorlds",
                status: "Active", 
                usage: "847",
                endpoint: "/api/models/habitability",
                features: ["Temperature modeling", "Atmosphere analysis", "Water probability"]
              },
              {
                title: "Transit Duration Predictor",
                description: "Predicts transit durations and depths for exoplanets using orbital mechanics and stellar parameters.",
                author: "TransitTracker",
                status: "Active",
                usage: "623", 
                endpoint: "/api/models/transit",
                features: ["Duration prediction", "Depth calculation", "Timing analysis"]
              }
            ].map((model, index) => (
              <div key={index} className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-white/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{model.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>by {model.author}</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        {model.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-6">{model.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h5 className="text-white text-sm font-medium mb-2">Features:</h5>
                    <ul className="space-y-1">
                      {model.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-300 text-sm flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">API Endpoint:</div>
                    <code className="text-white text-sm font-mono">{model.endpoint}</code>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-sm">{model.usage} uses this month</div>
                  <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                    Use Model
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-gray-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-700 transition-all">
              Browse All Models ({Math.floor(Math.random() * 20) + 15})
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 bg-gray-900/60 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold gradient-text mb-2">Space Port</h3>
            <p className="text-gray-400">Simplifying NASA exoplanet data access for researchers worldwide</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
              🚀 Get Started Now
            </button>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Examples</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-gray-500 text-sm">
            <p>&copy; 2024 Space Port. Empowering astronomical research through elegant data pipelines.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}