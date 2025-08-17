![JobTrace Logo](./public/jobtrace_logo.jpeg)

# JobTrace - Nigeria's Job Discovery Platform

**JobTrace** is a modern, youth-focused job tracking and discovery platform specifically designed for the Nigerian job market. Built with React, TypeScript, and Supabase, it provides a comprehensive solution for job seekers to find, save, and track career opportunities across Nigeria.

## 🚀 What JobTrace Does

JobTrace is an all-in-one job search platform that:

- **🔍 Job Discovery**: Scrapes and aggregates job listings from popular Nigerian job sites like HotNigerianJobs and NELEX
- **💾 Save & Track**: Allows users to save favorite job listings and track their application progress
- **🎯 Smart Search**: Provides advanced filtering by job title, location, company, and keywords
- **👤 User Profiles**: Complete user authentication and profile management with Supabase
- **📱 Responsive Design**: Mobile-optimized interface built with Tailwind CSS and shadcn/ui components
- **🔐 Secure Authentication**: Email confirmation, password reset, and secure user sessions
- **⚡ Real-time Updates**: Live job data fetching and real-time user interactions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Data Scraping**: Cheerio, Axios (for job aggregation)
- **State Management**: TanStack Query, React Context
- **Routing**: React Router DOM
- **Deployment**: Vercel (with serverless functions)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/OyoDL4AllCDS/trace-jobs.git
cd trace-jobs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: You'll need to create a Supabase project at [supabase.com](https://supabase.com) and get your project URL and anon key from the project settings.

### 4. Database Setup

Run the Supabase migrations to set up your database schema:

```bash
npx supabase db reset
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure
