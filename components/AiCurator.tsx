import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { createCuratorChat, sendMessageToCurator } from '../services/geminiService';
import { Chat } from "@google/genai";

const AiCurator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings. I am the digital spirit of Vincent. Ask me about my art, my colors, or the beauty of nature.", timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createCuratorChat();
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await sendMessageToCurator(chatSessionRef.current, userMsg.text);

    const modelMsg: ChatMessage = {
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Curator Chat"
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <MessageSquare size={28} />
        {/* Pulse effect */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
        </span>
      </button>

      <div 
        role="dialog"
        aria-label="Chat with Vincent"
        className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-[#fdfbf7] rounded-2xl shadow-2xl flex flex-col border border-yellow-600/30 overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center bg-[url('https://picsum.photos/id/1015/800/200')] bg-cover bg-center relative shadow-md">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/80 backdrop-blur-[1px]"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-full backdrop-blur-sm border border-yellow-500/50">
               <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-yellow-50 tracking-wide">Ask Vincent</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online Curator
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close Chat"
            className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-200 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fdfbf7] scroll-smooth">
            {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm animate-fade-in-up ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-slate-50 rounded-tr-sm' 
                    : 'bg-white border border-yellow-200/60 text-slate-800 rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                }`}
              >
                {msg.role === 'model' && (
                    <p className="text-xs font-serif text-yellow-600 mb-1 font-bold tracking-wider">VINCENT</p>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-yellow-200/60 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <p className="text-xs font-serif text-yellow-600 font-bold tracking-wider mr-1">VINCENT</p>
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-2 bg-slate-50 rounded-full px-2 py-2 border border-slate-200 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all duration-300">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about my brushstrokes..."
              aria-label="Message input"
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm placeholder:text-slate-400 px-3"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin"/> : <Send size={16} />}
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400 font-light tracking-wide">AI-generated responses. Accuracy may vary.</p>
          </div>
        </form>
      </div>
    </>
  );
};

export default AiCurator;