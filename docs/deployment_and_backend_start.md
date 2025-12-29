# Start & Deployment Guide

This guide explains how to start the BeyondChats Article Pipeline using Docker (recommended) and how to deploy it.

## 1. Quick Start (Docker)

The easiest way to run the entire backend stack (Laravel + Database + Pipeline) is with Docker.

### Prerequisites
-   **Docker Desktop**: Installed and running.
-   **Node.js**: Installed locally (for the Frontend).

### Step-by-Step

1.  **Configure Environment**
    ```bash
    cd backend
    cp .env.example .env
    ```
    -   Open `.env`.
    -   Set `OPENAI_API_KEY=sk-...` (Required for AI rewriting).
    -   Ensure `DB_HOST=db` (Since we use Docker).

2.  **Start Backend Services**
    ```bash
    docker-compose up -d --build
    ```
    -   This starts:
        -   **PostgreSQL** (Database)
        -   **Laravel App** (Backend API on localhost:8080)
    
3.  **Initialize Database**
    Run migrations inside the container:
    ```bash
    docker-compose exec app php artisan migrate
    ```

4.  **Start Frontend**
    Open a new terminal:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    -   Access the UI at `http://localhost:5173`.

5.  **Run the Pipeline**
    The pipeline script lives *inside* the backend container so it can access the internal network.
    
    **Option A: Via Frontend**
    -   Click the **"Run Pipeline Now"** button on the dashboard.
    
    **Option B: Manually**
    ```bash
    cd backend
    docker-compose exec app bash -c "cd /var/www/pipeline && npm start"
    ```

---

## 2. Deployment Instructions

### A. Backend (Docker-based Cloud)
Since the backend relies on system dependencies (PHP 8.1, Composer, Node 20), deploying via **Docker** is the most reliable method.

**Platforms**: DigitalOcean App Platform, Render (Docker), AWS ECS, Railway.

1.  **Dockerfile**: The project includes a production-ready `backend/Dockerfile` that installs PHP, Nginx, and Node.js.
2.  **Environment Variables**:
    -   Set `APP_ENV=production`
    -   Set `APP_DEBUG=false`
    -   Set `DB_...` variables to point to your managed database.
    -   Set `OPENAI_API_KEY`.

### B. Frontend (Static Hosting)
The frontend is a standard Vite React app.

**Platforms**: Vercel, Netlify, Cloudflare Pages.

1.  **Root Directory**: `frontend`
2.  **Build Command**: `npm run build`
3.  **Output Directory**: `dist`
4.  **Environment Variables**:
    -   `VITE_API_BASE_URL`: Set this to your deployed Backend API URL (e.g., `https://api.myapp.com/api/v1`).
    -   *Note: You may need to update `frontend/src/services/api.ts` to read this variable if not already configured.*

### C. Pipeline Automation
To run the scraping job automatically (e.g., every day):

**Option 1: Cron Job (Linux/Server)**
Add this entry to your server's crontab:
```bash
0 0 * * * docker exec beyondchats-app bash -c "cd /var/www/pipeline && npm start"
```

**Option 2: Cloud Scheduler**
If using a platform like Render or Heroku, create a "Cron Job" service that runs the same start command defined in `pipeline/package.json`.
