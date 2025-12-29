# Data Flow & Architecture Diagram

```mermaid
graph TD
    %% Users and External Systems
    User[User / Browser]
    Ext_Blog[BeyondChats Blog]
    Ext_Google[Google Search]
    Ext_OpenAI[OpenAI API]

    %% Frontend Service
    subgraph Frontend_App [Frontend (React + Vite)]
        UI[Dashboard UI]
        API_Client[Axios Client]
    end

    %% Backend Service
    subgraph Backend_App [Backend (Laravel 10)]
        API_Routes[API Routes /api/v1]
        Controller[ArticleController]
        Model[Article Model]
    end

    %% Database
    subgraph Database [PostgreSQL]
        DB[(Articles Table)]
    end

    %% Pipeline Service
    subgraph Pipeline_Service [Node.js Pipeline]
        Scraper[BeyondChatScraper]
        SearchService[Search Service]
        Rewriter[AI Rewriter]
        Publisher[Publisher Service]
    end

    %% Data Flows
    User -->|View Dashboard http://localhost:5173| UI
    UI -->|Click 'Run Pipeline'| API_Client
    UI -->|Review Content| API_Client
    
    API_Client -->|REST API Requests http://localhost:8080| API_Routes
    API_Routes -->|Dispatch| Controller
    Controller <-->|Query/Save| Model
    Model <-->|SQL| DB

    %% Pipeline Logic
    Controller -.->|Trigger Command| Pipeline_Service
    
    Pipeline_Service -->|1. Scrape Content| Ext_Blog
    Scraper -->|Extracted Text| Pipeline_Service
    
    Pipeline_Service -->|2. Search Related Info| Ext_Google
    
    Pipeline_Service -->|3. Enhance Content| Rewriter
    Rewriter <-->|Prompt & Completion| Ext_OpenAI
    
    Pipeline_Service -->|4. Save/Update Article| Publisher
    Publisher -->|PUT /api/v1/articles| API_Routes
```

## Description of Flows

1.  **Ingestion Flow**:
    *   The **Pipeline** is triggered (manually or via cron).
    *   It **Scrapes** the latest articles from the *BeyondChats Blog*.
    *   It **Searches** Google for context validation (simulated/RAG-lite).
    *   It sends the mock content + sources to **OpenAI** to rewrite the article.
    *   The **Publisher** sends the final "Enhanced" article back to the **Backend** via API.

2.  **User Flow**:
    *   User visits the **Frontend Dashboard**.
    *   Frontend fetches the list of articles from the **Backend**.
    *   User can view the side-by-side comparison of *Original* vs *Enhanced* content.
