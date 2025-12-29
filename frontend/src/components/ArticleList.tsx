import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleService } from '../services/api';
import { ArrowRight } from 'lucide-react';

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    const [runningPipeline, setRunningPipeline] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const fetchArticles = () => {
        setError(null);
        ArticleService.getArticles()
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch articles:", err);
                setError("Failed to load articles. Backend may be offline or unreachable.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleRunPipeline = async () => {
        setRunningPipeline(true);
        try {
            await ArticleService.runPipeline();
            fetchArticles();
            alert("Pipeline executed successfully!");
        } catch (error) {
            console.error("Pipeline failed", error);
            alert("Failed to run pipeline. Check console/logs.");
        } finally {
            setRunningPipeline(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-10 max-w-6xl">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Connection Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button
                        onClick={fetchArticles}
                        className="mt-2 text-sm underline hover:text-red-800"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10 max-w-6xl">
            <header className="mb-10 border-b border-gray-200 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Rewrite Pipeline</h1>
                    <p className="text-sm text-gray-500 mt-1">Internal system for managing and optimizing editorial content</p>
                </div>
                <button
                    onClick={handleRunPipeline}
                    disabled={runningPipeline}
                    className={`px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors ${runningPipeline ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {runningPipeline ? 'Running Pipeline...' : 'Run Pipeline Now'}
                </button>
            </header>

            <div className="flex flex-col gap-4">
                {articles.map(article => (
                    <div key={article.id} className="bg-white border border-gray-200 rounded-sm p-5 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border ${article.status === 'rewritten'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}>
                                        Content State: {article.status === 'rewritten' ? 'Enhanced' : 'Source'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Published: {new Date(article.published_at).toLocaleDateString()} • Source: BeyondChats
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h2>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{article.excerpt}</p>
                            </div>

                            <div className="flex items-center self-center">
                                <Link
                                    to={`/articles/${article.id}`}
                                    className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900 transition-colors"
                                >
                                    Review Content <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticleList;
