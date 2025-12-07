'use client';

import React, { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { ConsolePanel } from '@/components/ConsolePanel';
import { HelpPanel } from '@/components/HelpPanel';
import { executeCode } from '@/utils/codeRunner';
import { formatCode } from '@/utils/autoFixerStandard';
import { fixCodeAI } from '@/utils/autoFixer';

export default function Home() {
  const [code, setCode] = useState<string>(`// Welcome to JS Editor\n\nfunction hello() {\n  console.log("Hello World")\n}\n\nhello()`);
  const [logs, setLogs] = useState<string[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  const handleRun = async () => {
    setLogs([]); // Clear previous logs
    const { output, error } = await executeCode(code);
    if (error) {
      setLogs((prev) => [...prev, error]);
    } else {
      setLogs((prev) => [...prev, ...output]);
    }
  };

  const handleAutoFix = async () => {
    setIsFixing(true);
    setLogs((prev) => [...prev, '--- 🤖 AI Auto-Fix Initialized... ---']);

    // 1. Call AI Fixer first
    const { fixedCode: aiFixedCode, error: aiError } = await fixCodeAI(code);

    if (aiError) {
      setLogs((prev) => [...prev, `⚠️ AI Error: ${aiError}`, 'Falling back to standard fixer...']);
    } else {
      setLogs((prev) => [...prev, '✓ AI suggestions applied.']);
    }

    // 2. Call Standard Formatter (Prettier) on the result to ensure style is perfect
    const codeToFormat = aiError ? code : aiFixedCode;
    const { fixedCode, error } = await formatCode(codeToFormat);

    if (error) {
      setCode(fixedCode); // still set the typo-fixed version
      setLogs((prev) => [...prev, `⚠️ Formatting Error: ${error}`, '✓ Applied changes (unformatted).']);
    } else {
      setCode(fixedCode);
      setLogs((prev) => [...prev, '✓ Code formatted & Fixed!']);
    }

    setIsFixing(false);
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Top Bar */}
      <header className="flex-none h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 font-bold text-gray-200 tracking-tight">NEXTEditor</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleAutoFix}
            disabled={isFixing}
            className={`flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-500 text-sm font-medium rounded transition-colors border border-gray-700 ${isFixing ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span>{isFixing ? '⏳' : '✨'}</span> {isFixing ? 'Fixing...' : 'Auto Fix'}
          </button>

          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-6 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded shadow-lg transition-transform active:scale-95"
          >
            ▶ Run Code
          </button>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="ml-4 text-gray-400 hover:text-white transition-colors"
          >
            Need Help?
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Editor Area */}
        <div className="flex-1 p-4 pb-0">
          <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Console Area - Fixed Height at bottom */}
        <div className="h-48 flex-none p-4">
          <ConsolePanel logs={logs} />
        </div>

      </div>

      {/* Help Slide-over */}
      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

    </main>
  );
}
