import OpenAI from 'openai';
import { CONFIG } from '../config';
import { SearchResult, ScrapedContent } from '../types';

export class RewriterService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY || 'sk-placeholder' });
    }

    async rewrite(originalContent: string, relevantContent: ScrapedContent[], citations: SearchResult[]): Promise<string> {
        if (!CONFIG.OPENAI_API_KEY) {
            console.log('[Rewriter] No API Key provided, returning mock rewrite.');
            return `[MOCK REWRITE] \n\n ${originalContent.substring(0, 100)}... \n\n (Real rewrite requires API Key)`;
        }

        console.log('[Rewriter] Sending content to LLM...');

        const context = relevantContent.map(c => c.text).join('\n\n---\n\n');

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo', // Or gpt-4
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert content editor. Rewrite the following blog post to be more engaging, professional, and well-structured.
                        Use the provided "Reference Content" to improve accuracy and tone, but DO NOT plagiarize.
                        Maintain the original intent.
                        Format in HTML (p, h2, h3, ul, ol).
                        At the end, append a "References" section using the exact links provided in citation instructions.`
                    },
                    {
                        role: 'user',
                        content: `ORIGINAL ARTICLE:\n${originalContent}\n\nREFERENCE CONTENT:\n${context}`
                    }
                ]
            });

            let content = response.choices[0].message.content || '';

            // Append citations manually if LLM didn't (safeguard)
            if (!content.includes('References')) {
                content += '\n\n<h3>References</h3>\n<ul>';
                citations.forEach(c => {
                    content += `<li><a href="${c.url}">${c.title}</a></li>`;
                });
                content += '</ul>';
            }

            return content;
        } catch (error) {
            console.error('[Rewriter] AI Error:', error);
            return originalContent + ' (Rewrite failed)';
        }
    }
}
