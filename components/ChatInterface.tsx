import React, { useState, useRef, useEffect } from 'react';
import { askAboutShura } from '../services/geminiService';
import { ChatMessage } from '../types';
import { COLORS } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askAboutShura(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-[#0b3d2e] to-[#145945] text-white">
        <h3 className="font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-gold-400" style={{ color: COLORS.accent }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.243a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM16 18a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          Shura Assistant
        </h3>
        <p className="text-xs text-green-100 opacity-80">Ask about roles, responsibilities, or structure.</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-sm font-bold text-black">Assalamu Alaikum! How can I help you today?</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['Who is the SRC?', 'What does the SG do?', 'Who handles events?'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="text-xs bg-white text-black border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#0b3d2e] transition-colors font-semibold"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-bold shadow-sm ${
              msg.role === 'user' 
              ? 'bg-[#e8f5e9] text-black border border-green-200 rounded-tr-none' 
              : 'bg-white text-black border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#0b3d2e] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#0b3d2e] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#0b3d2e] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 border-none rounded-lg px-4 py-2 text-sm text-black font-bold focus:ring-2 focus:ring-[#0b3d2e] outline-none placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[#0b3d2e] text-white p-2 rounded-lg hover:bg-[#145945] disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;