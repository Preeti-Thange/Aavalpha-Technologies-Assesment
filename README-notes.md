# README-notes.md — Avalpha Technologies Commission Calculator

## Design Decisions & Trade-offs

### 1️⃣ Project Structure
- Chose a **clean separation** between backend (`.NET API`) and frontend (`React UI`).
- This allows independent testing and faster local iteration.

### 2️⃣ Backend
- Used **C# / .NET 8 MVC Controller** pattern for clarity.
- Business logic isolated in `CommissionService` for unit testing.
- Validation handled in `CommissionCalculationRequest.Validate()` method.
- Response model structured and typed (DTO-style).

**Trade-off:**  
Did not implement full persistence (e.g., database) — unnecessary for this scope.

### 3️⃣ Frontend
- Used **Create React App** with functional components and hooks.
- Chose plain CSS for styling (lightweight, fast).
- Used `fetch` for backend communication; could be swapped to Axios for production.
- Tests use **React Testing Library + Jest** for unit + integration style checks.

**Trade-off:**  
Did not use TypeScript (timeboxed); JS was sufficient for correctness and speed.

### 4️⃣ Testing
- Backend → `xUnit` tests verify commission calculations and input validation.
- Frontend → Jest/RTL tests for UI rendering, user interactions, and error handling.

### 5️⃣ Error Handling
- Both backend and frontend validate inputs (≥ 0, upper bounds).
- Frontend displays graceful alert messages on API/network failure.

### 6️⃣ What Could Be Improved (If More Time)
- Add **TypeScript** types and API interfaces.
- Add **Swagger** or minimal OpenAPI spec.
- Add **Cypress** or Playwright for E2E UI testing.
- Add **Docker Compose** for one-command run of API + UI.
- Implement **CI pipeline** (GitHub Actions) to run tests automatically.

---

##  Summary

Focus was on **clarity, correctness, and structure** within 4-hour timebox.  
All requirements — validation, calculations, integration, and testing — are covered.

 
