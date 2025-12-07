import prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as estreeCallback from 'prettier/plugins/estree';

const corrections: Record<string, string> = {
    'quest': 'const',
    'cnst': 'const',
    'let': 'let',
    'var': 'var',
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

const fixTypos = (code: string): string => {
    let modified = code;
    Object.keys(corrections).forEach(typo => {
        if (typo === corrections[typo]) return;
        // Boundary check to avoid replacing substrings in words
        const regex = new RegExp(`\\b${typo}\\b`, 'g');
        modified = modified.replace(regex, corrections[typo]);
    });

    // Fix specific console.log issues manually before parsing
    if (modified.includes('console.log') && !modified.includes('console.log(')) {
        modified = modified.replace(/console\.log\s*["'](.+)["']/, 'console.log("$1")');
    }

    return modified;
};

export const formatCode = async (code: string): Promise<{ fixedCode: string, error?: string }> => {
    try {
        // 1. Fix Typos First
        const typoFixed = fixTypos(code);

        // 2. Run Prettier (AST Formatting)
        const formatted = await prettier.format(typoFixed, {
            parser: 'babel',
            plugins: [parserBabel, estreeCallback],
            semi: true,
            singleQuote: false,
            trailingComma: 'none',
        });

        return { fixedCode: formatted };
    } catch (err: any) {
        // If Prettier crashes (syntax error too bad to parse), we return the typo-fixed version
        // explicitly telling the user syntax is still broken
        return {
            fixedCode: fixTypos(code),
            error: "Syntax too broken for auto-format. Fixed typos only."
        };
    }
};
