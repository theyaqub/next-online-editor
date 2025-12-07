export interface ExecutionResult {
    output: string[];
    error?: string;
}

export const executeCode = async (code: string): Promise<ExecutionResult> => {
    const output: string[] = [];

    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    try {
        // Intercept console output
        console.log = (...args) => {
            output.push(args.map(arg => String(arg)).join(' '));
        };
        console.error = (...args) => {
            output.push(`Error: ${args.map(arg => String(arg)).join(' ')}`);
        };
        console.warn = (...args) => {
            output.push(`Warning: ${args.map(arg => String(arg)).join(' ')}`);
        };

        // Evaluate the code
        // usage of new Function or eval is required here for the "Run Code" feature
        // wrapping in an async function to allow await if user uses it (though simple eval might be enough)

        // eslint-disable-next-line no-eval
        const result = eval(code);

        if (result !== undefined) {
            output.push(`Return: ${String(result)}`);
        }

        return { output };
    } catch (err: any) {
        return {
            output,
            error: err.toString()
        };
    } finally {
        // Restore console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
    }
};
