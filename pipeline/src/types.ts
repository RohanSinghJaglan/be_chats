export interface Article {
    id?: number;
    title: string;
    slug: string;
    published_at: string | null;
    excerpt: string;
    original_content: string;
    rewritten_content?: string | null;
    source_url: string;
    status: 'original' | 'rewritten';
}

export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

export interface ScrapedContent {
    text: string;
    sourceUrl: string;
}
