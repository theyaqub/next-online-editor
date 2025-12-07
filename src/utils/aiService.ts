export interface AICompletionResponse {
    response: string;
    error?: string;
}

const OLLAMA_BASE_URL = 'http://localhost:11434/api';
const DEFAULT_MODEL = 'deepseek-coder:6.7b';

export const generateCompletion = async (
    prompt: string,
    model: string = DEFAULT_MODEL
): Promise<AICompletionResponse> => {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { response: data.response };
    } catch (error: any) {
        console.error('AI Service Error:', error);
        return {
            response: '',
            error: error.message || 'Failed to connect to AI service.',
        };
    }
};

export const chatCompletion = async (
    messages: { role: string; content: string }[],
    model: string = DEFAULT_MODEL
): Promise<AICompletionResponse> => {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { response: data.message.content };
    } catch (error: any) {
        console.error('AI Service Error:', error);
        return {
            response: '',
            error: error.message || 'Failed to connect to AI service.',
        };
    }
};
