'use client';

import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'stats', 'query'

  // 🧩 Separate message states
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your Space Port assistant. I can help you with NASA exoplanet data, and also provide your date of birth to see your relation with exoplanets. How can I assist you today?",
    },
  ]);

  const [statsMessages, setStatsMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to Exoplanet Stats! I can fetch and explain key statistics about exoplanets, like detection methods, radius, or host stars. What would you like to know?",
    },
  ]);

  const [queryBuilder, setQueryBuilder] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to Exoplanet Query Builder! I can help you construct dataset filters or SQL-like queries to explore exoplanet data. What would you like to build?",
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, statsMessages, queryBuilder, activeTab]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    let setMessages;
    if (activeTab === 'chat') setMessages = setChatMessages;
    else if (activeTab === 'stats') setMessages = setStatsMessages;
    else if (activeTab === 'query') setMessages = setQueryBuilder;

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: activeTab,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I’m having trouble connecting right now. Please try again or check the documentation.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessages = (messages) => (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          } items-end space-x-2`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
              <span className="text-black text-xs font-bold">SP</span>
            </div>
          )}
          <div
            className={`max-w-[75%] p-4 rounded-2xl ${
              message.role === 'user'
                ? 'bg-white text-black rounded-br-lg'
                : 'bg-gray-800/80 text-white border border-white/10 rounded-bl-lg'
            } shadow-lg`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          {message.role === 'user' && (
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start items-end space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
            <span className="text-black text-xs font-bold">SP</span>
          </div>
          <div className="bg-gray-800/80 text-white p-4 rounded-2xl rounded-bl-lg border border-white/10 shadow-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </>
  );

  // Sample queries
  const sampleQueries = {
    chat: [
      "Tell me a fun fact about exoplanets",
      "Explain Kepler mission in simple terms"
    ],
    stats: [
      "Number of exoplanets with radius > 2 Earth radii",
      "Average orbital period of confirmed planets"
    ],
    query: [
      "Fetch the names of all exoplanets discovered by Kepler",
      "Fetch the top 10 nearest exoplanets to Earth"
    ]
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-110 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[450px] h-[650px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-black to-gray-900/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-black text-sm font-bold">SP</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Space Port AI</h3>
                <p className="text-gray-400 text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Online • Gemini Powered
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-black/40">
            {[
              { id: 'chat', label: 'Chat' },
              { id: 'stats', label: 'Exoplanet Stats' },
              { id: 'query', label: 'Query Builder' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                } transition-all`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black to-gray-900/30">
            {activeTab === 'chat' && renderMessages(chatMessages)}
            {activeTab === 'stats' && renderMessages(statsMessages)}
            {activeTab === 'query' && renderMessages(queryBuilder)}
          </div>

          {/* Sample Queries */}
          <div className="px-6 pb-2">
            <h4 className="text-gray-400 text-xs mb-1">Sample Queries:</h4>
            <div className="flex flex-wrap gap-2">
              {sampleQueries[activeTab].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => document.getElementById('chatForm')?.requestSubmit(), 100);
                  }}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-xs transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          {(activeTab === 'chat' || activeTab === 'stats' || activeTab == 'query') && (
            <form
              id="chatForm"
              onSubmit={sendMessage}
              className="p-6 border-t border-white/10 bg-black/50"
            >
              <div className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      activeTab === 'chat'
                        ? 'Ask about NASA pipelines, queries, or data migration...'
                        : 'Ask about exoplanet trends, detections, or discoveries...'
                    }
                    className="w-full px-4 py-3 bg-gray-900/80 text-white border border-white/20 rounded-xl focus:outline-none focus:border-white/40 focus:bg-gray-900 transition-all placeholder-gray-500 text-sm"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Press Enter to send • AI responses may take a moment
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
