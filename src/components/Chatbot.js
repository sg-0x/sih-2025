import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [datasetCache, setDatasetCache] = useState(null);

  // Hardcoded API key - replace with your actual API key
  const API_KEY = 'AIzaSyBBxZLjru3yDvqQ3MGtA1gPcziVGXq4dAI';
  const genAI = new GoogleGenerativeAI(API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const loadDisasterDataset = async () => {
    // Return cached dataset if available
    if (datasetCache) {
      return datasetCache;
    }
    
    try {
      const response = await fetch('/disaster_dataset.json');
      const dataset = await response.json();
      setDatasetCache(dataset); // Cache the dataset
      return dataset;
    } catch (error) {
      console.error('Error loading disaster dataset:', error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Load disaster dataset
      const dataset = await loadDisasterDataset();
      
      if (!dataset) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'Sorry, I cannot access the disaster preparedness database at the moment. Please try again later.' 
        }]);
        setIsLoading(false);
        return;
      }

      // Create optimized system prompt with dataset (reduced payload)
      const datasetSummary = dataset ? Object.keys(dataset).slice(0, 10).map(key => 
        `${key}: ${JSON.stringify(dataset[key]).substring(0, 200)}...`
      ).join('\n') : 'No dataset available';

      const systemPrompt = `You are a disaster preparedness assistant for students. Help with safety questions using this data:

${datasetSummary}

Guidelines:
- Answer in friendly, clear language
- Use bullet points for steps
- Keep responses concise (under 200 words)
- If unsure, say "I don't have that specific information, but here's general advice..."

Question: ${userMessage}`;

      // Generate response using Gemini (switched to stable model with higher rate limits)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const botMessage = response.text();

      setMessages(prev => [...prev, { type: 'bot', content: botMessage }]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      let errorMessage = 'Sorry, I encountered an error while processing your request. Please try again.';
      
      // Handle specific error types
      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        errorMessage = 'I\'m getting too many requests right now. Please wait a moment and try again.';
      } else if (error.message?.includes('API key')) {
        errorMessage = 'There\'s an issue with my configuration. Please contact support.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'I\'m having trouble connecting. Please check your internet and try again.';
      }
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        aria-label="Open chatbot"
      >
        <svg
          width="36"
          height="36"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '350px',
          maxHeight: '75vh',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #e5e7eb'
        }}>
          {/* Chat Header */}
          <div style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '16px',
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>Disaster Preparedness Assistant</h3>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px'
              }}
              aria-label="Close chatbot"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            maxHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                <p style={{ margin: '0 0 4px 0' }}>👋 Hi! I'm your disaster preparedness assistant.</p>
                <p style={{ margin: 0 }}>Ask me anything about disaster safety and preparedness!</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'user' ? '#2563eb' : '#f3f4f6',
                    color: message.type === 'user' ? 'white' : '#1f2937'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.1s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.2s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about disaster preparedness..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for bounce animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
