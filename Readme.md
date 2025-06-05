## 📘 API Endpoints (v1)

### 🔍 `GET /api/v1/chapters`
**Description:** Fetch all chapters.  
**Query Filters:**
- `class`: Filter by class (e.g., `Class 11`)
- `unit`: Filter by unit name
- `status`: Filter by status (e.g., `Completed`, `Not Started`)
- `subject`: Filter by subject (e.g., `Physics`)
- `weakChapters`: `true` or `false`
- `page`: For pagination (default = 1)
- `limit`: Number of results per page (default = 10)

**Returns:** Filtered and paginated list of chapters + total count  
**Caching:** Cached via Redis for 1 hour

---

### 🔎 `GET /api/v1/chapters/:id`
**Description:** Fetch a single chapter by its MongoDB `_id`  
**Returns:** Chapter details or 404 if not found

---

### ⬆️ `POST /api/v1/chapters`
**Description:** Upload chapters via JSON file (admin-only)  
**Authorization:** Requires `Authorization: Bearer admin-secret-token` header  
**Body:** Upload `.json` file using `form-data` with field name `file`  

**Behavior:**
- Parses and validates uploaded chapters
- Inserts valid chapters into the database
- Skips invalid ones and returns them in a `failed` array

---

## 🧱 Middleware Features

- **Redis Caching:** For `GET /chapters` with 1-hour TTL
- **Rate Limiting:** 30 requests per minute per IP (Redis-backed)
- **Error Handling:** Proper HTTP status codes and JSON error messages

---


