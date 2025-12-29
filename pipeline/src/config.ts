import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    API_URL: process.env.API_URL || 'http://127.0.0.1:8000/api/v1',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    SOURCE_BLOG_URL: 'https://beyondchats.com/blogs/',
    DRY_RUN: false // Live mode: writes to database
};
