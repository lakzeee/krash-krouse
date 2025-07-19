# Krash Kourse - Development Setup Guide

A comprehensive guide to setting up the Krash Kourse learning platform for local development. This Next.js-based application uses AI to create personalized learning courses with quizzes and progress tracking.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [System Requirements](#system-requirements)
4. [Installation Steps](#installation-steps)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [External Services Setup](#external-services-setup)
8. [Running the Application](#running-the-application)
9. [Development Workflow](#development-workflow)
10. [Troubleshooting](#troubleshooting)
11. [Additional Resources](#additional-resources)

## Project Overview

Krash Kourse is an AI-powered learning platform built with:

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL with Prisma migrations
- **Authentication**: Clerk for user management
- **AI Integration**: Google Gemini for course generation
- **Architecture**: Monorepo managed by Turborepo with pnpm workspaces
- **Testing**: Vitest for unit testing
- **API Documentation**: Swagger/OpenAPI

### Key Features
- AI-generated personalized learning courses
- Interactive quizzes with multiple question types
- User progress tracking
- Conversation-based course creation
- Real-time chat interface
- Dark/light theme support

## Prerequisites

### Required Software

1. **Node.js** (LTS version recommended)
   ```bash
   # Check your version
   node --version
   
   # Install via nvm (recommended)
   nvm install --lts
   nvm use --lts
   ```

2. **pnpm** (v10.0.0 or later)
   ```bash
   # Install pnpm globally
   npm install -g pnpm@10.0.0
   
   # Verify installation
   pnpm --version
   ```

3. **PostgreSQL** (latest version via Docker)
   - **Docker**: Required for simplified database setup
   - **Docker Compose**: Included with Docker Desktop

4. **Docker & Docker Compose**
   - **macOS**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - **Windows**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - **Linux**: Install Docker and Docker Compose via package manager
   ```bash
   # Verify installation
   docker --version
   docker compose --version
   ```

5. **Git**
   ```bash
   git --version
   ```

### Development Tools (Recommended)

- **VS Code** with extensions:
  - Prisma
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - ESLint
  - Prettier

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/lakzeee/krash-krouse
cd krash-krouse

# Verify you're in the correct directory
ls -la
# You should see: apps/, packages/, package.json, pnpm-workspace.yaml, turbo.json
```

### 2. Install Dependencies

```bash
# Install all dependencies for the monorepo
pnpm install

# This will install dependencies for:
# - Root workspace
# - apps/client (Next.js app)
# - packages/* (shared configurations)
```

### 3. Verify Installation

```bash
# Check if Turbo is working
pnpm turbo --version

# Verify workspace structure
pnpm list --depth=0
```

## Environment Configuration

### 1. Create Environment Files

The application requires several environment variables. Copy the sample environment file:

```bash
# Copy the sample environment file
cp apps/client/.env.local.sample apps/client/.env.local
```

### 2. Configure Environment Variables

Edit `apps/client/.env.local` and update the placeholder values with your actual API keys and credentials. The sample file includes:

```bash
# Database (already configured for Docker Compose)
DATABASE_URL="postgresql://postgres:password@localhost:5432/krash_kourse_dev"

# Clerk Authentication (Sign up at clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..." # Replace with your key
CLERK_SECRET_KEY="sk_test_..." # Replace with your key
SIGNING_SECRET="whsec_..." # Replace with your webhook signing secret

# Google AI (Get from Google AI Studio)
GEMINI_API_KEY="AIza..." # Replace with your API key

# Prisma Extensions (Optional)
OPTIMIZE_API_KEY="optimize_..." # Replace with your key or comment out

# Development Environment (already configured)
NODE_ENV="development"
VERCEL_ENV="development"
```

### 3. Environment Variables Explained

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Create local database |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | [Clerk Dashboard](https://clerk.com) |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard |
| `SIGNING_SECRET` | Webhook signature verification | Clerk Dashboard → Webhooks |
| `GEMINI_API_KEY` | Google AI API key | [Google AI Studio](https://aistudio.google.com) |
| `OPTIMIZE_API_KEY` | Prisma Optimize extension | [Prisma Console](https://console.prisma.io) |

## Database Setup

### 1. Setup Environment Variables

First, copy the sample environment file:

```bash
# Copy the sample environment file
cp apps/client/.env.local.sample apps/client/.env.local
```

### 2. Start PostgreSQL with Docker Compose

The project includes a `docker-compose.yml` file for easy database setup:

```bash
# Start PostgreSQL database
docker compose up -d postgres

# Verify the database is running
docker compose ps

# View database logs (optional)
docker compose logs postgres
```

### 3. Environment Configuration

The `.env.local` file should already have the correct `DATABASE_URL` for Docker Compose:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/krash_kourse_dev"
```

### 4. Run Database Migrations

```bash

# Generate Prisma client
pnpm --filter client prisma:generate

# Run migrations to create tables
pnpm --filter client prisma:migrate

# Optional: Seed the database with initial data
# (Create a seed script if needed)
```

### 5. Verify Database Setup

```bash
# Check database connection
pnpm --filter client prisma studio

# This opens Prisma Studio at http://localhost:5555
# You should see your database tables
```

## External Services Setup

### 1. Clerk Authentication Setup

1. **Create Clerk Account**: Sign up at [clerk.com](https://clerk.com)

2. **Create Application**:
   - Choose "Next.js" as framework
   - Note down your API keys

3. **Configure Webhooks**:
   - Go to Webhooks in Clerk Dashboard
   - Add endpoint: `http://localhost:3000/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the signing secret

4. **Configure Authentication Routes**:
   The app already includes middleware for protecting routes.

### 2. Google AI (Gemini) Setup

1. **Get API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com)
   - Sign in with Google account
   - Create new API key
   - Copy the key (starts with `AIza`)

2. **Test API Access**:
   ```bash
   # Test your API key
   curl -H "Content-Type: application/json" \
        -X POST \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

### 3. Prisma Optimize Setup (Optional)

1. **Create Account**: Visit [Prisma Console](https://console.prisma.io)
2. **Get API Key**: Create new project and copy optimize API key
3. **Note**: This is optional for development; you can comment out the extension if needed

## Running the Application

### 1. Start Development Server

```bash
# From project root, start all services
pnpm dev

# Or start specific services
pnpm turbo dev

# This starts:
# - Next.js app on http://localhost:3000
# - API routes
# - File watching for changes
```

### 2. Verify Application is Running

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Check Health**: Visit `http://localhost:3000/api/health-check`
3. **API Docs**: Visit `http://localhost:3000/api-docs` (development only)

### 3. Test Authentication

1. **Sign Up**: Create a test account
2. **Database Check**: Verify user creation in Prisma Studio
3. **Webhook Logs**: Check console for webhook processing

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm dev:turbo          # Start with Turbopack (faster)

# Building
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier
pnpm type-check         # TypeScript type checking

# Testing
pnpm test:unit          # Run unit tests
pnpm test:unit:ui       # Run tests with UI

# Database
pnpm prisma:migrate     # Run new migrations
pnpm prisma:generate    # Regenerate Prisma client
pnpm prisma:format      # Format Prisma schema

# Docker Database Management
docker compose up -d postgres           # Start PostgreSQL
docker compose down                     # Stop all services
docker compose restart postgres         # Restart PostgreSQL
docker compose logs postgres            # View PostgreSQL logs
docker compose exec postgres psql -U postgres -d krash_kourse_dev  # Connect to database
```

### Project Structure

```
krash-krouse/
├── apps/
│   └── client/              # Next.js application
│       ├── app/            # App router pages
│       ├── components/     # React components
│       ├── lib/           # Utilities and configurations
│       ├── prisma/        # Database schema and migrations
│       ├── services/      # Business logic services
│       └── types/         # TypeScript type definitions
├── packages/              # Shared configurations
│   ├── config-eslint/    # ESLint configuration
│   ├── config-prettier/  # Prettier configuration
│   ├── config-typescript/ # TypeScript configuration
│   └── config-vitest/    # Vitest configuration
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── turbo.json           # Turborepo configuration
```

### Development Best Practices

1. **Database Changes**:
   ```bash
   # After modifying schema.prisma
   pnpm prisma:generate    # Regenerate client
   pnpm prisma:migrate     # Create and apply migration
   ```

2. **Code Quality**:
   ```bash
   # Before committing
   pnpm lint               # Fix linting issues
   pnpm format             # Format code
   pnpm type-check         # Check types
   pnpm test:unit          # Run tests
   ```

3. **Adding Dependencies**:
   ```bash
   # Add to specific workspace
   pnpm --filter client add package-name
   
   # Add dev dependency
   pnpm --filter client add -D package-name
   ```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check if PostgreSQL container is running
docker compose ps

# Restart PostgreSQL container
docker compose restart postgres

# Check container logs
docker compose logs postgres

# Verify database connectivity
docker compose exec postgres pg_isready -U postgres

# Check DATABASE_URL format
echo $DATABASE_URL
```

#### 2. Prisma Client Out of Sync
```bash
# Regenerate Prisma client
cd apps/client
pnpm prisma:generate

# If still failing, reset and migrate
pnpm prisma migrate reset
pnpm prisma:migrate
```

#### 3. Clerk Authentication Issues
- Verify webhook URL is accessible
- Check signing secret is correct
- Ensure user events are enabled in Clerk dashboard

#### 4. Google AI API Errors
```bash
# Test API key
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
     "https://generativelanguage.googleapis.com/v1beta/models"
```

#### 5. Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 pnpm dev
```

#### 6. pnpm Install Issues
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Environment-Specific Issues

#### Windows Users
- Use Git Bash or WSL2 for best compatibility
- Ensure line endings are set to LF: `git config --global core.autocrlf false`

#### macOS Users
- If PostgreSQL install fails: `brew update && brew upgrade`
- For M1/M2 Macs: Ensure native Node.js build

### Debug Mode

Enable detailed logging:

```bash
# Add to .env.local
NODE_ENV=development
DEBUG=prisma:*

# Start with verbose logging
VERBOSE=1 pnpm dev
```

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Community
- [Next.js Discord](https://discord.gg/bUG2bvbtHy)
- [Prisma Discord](https://pris.ly/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nextjs)

---

## Quick Start Checklist

Use this checklist to ensure you have everything set up correctly:

- [ ] Node.js LTS version installed
- [ ] pnpm v10+ installed
- [ ] Docker and Docker Compose installed
- [ ] PostgreSQL container running (`docker compose up -d postgres`)
- [ ] Repository cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment file copied (`cp apps/client/.env.local.sample apps/client/.env.local`)
- [ ] `.env.local` file configured with actual API keys
- [ ] Database created and accessible
- [ ] Prisma client generated (`pnpm prisma:generate`)
- [ ] Database migrated (`pnpm prisma:migrate`)
- [ ] Clerk application configured
- [ ] Google AI API key obtained
- [ ] Development server starts (`pnpm dev`)
- [ ] Application accessible at `http://localhost:3000`
- [ ] Authentication flow working
- [ ] API endpoints responding

If all items are checked, you're ready to start developing! 🚀

---

**Need Help?** If you encounter issues not covered in this guide, please check the [troubleshooting section](#troubleshooting) or create an issue in the project repository. 