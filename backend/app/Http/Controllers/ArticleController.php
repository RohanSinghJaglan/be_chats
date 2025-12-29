<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $articles = Article::orderBy('published_at', 'desc')->get();
        return response()->json($articles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:articles,slug',
            'published_at' => 'nullable|date',
            'excerpt' => 'nullable|string',
            'original_content' => 'required|string',
            'source_url' => 'required|url',
        ]);

        $article = Article::create(array_merge($validated, ['status' => 'original']));

        return response()->json($article, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json($article);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        $validated = $request->validate([
            'rewritten_content' => 'nullable|string',
            'status' => 'in:original,rewritten'
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }
    


    public function runPipeline()
    {
        // Path to the pipeline directory mapped in Docker
        $pipelinePath = '/var/www/pipeline';
        
        // Command to run the pipeline. 
        // We use 'npm start' or direct 'ts-node'. 
        // Since we are in the container, we need to make sure we utilize the local node_modules.
        $cmd = "cd $pipelinePath && npm start 2>&1";
        
        $output = [];
        $returnVar = 0;
        
        exec($cmd, $output, $returnVar);

        if ($returnVar !== 0) {
            return response()->json([
                'message' => 'Pipeline failed',
                'output' => $output
            ], 500);
        }

        return response()->json([
            'message' => 'Pipeline executed successfully',
            'output' => $output
        ]);
    }
}
