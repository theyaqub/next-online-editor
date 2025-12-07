import React, { useState } from 'react';
import { getHelpResponse } from '@/utils/helpSystem';

interface HelpPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const q = overrideQuery || query;
        if (!q) return;

        setIsLoading(true);
        // Simulate slight delay for effect -> Removed, now real async
        try {
            const result = await getHelpResponse(q);
            setResponse(result);
        } catch (err) {
            setResponse("Error connecting to help service.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">Help Assistant</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <form onSubmit={(e) => handleSearch(e)} className="mb-6">
                    <label className="block text-xs text-gray-400 mb-1 uppercase">Search Topic</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. loop, error..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                        >
                            {isLoading ? '...' : 'Ask'}
                        </button>
                    </div>
                </form>

                {response && (
                    <div className="text-sm text-gray-300">
                        <div className="bg-gray-800 rounded p-3 whitespace-pre-wrap leading-relaxed border border-gray-700">
                            {response}
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <h3 className="text-xs text-gray-500 uppercase mb-2">Popular Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Loop', 'Function', 'Variable', 'Error', 'Console'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setQuery(tag);
                                    handleSearch(undefined, tag);
                                }}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
