'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Users, TrendingUp, Brain, Zap, Shield, Globe, Menu, X } from 'lucide-react';

const Index = () => {
  // ... keep existing code (useState and useEffect hooks) the same
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check visibility of elements for scroll-triggered animations
      const elements = document.querySelectorAll('[data-animate]');
      const newVisible = {};
      
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        newVisible[index] = isInView;
      });
      
      setIsVisible(newVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Personalized AI Coaching",
      description: "Advanced AI algorithms analyze individual leadership styles and create tailored development paths for maximum growth potential.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track progress with comprehensive dashboards and insights that measure leadership effectiveness and team engagement in real-time.",
      gradient: "from-lime-500 to-green-500"
    },
    {
      icon: Users,
      title: "Scalable Programs",
      description: "Deploy consistent leadership development across your entire organization with automated program management and progress tracking.",
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Provide leaders with immediate, actionable feedback through AI-powered assessments and 360-degree evaluation tools.",
      gradient: "from-emerald-500 to-green-700"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance, ensuring your leadership data and insights remain protected and confidential.",
      gradient: "from-green-600 to-teal-500"
    },
    {
      icon: Globe,
      title: "Global Integration",
      description: "Seamlessly integrate with existing HR systems and tools, supporting multi-language and cross-cultural leadership development.",
      gradient: "from-lime-600 to-green-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Leaders Developed" },
    { number: "89%", label: "Improvement Rate" },
    { number: "500+", label: "Enterprise Clients" },
    { number: "24/7", label: "AI Support" }
  ];

  // Parallax effect calculation
  const parallaxOffset = scrollY * 0.3;
  const heroParallax = scrollY * 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 overflow-x-hidden relative">
      {/* Animated Background Elements with Beams and Tracing */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating background shapes */}
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div 
          className="absolute top-40 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
          style={{ transform: `translateY(${-parallaxOffset}px)`, animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
          style={{ transform: `translateY(${parallaxOffset * 0.5}px)`, animationDelay: '4s' }}
        />

        {/* Animated Beams */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-beam-horizontal" style={{ animationDelay: '0s' }} />
        <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-beam-horizontal" style={{ animationDelay: '2s' }} />
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-lime-400 to-transparent animate-beam-vertical" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-beam-vertical" style={{ animationDelay: '3s' }} />
        
        {/* Diagonal Beams */}
        <div className="absolute top-0 left-0 w-1 h-1 bg-gradient-to-br from-green-400 to-transparent animate-beam-diagonal opacity-60" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-0 right-0 w-1 h-1 bg-gradient-to-bl from-emerald-400 to-transparent animate-beam-diagonal opacity-60" style={{ animationDelay: '4.5s' }} />

        {/* SVG Tracing Animations */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="traceGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0)" />
              <stop offset="50%" stopColor="rgba(34, 197, 94, 0.8)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </linearGradient>
            <linearGradient id="traceGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.6)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
            </linearGradient>
          </defs>
          
          {/* Circuit-like tracing paths */}
          <path
            d="M0,200 Q200,50 400,200 T800,200 L1200,200"
            stroke="url(#traceGradient1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10 5"
            className="animate-circuit-trace"
            style={{ animationDelay: '0s' }}
          />
          <path
            d="M0,400 L200,400 L200,600 L600,600 L600,300 L1200,300"
            stroke="url(#traceGradient2)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="animate-trace-path"
            style={{ animationDelay: '2s' }}
          />
          <path
            d="M200,100 Q400,300 600,100 Q800,300 1000,100"
            stroke="rgba(34, 197, 94, 0.4)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5 10"
            className="animate-circuit-trace"
            style={{ animationDelay: '4s' }}
          />
          
          {/* Energy flow nodes */}
          <circle
            cx="200"
            cy="200"
            r="3"
            fill="rgba(34, 197, 94, 0.8)"
            className="animate-glow-pulse"
            style={{ animationDelay: '1s' }}
          />
          <circle
            cx="600"
            cy="300"
            r="2"
            fill="rgba(16, 185, 129, 0.6)"
            className="animate-glow-pulse"
            style={{ animationDelay: '3s' }}
          />
          <circle
            cx="800"
            cy="400"
            r="4"
            fill="rgba(34, 197, 94, 0.7)"
            className="animate-glow-pulse"
            style={{ animationDelay: '5s' }}
          />
        </svg>

        {/* Energy Flow Particles */}
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-green-400 rounded-full animate-energy-flow opacity-70" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-energy-flow opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-lime-400 rounded-full animate-energy-flow opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-green-500 rounded-full animate-energy-flow opacity-80" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-emerald-300 rounded-full animate-energy-flow opacity-40" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 rounded-lg mt-2 border border-white/20 shadow-lg">
        {/* ... keep existing code (navigation content) the same */}
        <div className="flex items-center space-x-2 animate-fade-in">
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center animate-pulse-glow">
            <Brain className="w-5 h-5 text-white animate-rotate-slow" />
          </div>
          <span className="text-xl font-bold text-slate-800">Culture Kitchen</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#about" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#contact" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <button className="border border-green-200 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md">
            Sign In
          </button>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow">
            Get Started
          </button>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b animate-slide-down shadow-lg">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <a href="#features" className="block text-slate-600 hover:text-slate-800 transition-colors duration-300">Features</a>
            <a href="#about" className="block text-slate-600 hover:text-slate-800 transition-colors duration-300">About</a>
            <a href="#contact" className="block text-slate-600 hover:text-slate-800 transition-colors duration-300">Contact</a>
            <button className="block w-full text-left border border-green-200 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md transition-all duration-300">
              Sign In
            </button>
            <button className="block w-full text-left bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-md transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* ... keep existing code (all remaining sections: hero, stats, features, CTA, footer) the same */}
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 text-center relative z-10">
        <div 
          className="animate-fade-in-up" 
          style={{ 
            transform: `translateY(${heroParallax}px)`, 
            transition: 'transform 0.1s ease-out' 
          }}
        >
          <div className="mb-6 inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm animate-bounce-slow border border-green-200 shadow-lg">
            🚀 Now in Beta - Join Early Access
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight animate-fade-in-up">
            <span className="inline-block hover:animate-scale-bounce transition-all duration-300">AI-Powered</span>
            <span className="bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600 bg-clip-text text-transparent block animate-gradient bg-300% bg-position-0">
              Leadership Development
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-0 animation-delay-400" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Transform your organization's leadership capabilities with our intelligent platform that automates personalized learning programs and accelerates leadership growth at scale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <button className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg px-8 py-3 rounded-md flex items-center transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu">
              <span className="group-hover:animate-pulse">Start Free Trial</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
          
          <div className="text-sm text-slate-500 animate-fade-in-up opacity-0 flex items-center justify-center space-x-6" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No credit card required
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              14-day free trial
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Setup in minutes
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              data-animate
              className={`text-center transform transition-all duration-1000 hover:scale-110 ${
                isVisible[index] ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl font-bold text-slate-800 mb-2 animate-count-up bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-slate-600 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 relative z-10">
        <div 
          className="text-center mb-16"
          style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
        >
          <h2 className="text-5xl font-bold text-slate-800 mb-6 animate-fade-in-up">
            Revolutionize Leadership Development
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Our AI-driven platform combines cutting-edge technology with proven leadership principles 
            to deliver personalized growth experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                data-animate
                className={`group p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-white/90 backdrop-blur-lg rounded-xl hover:scale-105 hover:-translate-y-4 transform-gpu relative overflow-hidden ${
                  isVisible[index + 4] ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className={`relative w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg animate-pulse-glow`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-green-600 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 w-0 group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div 
          className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 text-center overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
          style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-90" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-spin" />
            <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
            <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white/30 rounded-full animate-pulse" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in-up">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Join hundreds of forward-thinking organizations already using Culture Kitchen to develop 
              exceptional leaders and drive business results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button className="group bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="group-hover:animate-pulse">Start Your Free Trial</span>
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-slate-200 relative z-10 bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center animate-pulse-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Culture Kitchen</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Empowering leaders through AI-driven development programs that scale with your organization.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">Product</h4>
            <ul className="space-y-3 text-slate-600">
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Features</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Pricing</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">Company</h4>
            <ul className="space-y-3 text-slate-600">
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">About</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">Support</h4>
            <ul className="space-y-3 text-slate-600">
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Documentation</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-300 hover:translate-x-1 inline-block">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 text-center text-slate-600 animate-fade-in-up">
          <p className="text-lg">&copy; 2025 Culture Kitchen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
