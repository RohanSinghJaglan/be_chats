import axios from 'axios';
import * as cheerio from 'cheerio';
import { Article } from '../types';
import { CONFIG } from '../config';

export class BeyondChatsScraper {
    async getLatestArticles(): Promise<Article[]> {
        console.log('[BeyondChatsScraper] Starting scrape process...');

        let lastPageUrl = CONFIG.SOURCE_BLOG_URL;
        let pageNum = 1;

        // 1. Find the last page
        // Strategy: Increment page number until 404
        while (true) {
            const nextUrl = `${CONFIG.SOURCE_BLOG_URL}page/${pageNum + 1}/`;
            try {
                await axios.head(nextUrl);
                pageNum++;
            } catch (e) {
                console.log(`[BeyondChatsScraper] Found last page: ${pageNum}`);
                lastPageUrl = `${CONFIG.SOURCE_BLOG_URL}page/${pageNum}/`;
                break;
            }

            // Safety break
            if (pageNum > 20) break;
        }

        // 2. Scrape articles from the last page
        return await this.scrapePage(lastPageUrl);
    }

    private async scrapePage(url: string): Promise<Article[]> {
        console.log(`[BeyondChatsScraper] Scraping page: ${url}`);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data as string);
        const articles: Article[] = [];

        // Adjust selectors based on actual site structure
        // Assuming standard blog structure based on typical WP themes/BeyondChats site
        $('article').each((_, el) => {
            const title = $(el).find('h2, h3').first().text().trim();
            const link = $(el).find('a').first().attr('href') || '';
            const dateStr = $(el).find('time').attr('datetime') || $(el).find('.date').text().trim();
            const excerpt = $(el).find('.excerpt, p').first().text().trim();

            if (title && link) {
                articles.push({
                    title,
                    slug: link.split('/').filter(Boolean).pop() || '',
                    source_url: link,
                    published_at: dateStr || new Date().toISOString(),
                    excerpt,
                    original_content: '', // Need to fetch individual page
                    status: 'original'
                });
            }
        });

        // Fetch full content for the LAST 5 (Oldest on the page are usually at the bottom, 
        // but if it's the last page of a blog listing, they are ALL old. 
        // We want the 5 oldest. On the last page, the bottom-most items are the oldest.
        // So we take the last 5 from the array.)

        const oldestArticles = articles.slice(-5);

        for (const article of oldestArticles) {
            article.original_content = await this.fetchFullContent(article.source_url);
        }

        return oldestArticles;
    }

    private async fetchFullContent(url: string): Promise<string> {
        try {
            console.log(`[BeyondChatsScraper] Fetching content: ${url}`);
            const response = await axios.get(url);
            const $ = cheerio.load(response.data as string);
            // Remove junk
            $('script, style, .sidebar, nav, footer').remove();

            // Try to find the content
            const content = $('.entry-content, article .content, .post-body').html();
            return content || $('body').html() || '';
        } catch (e) {
            console.error(`Error fetching ${url}`);
            return '';
        }
    }
}
