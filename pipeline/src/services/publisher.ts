import axios from 'axios';
import { Article } from '../types';
import { CONFIG } from '../config';

export class ArticlePublisher {
    async publish(article: Article): Promise<void> {
        if (CONFIG.DRY_RUN) {
            console.log(`[Publisher] DRY RUN: Would PUT /articles/${article.id}`);
            return;
        }

        try {
            await axios.put(`${CONFIG.API_URL}/articles/${article.id}`, article);
            console.log(`[Publisher] Successfully published update: ${article.title}`);
        } catch (error) {
            console.error(`[Publisher] Failed to publish ${article.title}`, error);
        }
    }

    async createOriginal(article: Article): Promise<Article> {
        if (CONFIG.DRY_RUN) {
            console.log(`[Publisher] DRY RUN: Creating original article in DB: ${article.title}`);
            return { ...article, id: Math.floor(Math.random() * 1000) };
        }

        try {
            const response = await axios.post(`${CONFIG.API_URL}/articles`, article);
            const savedArticle = response.data as Article;
            console.log(`[Publisher] Created original article: ${savedArticle.title} (ID: ${savedArticle.id})`);
            return savedArticle;
        } catch (error) {
            console.error(`[Publisher] Failed to create original article`, error);
            throw error;
        }
    }
}
