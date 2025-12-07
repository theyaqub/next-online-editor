export interface AutoFixResult {
    fixedCode: string;
    changes: string[];
}

export const autoFixCode = (code: string): AutoFixResult => {
    let lines = code.split('\n');
    const changes: string[] = [];

    // 1. Keyword Correction Map
    // Maps common typos to correct keywords
    const corrections: Record<string, string> = {
        'quest': 'const',
        'cnst': 'const',
        'let': 'let', // self-map
        'var': 'var', // self-map
        'fucntion': 'function',
        'functio': 'function',
        'fn': 'function',
        'consol': 'console',
        'console': 'console',
        'log': 'log',
        'retrun': 'return',
        'retun': 'return',
        'iff': 'if',
        'esle': 'else',
        'wihle': 'while',
        'forr': 'for'
    };

    // Helper to correct line words
    const correctLine = (line: string, index: number): string => {
        let modified = line;
        let lineChanges = false;

        // Split by non-word characters to find tokens, but keep separators to reconstruct? 
        // Easier regex replace for specific known bad patterns

        // 1a. Check for "User Special" cases
        if (modified.includes("quest ")) {
            modified = modified.replace(/\bquest\b/g, 'const');
            changes.push(`Line ${index + 1}: Fixed typo 'quest' → 'const'`);
            lineChanges = true;
        }

        // 1b. Generic Keyword Fixes
        Object.keys(corrections).forEach(typo => {
            if (typo === corrections[typo]) return; // skip self
            const regex = new RegExp(`\\b${typo}\\b`, 'g');
            if (regex.test(modified)) {
                modified = modified.replace(regex, corrections[typo]);
                changes.push(`Line ${index + 1}: Fixed typo '${typo}' → '${corrections[typo]}'`);
                lineChanges = true;
            }
        });

        // 2. Fix broken console.log syntax
        // e.g. console.log "hello" -> console.log("hello")
        // e.g. console.log('hello' -> console.log('hello')
        if (modified.includes('console.log')) {
            const logRegex = /console\.log\s+["'](.+)["']/; // simple case console.log "foo"
            if (logRegex.test(modified) && !modified.includes('(')) {
                modified = modified.replace(/console\.log\s+(["'].+["'])/, 'console.log($1)');
                changes.push(`Line ${index + 1}: Fixed console.log parenthesis`);
            }
        }

        return modified;
    };

    // Process lines for Content Fixes first
    lines = lines.map((line, i) => correctLine(line, i));

    // 3. Indentation & Structural Fixes
    let indentLevel = 0;
    const fixedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
            fixedLines.push('');
            continue;
        }

        // Recover indentation level for closing
        if (line.startsWith('}') || line.startsWith(']')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // Auto-close parenthesis if line ends with open paren (likely mistake)
        // e.g. console.log("hello
        if (line.endsWith('(')) {
            // This is ambiguous, it could be a multi-line call. 
            // But for this simple verified fixer, let's assume if it looks like a function call it might need closing 
            // Actually, safer to check specific missing closing chars
        }

        // Check for unbalanced parens in single line
        const openParen = (line.match(/\(/g) || []).length;
        const closeParen = (line.match(/\)/g) || []).length;
        if (openParen > closeParen && !line.includes('{')) {
            // if not starting a block, probably missing )
            line += ')';
            changes.push(`Line ${i + 1}: Added missing ')'`);
        }

        // Semicolons
        if (
            line.length > 0 &&
            !line.endsWith(';') &&
            !line.endsWith('{') &&
            !line.endsWith('}') &&
            !line.endsWith('[') &&
            !line.endsWith(',') &&
            !line.startsWith('//')
        ) {
            // logic: if it looks like a statement
            const words = line.split(' ');
            const first = words[0];
            if (
                ['const', 'let', 'var', 'return', 'import', 'export', 'console'].includes(first) ||
                line.includes('=') ||
                line.endsWith(')')
            ) {
                line += ';';
                changes.push(`Line ${i + 1}: Added missing semicolon`);
            }
        }

        // Indent
        const indentString = '  '.repeat(indentLevel);
        fixedLines.push(indentString + line);

        // Calculate next indent
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        indentLevel += openBraces - closeBraces;
    }

    // 4. Global Bracket Balance Check
    // If we have leftover indent, we are missing closing braces
    if (indentLevel > 0) {
        for (let k = 0; k < indentLevel; k++) {
            fixedLines.push('  '.repeat(indentLevel - 1 - k) + '}');
            changes.push(`End of file: Added missing '}'`);
        }
    }

    return {
        fixedCode: fixedLines.join('\n'),
        changes: changes.length > 0 ? changes : ['No changes made.']
    };
};

import { generateCompletion } from './aiService';

export const fixCodeAI = async (code: string): Promise<{ fixedCode: string, error?: string }> => {
    const prompt = `
    You are an expert JavaScript/TypeScript code fixer.
    Please fix the following code. It may have typos, syntax errors, or logical issues.
    Return ONLY the fixed code. Do not include markdown backticks or explanations.
    
    Code to fix:
    ${code}
    `;

    const { response, error } = await generateCompletion(prompt);

    if (error) {
        return { fixedCode: code, error: error };
    }

    // Clean up response if it contains markdown code blocks
    let cleanCode = response.trim();
    if (cleanCode.startsWith('```')) {
        cleanCode = cleanCode.replace(/^```(javascript|typescript|js|ts)?\n/, '').replace(/```$/, '');
    }

    return { fixedCode: cleanCode };
};
