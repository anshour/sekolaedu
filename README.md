# SekolaEdu Project

![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚧 Project Status

**This project is currently in active development.** Features and APIs may change frequently. Not recommended for production use yet.

## Introduction

**SekolaEdu** is an open-source school management system designed to help schools manage administration, learning activities, and finances in an integrated manner on one platform. Built with modern web technologies, SekolaEdu provides a comprehensive solution for educational institutions to streamline their operations and enhance the learning experience.

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, Chakra UI, Zustand, React Query
- **Backend**: Express.js, TypeScript, Sequelize, PostgreSQL
- **Deployment**: Docker, Google Cloud Run ready

## Folder Structure

This project uses **Turborepo** with PNPM Workspaces to manage multiple packages in a monorepo setup:

```
sekolaedu/
├── apps/
│   ├── frontend/     # NextJS app with Chakra UI
│   └── backend/      # ExpressJS Rest API
├── packages/
│   └── shared/       # Shared types, constants and utilities
├── .env.example
├── turbo.json
├── package.json
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 22+ (check with `node --version`)
- **PNPM** 10+ (install with `npm install -g pnpm`)

### Installation

1. Clone the repository

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables : Copy `.env.example` to `.env` and update the values as needed.

4. Start the development server:

   ```bash
   pnpm dev
   ```
