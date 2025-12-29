# Low Level Design (LLD)

## Database Schema (PostgreSQL)

### `articles` Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | BigInt (PK) | Unique Identifier |
| `title` | Varchar(255) | Article Title |
| `slug` | Varchar(255) | URL-friendly identifier (Unique) |
| `original_content` | LongText | Raw HTML from source |
| `rewritten_content`| LongText | AI-Generated HTML |
| `source_url` | Varchar | Origin URL |
| `status` | Enum | `original`, `rewritten` |
| `published_at` | DateTime | Release date |
| `created_at` | Timestamp | |

## API Specifications

### GET /api/v1/articles
-   **Response**: `Article[]`
-   **Filtering**: Supports pagination (default 15).

### PUT /api/v1/articles/{id}
-   **Body**: `{ rewritten_content?: string, status?: string }`
-   **Logic**: Updates the rewritten content and marks status as 'rewritten'.

## Pipeline Modules

### 1. `BeyondChatsScraper`
-   **Input**: Base Blog URL.
-   **Logic**:
    -   Iterate `page/{n}` until 404 to find last page.
    -   Parse HTML to find `.post` elements.
    -   Extract Title, Date, Link.
    -   Visit individual links to extract `#primary .entry-content`.

### 2. `RewriterService`
-   **Input**: `original_text`, `related_contexts[]`.
-   **Prompt Strategy**:
    -   Role: "Expert Editor".
    -   Constraint: "Keep original intent but improve flow."
    -   Constraint: "Add citations section."
-   **Output**: HTML formatted string.

## Error Handling Strategies
-   **Scrapers**: 
    -   Use `User-Agent` rotation (simplified to one string for MVP).
    -   Timeouts set to 10s.
    -   Try/Catch blocks around every network call to prevent pipeline crash.
-   **API**:
    -   Laravel Request Validation ensures data integrity.
    -   404 returned for invalid IDs.
