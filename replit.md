# CoopKeeper - Chicken Coop Management PWA

## Overview

CoopKeeper is a Progressive Web Application (PWA) designed for chicken coop management. Built with a modern React stack, it provides offline-capable tracking of eggs, daily tasks, expenses, and chicken profiles. The application uses localStorage for data persistence and is optimized for mobile use while maintaining desktop compatibility.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: React hooks with localStorage for persistence
- **PWA Features**: Service worker for offline support, manifest for installability

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Routes**: REST endpoints under `/api` prefix
- **Storage Interface**: Abstracted storage layer with memory-based implementation
- **Development**: Hot module replacement via Vite middleware integration

## Key Components

### Core Application Features
1. **Egg Counter**: Daily egg tracking with weekly statistics
2. **Task Board**: Daily checklist management for coop maintenance
3. **Expense Tracker**: Financial record keeping for coop-related costs
4. **Chicken Profiles**: Individual chicken management with photos and details

### UI Components
- **Navigation**: Bottom tab navigation for mobile-first design
- **Custom Components**: Built on shadcn/ui foundation with Radix UI primitives
- **Theme System**: CSS custom properties with light/dark mode support
- **Color Palette**: Custom coop-themed colors (yellow #F3D34A, brown #6F4E37)

### PWA Implementation
- **Service Worker**: Caches static assets and enables offline functionality
- **Manifest**: Defines app metadata, icons, and installation behavior
- **Offline Storage**: localStorage for all application data persistence

## Data Flow

### Client-Side Data Management
1. **localStorage Keys**:
   - `eggs-YYYY-MM-DD`: Daily egg counts
   - `tasks-YYYY-MM-DD`: Daily task completion status
   - `coop-expenses`: Array of expense records
   - `coop-chickens`: Array of chicken profiles

2. **Data Persistence Strategy**:
   - Immediate localStorage updates on user actions
   - Date-based keys for time-series data (eggs, tasks)
   - JSON serialization for complex objects

3. **State Synchronization**:
   - React useState hooks for component state
   - useEffect hooks for localStorage synchronization
   - No external state management library (keeping it simple)

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Foundation**: Radix UI primitives, shadcn/ui components
- **Styling**: TailwindCSS, class-variance-authority, clsx
- **Utilities**: date-fns for date manipulation, lucide-react for icons

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full type safety across frontend and backend
- **Development**: tsx for TypeScript execution, Replit-specific plugins

### Database Preparation
- **Drizzle ORM**: Configured for PostgreSQL with schema definition
- **Database**: Neon serverless PostgreSQL (connection ready but not actively used)
- **Migrations**: Drizzle-kit for schema management

## Deployment Strategy

### Production Build Process
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: esbuild compiles TypeScript server to `dist/index.js`
3. **Static Serving**: Express serves built frontend assets in production

### Environment Configuration
- **Development**: Vite dev server with HMR and Express API
- **Production**: Single Express server serving both API and static files
- **Database**: Environment variable `DATABASE_URL` for PostgreSQL connection

### Hosting Considerations
- **Replit Optimized**: Includes Replit-specific development tools and banners
- **PWA Requirements**: HTTPS required for service worker functionality
- **Mobile First**: Responsive design optimized for mobile devices

### Key Architectural Decisions

1. **LocalStorage Over Database**: Chosen for simplicity and offline capability, avoiding backend complexity for MVP
2. **PWA Approach**: Enables app-like experience with offline functionality and installability
3. **Component Library**: shadcn/ui provides consistent, accessible components while maintaining customization flexibility
4. **Monorepo Structure**: Single repository with shared types and clear separation between client/server code
5. **TypeScript Throughout**: Ensures type safety and better developer experience across the stack

The application is designed to be lightweight, offline-capable, and focused on the specific needs of chicken coop management while maintaining potential for future backend integration.