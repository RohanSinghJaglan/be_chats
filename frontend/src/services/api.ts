import axios from 'axios';
import { Article } from '../types';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8080/api/v1'
});

export const ArticleService = {
    async getArticles(): Promise<Article[]> {
        const response = await API.get('/articles');
        return response.data;
    },

    async getArticle(id: number): Promise<Article | undefined> {
        const response = await API.get(`/articles/${id}`);
        return response.data;
    },

    async runPipeline(): Promise<{ message: string }> {
        const response = await API.post('/run-pipeline');
        return response.data;
    }
};
