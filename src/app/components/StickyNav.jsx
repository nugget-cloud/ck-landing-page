'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'what-are', title: 'What are Exoplanets' },
  { id: 'why-search', title: 'Why Search' },
  { id: 'how-find', title: 'How We Find' },
  { id: 'types', title: 'Types' },
  { id: 'future', title: 'Future' },
  { id: 'AR', title: 'AR' },
];

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState('what-are');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-8 z-40 py-4 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center space-x-2 bg-black backdrop-blur-md rounded-full px-8 py-4 border border-gray-600 shadow-2xl">
          {sections.map((section, index) => (
            <>
              <button
                key={section.id}
                onClick={() => document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${activeSection === section.id ? 'bg-white text-black' : 'bg-gray-600 text-white'}`}>
                  {index + 1}
                </div>
                <span className={`text-base font-medium ${activeSection === section.id ? 'text-white' : 'text-gray-300'}`}>
                  {section.title}
                </span>
              </button>
              {index < sections.length - 1 && <div className="w-12 h-0.5 bg-gray-500"></div>}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
