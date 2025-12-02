
import React, { useState } from 'react';
import { FeatureType, FileNode, Automation, Run } from '../types';
import { 
  SettingsIcon, 
  FileIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  FolderIcon, 
  PlusIcon,
  RobotIcon,
  ZapIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  BarChartIcon
} from './Icons';

interface WorkspaceProps {
  activeFeature: string;
  onFeatureChange: (feature: FeatureType) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ activeFeature, onFeatureChange }) => {
  // --- MOCK STATE ---
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: 'root1',
      name: 'Project Alpha',
      type: 'folder',
      isOpen: true,
      children: [
        { id: 'f1', name: 'src', type: 'folder', children: [
             { id: 'file1', name: 'index.ts', type: 'file' },
             { id: 'file2', name: 'utils.ts', type: 'file' }
        ]},
        { id: 'f2', name: 'package.json', type: 'file' }
      ]
    }
  ]);

  const [automations, setAutomations] = useState<Automation[]>([
    { id: 'a1', name: 'Daily Data Sync', description: 'Syncs database with CRM', status: 'active', createdAt: Date.now() - 10000000 },
    { id: 'a2', name: 'Report Generator', description: 'Generates PDF reports', status: 'inactive', createdAt: Date.now() - 5000000 },
    { id: 'a3', name: 'Email Alert', description: 'Sends emails on error', status: 'active', createdAt: Date.now() - 200000 }
  ]);

  const [runs, setRuns] = useState<Run[]>([
    { id: 'r1', automationId: 'a1', status: 'success', startTime: Date.now() - 3600000, duration: '2m 15s' },
    { id: 'r2', automationId: 'a1', status: 'success', startTime: Date.now() - 86400000, duration: '2m 10s' },
    { id: 'r3', automationId: 'a3', status: 'failed', startTime: Date.now() - 1800000, duration: '15s' },
    { id: 'r4', automationId: 'a2', status: 'running', startTime: Date.now() - 30000, duration: '30s' }
  ]);

  const [selectedAutomationIdForRuns, setSelectedAutomationIdForRuns] = useState<string | null>(null);

  // --- ACTIONS ---

  const handleAddFolder = () => {
    const newFolder: FileNode = {
      id: Date.now().toString(),
      name: `Local Folder ${files.length + 1}`,
      type: 'folder',
      children: []
    };
    setFiles([...files, newFolder]);
  };

  const toggleFolder = (nodeId: string, nodes: FileNode[]): FileNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: toggleFolder(nodeId, node.children) };
      }
      return node;
    });
  };

  const handleToggleFolder = (id: string) => {
    setFiles(toggleFolder(id, files));
  };

  const handleCreateAutomation = () => {
    const newAuto: Automation = {
      id: Date.now().toString(),
      name: 'New Automation',
      description: 'Description here...',
      status: 'inactive',
      createdAt: Date.now()
    };
    setAutomations([newAuto, ...automations]);
  };

  // --- RENDER HELPERS ---

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div 
          className="flex items-center py-1 px-2 hover:bg-vscode-listHover cursor-pointer select-none text-vscode-text"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => node.type === 'folder' && handleToggleFolder(node.id)}
        >
          {node.type === 'folder' && (
            <span className="mr-1 text-gray-400">
              {node.isOpen ? <ChevronDownIcon className="w-3 h-3"/> : <ChevronRightIcon className="w-3 h-3"/>}
            </span>
          )}
          {node.type === 'folder' ? (
             <FolderIcon className="w-4 h-4 mr-2 text-blue-400" />
          ) : (
             <FileIcon className="w-3 h-3 mr-2 ml-4 text-gray-400" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  // --- RENDER CONTENT AREAS ---

  const renderFilesView = () => (
    <div className="flex flex-col h-full">
        {/* Sidebar for Files */}
        <div className="flex flex-col h-full bg-vscode-sidebar border-r border-vscode-border w-64 flex-shrink-0">
            <div className="h-9 px-4 flex items-center justify-between border-b border-vscode-border bg-vscode-header text-xs font-bold uppercase tracking-wider text-vscode-text">
                <span>Explorer</span>
                <button onClick={handleAddFolder} title="Add Local Folder" className="hover:bg-vscode-hover p-1 rounded">
                    <PlusIcon className="w-3 h-3" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                {renderFileTree(files)}
            </div>
        </div>
        {/* Main Area Placeholder */}
        <div className="flex-1 flex items-center justify-center bg-vscode-bg text-gray-500">
            <div className="text-center">
                <div className="text-4xl mb-4 opacity-20">
                    <FileIcon className="w-24 h-24 mx-auto" />
                </div>
                <p>Select a file to view contents</p>
            </div>
        </div>
    </div>
  );

  const renderAutomationsView = () => (
    <div className="flex flex-col h-full">
         <div className="h-12 border-b border-vscode-border bg-vscode-bg flex items-center justify-between px-6">
             <h2 className="text-lg font-light text-white">Automations</h2>
             <button 
                onClick={handleCreateAutomation}
                className="bg-vscode-accent hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded flex items-center transition-colors"
             >
                 <PlusIcon className="w-3 h-3 mr-1.5" />
                 New Automation
             </button>
         </div>
         <div className="flex-1 overflow-auto p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {automations.map(auto => (
                     <div key={auto.id} className="bg-vscode-sidebar border border-vscode-border p-4 rounded hover:border-vscode-accent group cursor-pointer transition-all">
                         <div className="flex items-start justify-between mb-2">
                             <div className="flex items-center text-vscode-accent">
                                 <RobotIcon className="w-5 h-5 mr-2" />
                                 <span className="font-semibold text-sm">{auto.name}</span>
                             </div>
                             <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                                 auto.status === 'active' ? 'text-green-400 border-green-900 bg-green-900/20' : 'text-gray-400 border-gray-700 bg-gray-800'
                             }`}>
                                 {auto.status}
                             </span>
                         </div>
                         <p className="text-xs text-gray-400 mb-4 h-10 line-clamp-2">{auto.description}</p>
                         <div className="flex items-center justify-between text-xs text-gray-500 border-t border-vscode-border pt-3 mt-auto">
                            <span>{new Date(auto.createdAt).toLocaleDateString()}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-vscode-accent">Edit</span>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
    </div>
  );

  const renderRunsView = () => {
    const activeRuns = selectedAutomationIdForRuns 
        ? runs.filter(r => r.automationId === selectedAutomationIdForRuns)
        : [];
    
    return (
        <div className="flex h-full">
            {/* Sidebar List of Automations */}
            <div className="w-64 bg-vscode-sidebar border-r border-vscode-border flex flex-col">
                <div className="h-9 px-4 flex items-center border-b border-vscode-border bg-vscode-header text-xs font-bold uppercase tracking-wider text-vscode-text">
                    Select Automation
                </div>
                <div className="flex-1 overflow-y-auto">
                    {automations.map(auto => (
                        <button
                            key={auto.id}
                            onClick={() => setSelectedAutomationIdForRuns(auto.id)}
                            className={`w-full flex items-center px-4 py-3 text-sm border-l-2 text-left hover:bg-vscode-listHover transition-colors ${
                                selectedAutomationIdForRuns === auto.id
                                    ? 'border-vscode-accent bg-vscode-listHover text-white'
                                    : 'border-transparent text-gray-400'
                            }`}
                        >
                            <RobotIcon className={`w-4 h-4 mr-3 ${selectedAutomationIdForRuns === auto.id ? 'text-vscode-accent' : 'opacity-50'}`} />
                            <span className="truncate">{auto.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Area: Runs List */}
            <div className="flex-1 bg-vscode-bg flex flex-col">
                 <div className="h-9 px-6 flex items-center border-b border-vscode-border bg-vscode-header text-sm text-gray-300">
                    {selectedAutomationIdForRuns ? (
                        <span>Run History for <span className="font-bold text-white">{automations.find(a => a.id === selectedAutomationIdForRuns)?.name}</span></span>
                    ) : (
                        <span>Select an automation to view runs</span>
                    )}
                 </div>
                 <div className="flex-1 overflow-auto p-6">
                    {!selectedAutomationIdForRuns ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <ZapIcon className="w-12 h-12 mb-4 opacity-20" />
                            <p>No Automation Selected</p>
                        </div>
                    ) : activeRuns.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">No runs found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-vscode-border">
                                    <th className="font-normal py-2 px-4">Status</th>
                                    <th className="font-normal py-2 px-4">Run ID</th>
                                    <th className="font-normal py-2 px-4">Start Time</th>
                                    <th className="font-normal py-2 px-4">Duration</th>
                                    <th className="font-normal py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {activeRuns.map(run => (
                                    <tr key={run.id} className="border-b border-vscode-border hover:bg-vscode-listHover group">
                                        <td className="py-3 px-4">
                                            {run.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                                            {run.status === 'failed' && <XCircleIcon className="w-4 h-4 text-red-500" />}
                                            {run.status === 'running' && <PlayIcon className="w-4 h-4 text-blue-500 animate-pulse" />}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 font-mono text-xs">{run.id}</td>
                                        <td className="py-3 px-4 text-gray-400">{new Date(run.startTime).toLocaleString()}</td>
                                        <td className="py-3 px-4 text-gray-400">{run.duration}</td>
                                        <td className="py-3 px-4">
                                            <button className="text-vscode-accent hover:underline text-xs opacity-0 group-hover:opacity-100">Logs</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                 </div>
            </div>
        </div>
    );
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: FeatureType; label: string; icon: any }) => (
    <button
        onClick={() => onFeatureChange(id)}
        className={`w-full flex items-center px-4 py-2 text-sm border-l-2 transition-colors ${
        activeFeature === id
            ? 'border-vscode-accent bg-[#37373d] text-white'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2a2d2e]'
        }`}
    >
        <Icon className="w-4 h-4 mr-3" />
        {label}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-vscode-bg overflow-hidden">
      {/* Top Header - VS Code Style */}
      <div className="h-9 bg-vscode-header border-b border-vscode-border flex items-center px-4 justify-between select-none flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-vscode-text opacity-90">Workspace</span>
        </div>
        
        {/* Breadcrumbs / Actions */}
        <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#ed6a5e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#f5bf4f]"></div>
                <div className="w-3 h-3 rounded-full bg-[#62c554]"></div>
            </div>
        </div>
      </div>

      {/* Main Content Area with Inner Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Inner Sidebar / Activity Bar */}
        <div className="w-48 bg-vscode-activityBar border-r border-vscode-border flex flex-col py-2 flex-shrink-0">
            <div className="px-4 py-2 mb-2 text-xs font-bold text-gray-500 uppercase">Explorer</div>
            <SidebarItem id={FeatureType.FILES} label="Files" icon={FileIcon} />
            <SidebarItem id={FeatureType.AUTOMATIONS} label="Automations" icon={RobotIcon} />
            <SidebarItem id={FeatureType.RUNS} label="Runs" icon={ZapIcon} />
            <div className="flex-1" />
            <SidebarItem id={FeatureType.SETTINGS} label="Settings" icon={SettingsIcon} />
        </div>

        {/* Feature View */}
        <div className="flex-1 overflow-hidden bg-vscode-bg text-vscode-text">
            {activeFeature === FeatureType.FILES && renderFilesView()}
            {activeFeature === FeatureType.AUTOMATIONS && renderAutomationsView()}
            {activeFeature === FeatureType.RUNS && renderRunsView()}
            {activeFeature === FeatureType.SETTINGS && (
                 <div className="p-8">
                 <h1 className="text-2xl font-light mb-6">Settings</h1>
                 <div className="max-w-md space-y-4">
                     <div className="flex flex-col gap-1">
                         <label className="text-sm font-medium">Theme</label>
                         <select className="bg-vscode-input border border-vscode-border p-2 rounded text-sm text-vscode-text">
                             <option>Dark (Default)</option>
                             <option>Light</option>
                             <option>High Contrast</option>
                         </select>
                     </div>
                      <div className="flex items-center gap-2 mt-4">
                         <input type="checkbox" id="telemetry" className="accent-vscode-accent" defaultChecked />
                         <label htmlFor="telemetry" className="text-sm">Enable Telemetry</label>
                     </div>
                 </div>
             </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
