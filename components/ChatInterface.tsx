import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { SendIcon, ArrowLeftIcon } from './Icons';

interface ChatInterfaceProps {
  chatId: string;
  onBack?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear messages when switching chat sessions
  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatId, userMsg.text);
      
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-vscode-sidebar w-full">
      {/* Header for Chat Panel */}
      <div className="h-9 px-4 flex items-center border-b border-vscode-border bg-vscode-header text-xs font-bold tracking-wide uppercase text-vscode-text">
        {onBack && (
            <button 
                onClick={onBack} 
                className="mr-3 p-1 rounded hover:bg-vscode-hover text-vscode-text"
                title="Back to History"
            >
                <ArrowLeftIcon className="w-4 h-4" />
            </button>
        )}
        <span>Agent Chat</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10 text-sm">
                Start a conversation with the agent.
            </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-vscode-accent text-white'
                  : 'bg-vscode-input text-vscode-text border border-vscode-border'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start">
            <div className="bg-vscode-input text-vscode-text border border-vscode-border rounded px-3 py-2 text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-vscode-border bg-vscode-bg">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="w-full bg-vscode-input text-vscode-text border border-vscode-border rounded-sm p-2 pr-10 text-sm focus:outline-none focus:border-vscode-accent resize-none h-[40px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-1 rounded hover:bg-vscode-hover text-vscode-text disabled:opacity-50"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
