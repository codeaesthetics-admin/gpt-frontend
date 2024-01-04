export declare class ChatGptAiService {
    private OPENAI_API_KEY;
    generateText(latestPrompt: string, prompt: string, fileName: string): Promise<{
        text: any;
        role: any;
    }>;
}
