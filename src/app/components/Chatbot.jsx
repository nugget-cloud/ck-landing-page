'use client';

import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('wiki'); // Default: wiki
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your Space Port assistant. Choose a mode below (Wiki / Table) and ask your question!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: 'Space Port - NASA Exoplanet Data Pipeline Library',
          mode: mode === 'wiki' ? 1 : 2, // ✅ Added mode here
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "⚠️ I’m having trouble connecting. Please try again or check our documentation.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
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
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-black to-gray-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black text-sm font-bold">SP</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Space Port AI</h3>
                <p className="text-gray-400 text-xs">Online • Gemini Powered</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              ✖
            </button>
          </div>

          {/* ✅ Mode Toggle Bar */}
          <div className="p-3 border-b border-white/10 bg-gray-900/50 flex justify-center space-x-3">
            <button
              onClick={() => setMode('wiki')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'wiki'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🌍 Wiki Mode
            </button>
            <button
              onClick={() => setMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'table'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              📊 Table Mode
            </button>
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black to-gray-900/40">
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
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
                  <span className="text-black text-xs font-bold">SP</span>
                </div>
                <div className="bg-gray-800/80 text-white p-4 rounded-2xl border border-white/10 shadow-lg">
                  <div clas
