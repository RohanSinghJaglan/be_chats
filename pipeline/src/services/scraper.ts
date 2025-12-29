import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedContent } from '../types';

export class ContentScraperService {
    async scrape(url: string): Promise<ScrapedContent | null> {
        console.log(`[ContentScraper] Scraping: ${url}`);
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)'
                },
                timeout: 10000
            });
            const $ = cheerio.load(response.data as string);

            // Remove junk
            $('script, style, nav, footer, iframe, .ad, .advertisement').remove();

            // Try to find the main content container
            // Common selectors for blogs
            const contentSelectors = ['article', 'main', '.post-content', '.entry-content', '#content'];
            let text = '';

            for (const selector of contentSelectors) {
                if ($(selector).length > 0) {
                    text = $(selector).text();
                    break;
                }
            }

            if (!text) {
                text = $('body').text();
            }

            return {
                text: text.replace(/\s+/g, ' ').trim().slice(0, 5000), // Limit size for LLM
                sourceUrl: url
            };

        } catch (error) {
            console.error(`[ContentScraper] Failed to scrape ${url}:`, error instanceof Error ? error.message : error);
            return null;
        }
    }
}
