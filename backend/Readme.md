
# 📦 SvaraAI – Backend (Task & Project Management System)

This is the **backend implementation** for the SvaraAI Full Stack Developer Internship Assignment.  
It provides secure authentication, project & task APIs (with filters and pagination), and follows a **clean modular architecture** (Controllers → Services → Repositories → Models).  

Built with: **Node.js, Express.js, MongoDB, JWT, Jest**.  

---

## 🚀 Features

- **User Authentication**
  - Signup / Login / Logout with JWT (access + refresh tokens)
  - Secure HTTP-only cookies for tokens
- **Projects**
  - Create, list (by owner), delete
- **Tasks**
  - Create, edit, delete
  - Fetch by project
  - Filters → status, priority, deadline range
  - Pagination support
- **Architecture**
  - Modular design: controllers, services, repositories
  - Middleware for authentication & error handling
- **Testing**
  - Jest + Supertest integration tests
  - In-memory MongoDB for isolated runs

---

## 📂 Folder Structure

```

/backend
├── src
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry
│   ├── config/               # Database connection
│   ├── controllers/          # Request/response handlers
│   ├── services/             # Business logic
│   ├── repositories/         # Database access layer
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── middleware/           # Auth & error handling
│   └── utils/                # Helpers (tokens, errors, asyncHandler)
├── tests/                    # Jest tests (with in-memory MongoDB)
├── package.json
├── jest.config.cjs
└── .env.example

````

---

## ⚙️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (Access + Refresh tokens, secure cookies)
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Utilities:** bcryptjs, dotenv, cookie-parser, cors

---

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/svaraai-backend.git
   cd svaraai-backend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Copy `.env.example` → `.env` and fill values:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/svaraai
   ACCESS_TOKEN_SECRET=your_access_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Run the app**

   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

5. **Run tests**

   ```bash
   npm test
   ```

---

## 🔑 API Endpoints

### Auth

* `POST /api/auth/signup` → Register new user
* `POST /api/auth/login` → Login (returns tokens + sets cookies)
* `POST /api/auth/logout` → Logout (requires auth)

### Projects

* `POST /api/projects` → Create project
* `GET /api/projects` → List user’s projects
* `DELETE /api/projects/:projectId` → Delete project

### Tasks

* `POST /api/tasks` → Create task
* `PUT /api/tasks/:taskId` → Update task
* `DELETE /api/tasks/:taskId` → Delete task
* `GET /api/tasks/:projectId` → Fetch tasks with filters + pagination

**Query Parameters (GET tasks):**

```
status=todo|in-progress|done
priority=low|medium|high
startDate=YYYY-MM-DD
endDate=YYYY-MM-DD
page=1
limit=10
```

---

## 🧱 Architecture

This project follows **3-layered modular architecture**:

1. **Controllers** → Handle requests & responses (no business logic).
2. **Services** → Contain business rules (auth, validation, orchestration).
3. **Repositories** → Abstract DB operations (Mongoose queries).
4. **Models** → Define MongoDB document structure.

Additional layers:

* **Middleware** → Auth checks, error formatting.
* **Utils** → Common helpers (`ApiError`, `ApiResponse`, token generation).
* **Tests** → Integration tests with in-memory MongoDB.

**Flow Example (Create Task):**

```
Route → Controller → Service → Repository → Model → MongoDB
```

---

## 🧪 Testing

* **Framework:** Jest + Supertest
* **Database:** mongodb-memory-server (runs Mongo in-memory)
* **Example test (`tests/task.integration.test.js`):**

  * Signup → Login → Create Project → Create Task
  * Verifies status codes and response data

Run:

```bash
npm test
```

---

## 📈 Future Improvements

* Add **refresh token endpoint** (`/api/auth/refresh`)
* Role-based access control (e.g., admin vs. user)
* Input validation with `zod` or `joi`
* Rate limiting / request logging
* CI/CD pipeline (GitHub Actions)

---

## 👤 Author

Developed as part of **SvaraAI Full Stack Developer Internship Assignment (2025)**.

```

---

Do you want me to also include a **Mermaid diagram** in this README to visually show the request flow (`Route → Controller → Service → Repository → DB`)? It would make your architecture explanation stand out.

