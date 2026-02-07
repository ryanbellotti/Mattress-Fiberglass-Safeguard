import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I\'m your Mattress Fiberglass SafeGuard assistant. I can help you identify fiberglass contamination in mattresses, provide cleanup guidance, and answer safety questions. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Thank you for your question. I\'m analyzing your inquiry with advanced AI reasoning. How else can I help you today?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">AI Assistant</h1>
        <p className="text-muted">Chat with our Gemini-powered safety companion</p>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 space-y-4 mb-4 pr-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}> 
            <div
              className={`max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'glass-card text-text'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs mt-2 opacity-50">{msg.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about mattress safety..."
          className="flex-1 neuro-inset px-4 py-3 text-text outline-none"
        />
        <button
          onClick={handleSend}
          className="neuro-btn px-4 py-3 text-accent hover:text-primary transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;