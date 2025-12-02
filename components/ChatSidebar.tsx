
import React, { useState } from 'react';
import { Conversation } from '../types';
import { FolderIcon, KeyIcon, DatabaseIcon } from './Icons';
import ChatInterface from './ChatInterface';

interface ChatSidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectChat: (id: string | null) => void;
  activeChatId: string | null;
  onSeeAllHistory: () => void;
  onOpenWorkspace: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onSelectChat,
  activeChatId,
  onOpenWorkspace
}) => {
  // If a chat is active, show the Chat Interface
  if (activeChatId) {
    return (
      <ChatInterface 
        chatId={activeChatId} 
        onBack={() => onSelectChat(null)} 
      />
    );
  }

  // Configuration State
  const [dbUrl, setDbUrl] = useState('');
  const [dbEndpoint, setDbEndpoint] = useState('');
  const [dbWarehouse, setDbWarehouse] = useState('');

  return (
    <div className="flex flex-col h-full bg-vscode-sidebar border-r border-vscode-border flex-shrink-0 w-full">
      {/* Sidebar Header */}
      <div className="h-9 px-4 flex items-center border-b border-vscode-border bg-vscode-header text-xs font-bold tracking-wide uppercase text-vscode-text">
        Databricks Setup
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Helper Text */}
        <div className="text-xs text-gray-400 leading-relaxed mb-4">
          Configure your Databricks connection to enable agent capabilities.
        </div>

        {/* Databricks URL */}
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-vscode-text">Databricks URL</label>
            <input 
                type="text" 
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                placeholder="https://adb-1234.5.azuredatabricks.net"
                className="bg-vscode-input border border-vscode-border text-vscode-text text-xs p-2 rounded-sm focus:border-vscode-accent focus:outline-none placeholder-gray-600"
            />
        </div>

        {/* LLM Endpoint */}
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-vscode-text">Databricks LLM Endpoint</label>
            <input 
                type="text" 
                value={dbEndpoint}
                onChange={(e) => setDbEndpoint(e.target.value)}
                placeholder="databricks-meta-llama-3-70b-instruct"
                className="bg-vscode-input border border-vscode-border text-vscode-text text-xs p-2 rounded-sm focus:border-vscode-accent focus:outline-none placeholder-gray-600"
            />
        </div>

        {/* SQL Warehouse */}
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-vscode-text">SQL Warehouse ID</label>
            <div className="relative">
                <input 
                    type="text" 
                    value={dbWarehouse}
                    onChange={(e) => setDbWarehouse(e.target.value)}
                    placeholder="1234567890abcdef"
                    className="bg-vscode-input border border-vscode-border text-vscode-text text-xs p-2 pr-8 rounded-sm focus:border-vscode-accent focus:outline-none placeholder-gray-600 w-full"
                />
                <DatabaseIcon className="w-3 h-3 text-gray-500 absolute right-2.5 top-2.5" />
            </div>
        </div>

        {/* Set Token Button */}
        <div className="pt-2">
            <button 
                className="w-full flex items-center justify-center bg-vscode-button bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs py-2 px-3 rounded-sm transition-colors"
                onClick={() => alert('Token configuration dialog would open here.')}
            >
                <KeyIcon className="w-3 h-3 mr-2" />
                Set Databricks Token
            </button>
        </div>

      </div>

      {/* Bottom Section: Open Workspace */}
      <div className="p-4 border-t border-vscode-border bg-vscode-bg">
        <button
          onClick={onOpenWorkspace}
          className="w-full flex items-center justify-center bg-green-700 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-sm transition-colors shadow-sm font-medium"
        >
          <FolderIcon className="w-4 h-4 mr-2" />
          Open Workspace
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
