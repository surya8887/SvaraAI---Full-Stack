# 🎯 SvaraAI Frontend - Project Management Dashboard

A modern, responsive **project management dashboard** built with Next.js 15 and TypeScript. Part of the SvaraAI Full Stack Developer Internship Assignment, this frontend provides an intuitive interface for managing projects and tasks with real-time analytics and drag-and-drop functionality.

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time Overview**: Project count, overdue tasks, and total task statistics
- **Interactive Charts**: Visual task status breakdown using Recharts
- **Responsive Design**: Optimized for desktop and mobile devices

### 🏗️ Project Management
- **Project Overview**: View all projects with detailed information
- **Project Details**: Individual project pages with associated tasks
- **CRUD Operations**: Create, read, update, and delete projects

### ✅ Task Management
- **Task Tracking**: Full lifecycle management (Todo → In Progress → Done)
- **Priority System**: Low, Medium, High priority levels
- **Deadline Management**: Track and visualize overdue tasks
- **Drag & Drop**: Intuitive task status updates with @hello-pangea/dnd
- **Advanced Filtering**: Filter by status, priority, and date ranges

### 🔐 Authentication & Security
- **JWT Authentication**: Secure login/signup with token management
- **Protected Routes**: Middleware-protected pages and API calls
- **User Management**: Profile management and session handling

### 🎨 Modern UI/UX
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first styling with custom design system
- **Dark/Light Theme Ready**: Built-in theme support
- **Responsive Layout**: Mobile-first design approach

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS processing and optimization

### State Management & Forms
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation resolvers

### Data & API
- **Axios** - HTTP client for API communication
- **React Query** - Data fetching and caching (ready for implementation)

### Development Tools
- **ESLint 9** - Code linting and formatting
- **TypeScript** - Static type checking
- **Next.js DevTools** - Development debugging tools

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── project/           # Project-related pages
│   ├── projects/          # Projects listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── ChartSummary.tsx  # Analytics chart component
│   ├── Header.tsx        # Navigation header
│   ├── ProjectCard.tsx   # Project display card
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── TaskCard.tsx      # Task display card
│   └── TaskModal.tsx     # Task creation/editing modal
├── hooks/                # Custom React hooks
│   └── useAuth.ts        # Authentication hook
├── lib/                  # Utility libraries
│   ├── api.ts           # API client configuration
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - Runtime environment
- **npm/yarn/pnpm** - Package manager
- **Backend API** - Running SvaraAI backend server

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**

   Create `.env.local` file in the frontend directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

   > **Note**: Update the API URL to match your backend server configuration.

4. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in Browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

   > **Note**: Ensure the backend server is running on the configured API URL.

## 🔧 Available Scripts

- **`npm run dev`** - Start development server with Turbopack
- **`npm run build`** - Build production application
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint code analysis

## 🔌 API Integration

The frontend communicates with the SvaraAI backend API through RESTful endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user info

### Projects
- `GET /api/projects` - Fetch user's projects
- `POST /api/projects` - Create new project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Fetch all tasks
- `GET /api/tasks/:projectId` - Fetch project tasks with filters
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Query Parameters (Tasks)
```
?status=todo|in-progress|done
?priority=low|medium|high
?startDate=YYYY-MM-DD
?endDate=YYYY-MM-DD
?page=1
?limit=10
```

## 🎨 Design System

### Color Palette
- **Primary**: Neutral grays with accent colors
- **Status Colors**:
  - Todo: Blue (#3B82F6)
  - In Progress: Yellow (#F59E0B)
  - Done: Green (#10B981)
- **Priority Colors**:
  - Low: Green (#10B981)
  - Medium: Yellow (#F59E0B)
  - High: Red (#EF4444)

### Typography
- **Font Family**: Geist (Next.js default)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Buttons**: Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Cards**: Consistent padding and shadow system
- **Forms**: Input, textarea, select with validation states
- **Modals**: Dialog components for task creation/editing

## 🔐 Authentication Flow

1. **User visits the application**
2. **Authentication check** via `useAuth` hook
3. **Redirect to login** if no valid token found
4. **Login/Signup** stores JWT token in localStorage
5. **API client** configured with Authorization header
6. **Protected routes** accessible after authentication

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid System**: CSS Grid and Flexbox for layouts
- **Touch Friendly**: Optimized for touch interactions

## 🧪 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting (recommended)

### Component Structure
- **Functional Components** with TypeScript interfaces
- **Custom Hooks** for reusable logic
- **Props Interface** definitions for all components
- **Error Boundaries** for graceful error handling

### State Management
- **Local State**: React useState for component state
- **Global State**: Authentication state via useAuth hook
- **Server State**: Direct API calls with Axios

## 🚀 Production Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Variables
Ensure production environment variables are properly configured:
- `NEXT_PUBLIC_API_URL` - Production API endpoint
- `NODE_ENV=production` - Production mode

### Optimization
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **CSS Purging**: Tailwind CSS unused style removal
- **Bundle Analysis**: Available via `@next/bundle-analyzer`

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards** (TypeScript, ESLint)
4. **Test thoroughly** across different devices
5. **Submit pull request** with detailed description

## 📄 License

This project is part of the SvaraAI Full Stack Developer Internship Assignment.

## 👤 Author

Developed as part of **SvaraAI Full Stack Developer Internship Assignment (2025)**.

---

**Need Help?** Check the [backend documentation](../backend/Readme.md) for API details or the [main project README](../readme.md) for full-stack setup instructions.
