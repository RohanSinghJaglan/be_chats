export interface Article {
    id: number;
    title: string;
    slug: string;
    published_at: string;
    excerpt: string;
    original_content: string;
    rewritten_content?: string;
    source_url: string;
    status: 'original' | 'rewritten';
}
