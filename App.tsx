
import React, { useState } from 'react';
import ChatSidebar from './components/ChatSidebar';
import Workspace from './components/Workspace';
import { AppState, Conversation, FeatureType } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    conversations: [
      { id: '1', title: 'Refactoring Utils', lastMessage: 'Done.', timestamp: Date.now() },
      { id: '2', title: 'React Hooks Help', lastMessage: 'Thanks!', timestamp: Date.now() - 100000 },
      { id: '3', title: 'CSS Grid Layout', lastMessage: 'How do I center...', timestamp: Date.now() - 200000 }
    ],
    currentChatId: null, // Start with list view
    activeFeature: FeatureType.FILES
  });

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: 'New Chat',
      lastMessage: '',
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      conversations: [newConv, ...prev.conversations],
      currentChatId: newId
    }));
  };

  const handleSelectChat = (id: string | null) => {
    setState(prev => ({ ...prev, currentChatId: id }));
  };

  const handleFeatureChange = (feature: string) => {
    setState(prev => ({ ...prev, activeFeature: feature }));
  };

  const handleSeeAllHistory = () => {
    // In a real app, this would open a modal or navigate to a full history view
    alert("This would open a full modal with all chat history, searchable and filterable.");
  };

  const handleOpenWorkspace = () => {
    setState(prev => ({ ...prev, activeFeature: FeatureType.FILES }));
  };

  return (
    <div className="flex h-screen w-screen bg-vscode-bg text-vscode-text font-sans overflow-hidden">
      {/* Left Pane: Agent Sidebar (Handles both list and chat view) */}
      <div className="w-[300px] h-full flex-shrink-0 border-r border-vscode-border flex">
         <ChatSidebar 
            conversations={state.conversations}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            activeChatId={state.currentChatId}
            onSeeAllHistory={handleSeeAllHistory}
            onOpenWorkspace={handleOpenWorkspace}
         />
      </div>

      {/* Right Pane: Workspace */}
      <Workspace 
        activeFeature={state.activeFeature}
        onFeatureChange={(feat) => handleFeatureChange(feat as FeatureType)}
      />
    </div>
  );
};

export default App;
