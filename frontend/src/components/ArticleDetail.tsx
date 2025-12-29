import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleService } from '../services/api';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'original' | 'rewritten'>('rewritten');

    useEffect(() => {
        if (id) {
            ArticleService.getArticle(parseInt(id)).then(data => {
                setArticle(data || null);
                setLoading(false);
                // Default to available content
                if (data && data.status === 'original') setViewMode('original');
            });
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading content...</div>;
    if (!article) return <div className="p-8 text-center text-sm text-gray-500">Content not found in registry.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="container mx-auto max-w-5xl flex justify-between items-center">
                    <Link to="/" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase tracking-wide">
                        <ArrowLeft size={14} className="mr-1" /> Return to Pipeline
                    </Link>

                    <div className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border rounded-sm ${article.status === 'rewritten'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        Content State: {article.status === 'rewritten' ? 'Enhanced' : 'Source'}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h1>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
                        <span className="text-gray-300">|</span>
                        <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-700 hover:underline">
                            Open Source URL <ExternalLink size={10} className="ml-1" />
                        </a>
                    </div>
                </header>

                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                        <div className="flex space-x-1 bg-gray-200 p-0.5 rounded text-xs font-medium">
                            <button
                                onClick={() => setViewMode('original')}
                                className={`px-3 py-1.5 rounded-sm transition-all ${viewMode === 'original'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Source Content
                            </button>
                            <button
                                onClick={() => setViewMode('rewritten')}
                                disabled={article.status === 'original'}
                                className={`px-3 py-1.5 rounded-sm transition-all ${viewMode === 'rewritten'
                                        ? 'bg-white text-indigo-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    } ${article.status === 'original' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Enhanced Version
                            </button>
                        </div>
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                            {viewMode === 'rewritten' ? 'AI-Optimized Output' : 'Original Raw HTML'}
                        </span>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        <div
                            className="prose prose-sm prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-indigo-700"
                            dangerouslySetInnerHTML={{
                                __html: viewMode === 'rewritten' && article.rewritten_content
                                    ? article.rewritten_content
                                    : article.original_content
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
