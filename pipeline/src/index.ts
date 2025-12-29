import { BeyondChatsScraper } from './services/beyondScraper';
import { GoogleSearchService } from './services/search';
import { ContentScraperService } from './services/scraper';
import { RewriterService } from './services/rewriter';
import { ArticlePublisher } from './services/publisher';
import { ScrapedContent } from './types';

async function main() {
    console.log('=== Starting BeyondChats Article Pipeline ===');

    const beyondScraper = new BeyondChatsScraper();
    const searchService = new GoogleSearchService();
    const contentScraper = new ContentScraperService();
    const rewriter = new RewriterService();
    const publisher = new ArticlePublisher();

    // 1. Phase 1: Scrape Oldest Articles
    console.log('\n--- Phase 1: Scraping 5 Oldest Articles ---');
    const articles = await beyondScraper.getLatestArticles();
    console.log(`Found ${articles.length} articles to process.`);

    for (const article of articles) {
        console.log(`\nProcessing: "${article.title}"`);

        // Save original first
        const savedArticle = await publisher.createOriginal(article);

        // 2. Phase 2: Rewrite Pipeline
        console.log('--- Starting Rewrite Pipeline ---');

        // a. Search Google
        const searchResults = await searchService.search(article.title);

        // b. Scrape Related Content
        const relatedContent: ScrapedContent[] = [];
        for (const result of searchResults) {
            const content = await contentScraper.scrape(result.url);
            if (content) {
                relatedContent.push(content);
            }
        }

        // c. AI Rewrite
        const newContent = await rewriter.rewrite(
            article.original_content,
            relatedContent,
            searchResults
        );

        // d. Update Article
        savedArticle.rewritten_content = newContent;
        savedArticle.status = 'rewritten';

        // 5. Publish
        await publisher.publish(savedArticle);
    }

    console.log('\n=== Pipeline Completed ===');
}

main().catch(console.error);
