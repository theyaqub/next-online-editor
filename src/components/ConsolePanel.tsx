import React from 'react';

interface ConsolePanelProps {
    logs: string[];
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs }) => {
    return (
        <div className="flex flex-col h-full bg-black border-t border-gray-700 font-mono text-sm">
            <div className="flex-none px-4 py-1 bg-gray-800 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                Console
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {logs.length === 0 ? (
                    <div className="text-gray-600 italic">Output will appear here...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className={`whitespace-pre-wrap ${log.startsWith('Error:') ? 'text-red-400' : 'text-green-400'}`}>
                            <span className="text-gray-600 mr-2">{'>'}</span>{log}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
