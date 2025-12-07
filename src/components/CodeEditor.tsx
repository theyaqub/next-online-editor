import React from 'react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
    return (
        <div className="w-full h-full flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex-none bg-gray-800 px-4 py-2 text-gray-400 text-xs font-mono border-b border-gray-700">
                main.js
            </div>
            <div className="flex-1 relative">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full p-4 bg-gray-900 text-gray-200 font-mono text-sm resize-none focus:outline-none leading-6"
                    spellCheck={false}
                    placeholder="// Write your JavaScript code here..."
                />
            </div>
        </div>
    );
};
