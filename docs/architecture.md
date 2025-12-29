# Architecture - BeyondChats Article Intelligence Pipeline

## Overview
This system is designed to automate the ingestion, enhancement, and republishing of blog content. It follows a decoupled, service-oriented architecture to ensure scalability and maintainability.

## Core Components

### 1. Backend Service (Laravel 10)
-   **Role**: The central source of truth for Article data.
-   **Responsibilities**:
    -   Store article content (Original & Rewritten).
    -   Serve REST APIs for the Frontend and Pipeline.
    -   Maintain state (Status: Original vs Rewritten).
-   **Trade-off**: Used Laravel for robust routing and Eloquent ORM, favoring structure over raw node.js speed for the data layer.

### 2. Intelligence Pipeline (Node.js 18)
-   **Role**: The worker process that performs heavy I/O and AI tasks.
-   **Responsibilities**:
    -   **Scraping**: Fetching content from source blogs.
    -   **Enrichment**: finding related content via Google Search to ground the rewrite (RAG-lite approach).
    -   **Rewriting**: Using LLM (OpenAI) to transform content while maintaining intent.
-   **Why Node.js?**: Excellent handling of async I/O (concurrent scraping) and rich ecosystem for scraping (Cheerio) and AI SDKs.

### 3. Frontend Application (React + Vite)
-   **Role**: The presentation layer for humans.
-   **Responsibilities**:
    -   Display list of articles.
    -   Compare Original vs Rewritten versions.
    -   Responsive UI for easy reading.
-   **Tech Choice**: React for component reusability, Tailwind for rapid styling without writing custom CSS files.

## System Diagram

[Frontend] <--> [Laravel API] <--> [PostgreSQL]
                      ^
                      |
                 [Node.js Pipeline]
                      |
        [Source Blog] + [Google Search] + [OpenAI API]
