# BeyondChats Article Intelligence Pipeline

A full-stack system that scrapes blog content, enhances it using GenAI (OpenAI), and provides a dashboard for editorial review.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-green)

## Features
-   **Automated Scraping**: Fetches articles from *BeyondChats Blog*.
-   **AI Enhancement**: Rewrites content for better engagement using GPT-3.5/4.
-   **RAG-Lite**: Searches Google for related content to ground the rewrite (Architecture supported).
-   **Comparison Dashboard**: Side-by-side view of Original vs Rewritten content.

## Architecture
-   **Backend**: Laravel 10 (API) + PostgreSQL.
-   **Frontend**: React + Vite + TailwindCSS.
-   **Pipeline**: Node.js + TypeScript (Scraper & LLM Orchestrator).
-   **Infrastructure**: Dockerized environment.

## Quick Start

### 1. Setup Backend (Docker)
```bash
cd backend
cp .env.example .env
# Edit .env: Add OPENAI_API_KEY=sk-...
docker-compose up -d --build
docker-compose exec app php artisan migrate
```

> **Note on AI Features**: To enable the AI rewriting capabilities, a valid `OPENAI_API_KEY` must be configured in `backend/.env`. If this key is missing or invalid, the pipeline will automatically operate in **Mock Mode**, generating placeholder text for demonstration purposes.

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
-   Visit **http://localhost:5173**
-   Click **"Run Pipeline Now"** to fetch and rewrite articles.
-   Click **"Review Content"** on any card to see the AI output.

## Documentation
-   [Architecture Overview](docs/architecture.md)
-   [Deployment Guide](docs/deployment_and_backend_start.md)
