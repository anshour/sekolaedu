# Coding Guideline

This document outlines the coding standards, architecture, and best practices for the frontend of the SekolaEdu project. It is intended to ensure consistency, maintainability, and scalability across the codebase.

## Tech Stack
- **Next.js 15.1.8** - React framework with App Router
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Chakra UI 3.19.1** - Component library with design system
- **React Query (TanStack Query) 5.76.2** - Server state management
- **Zustand 5.0.5** - Client state management
- **React Hook Form 7.56.4** - Form handling
- **Axios 1.9.0** - HTTP client
- **Lucide React** - Icon library
- **Day.js** - Date manipulation
- **React Hot Toast** - Toast notifications

## Project Structure

```
src/
├── components/
│   ├── feature/           # Feature-specific components
│   ├── layout/           # Layout components (admin, student, teacher, etc.)
│   ├── shared-page/      # Reusable page components
│   └── ui/               # Base UI components and form components
├── constants/            # Application constants
├── context/             # Global state management (Zustand stores)
├── hooks/               # Custom React hooks
├── pages/               # Next.js pages (file-based routing)
├── styles/              # Global styles
├── theme/               # Chakra UI theme configuration
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Architecture Patterns

### 1. Layout Pattern
- Uses Next.js layout pattern with `Component.layout` property
- Role-based layouts: `AdminLayout`, `StudentLayout`, `TeacherLayout`, `PrincipalLayout`
- Layout components handle authentication, authorization, and navigation

```typescript
// Page component with layout
Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
```

### 2. State Management
- **Global State**: Zustand with persistence for user authentication
- **Server State**: React Query for API data fetching and caching
- **Form State**: React Hook Form for form management

### 3. Component Organization
- **UI Components**: Reusable, unstyled base components in `src/components/ui/`
- **Feature Components**: Business logic components in `src/components/feature/`
- **Layout Components**: Navigation and page structure in `src/components/layout/`
- **Shared Pages**: Reusable page-level components in `src/components/shared-page/`

## Coding Standards

### 1. TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*` maps to `./src/*`)
- ESNext target for modern JavaScript features

### 2. ESLint Rules
```javascript
{
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/ban-ts-comment": "off"
}
```

### 3. File Naming Conventions
- kebab case for file names (e.g., `user-profile.tsx`)
- camelCase for function and variable names (e.g., `fetchUserData`)

### 4. Import Organization
```typescript
// External libraries first
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

// Internal imports with @ alias
import useUser from "@/context/use-user";
import { InputField } from "@/components/ui/form/input-field";
```

## Component Patterns

### 1. Form Components
Use the `FormProvider` wrapper for consistent form handling:

```typescript
<FormProvider
  defaultValues={{ name: "", email: "" }}
  method="patch"
  api="/users/profile"
  successMessage="Profile updated successfully"
  onSuccess={handleSuccess}
>
  {({ isLoading, control }) => (
    <>
      <InputField
        control={control}
        name="name"
        label="Name"
        rules={{ required: "Required field" }}
      />
      <Button type="submit" loading={isLoading}>
        Save
      </Button>
    </>
  )}
</FormProvider>
```

### 2. Layout Components
- Include authentication checks and role-based access control
- Handle responsive sidebar navigation
- Use consistent spacing and styling patterns

### 3. UI Components
- Follow Chakra UI patterns and conventions
- Use compound components pattern (e.g., `Card.Root`, `Card.Body`)
- Implement proper TypeScript interfaces for props

## State Management Patterns

### 1. Zustand Store Structure
```typescript
interface UserStore {
  user: User | null;
  refetchUser: () => Promise<void>;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  isHydrated: boolean;
  onHydrated: () => void;
}

const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.onHydrated();
      },
    }
  )
);
```

### 2. React Query Configuration
- Network mode: "always"
- Disable refetch on window focus
- Disable automatic retries
- 4-second toast duration for notifications

## API Integration

### 1. HTTP Client Configuration
- Axios instance with base URL from environment variables
- Automatic token injection via interceptors
- Global error handling with user-friendly messages
- Support for FormData transformation

### 2. Error Handling
- Centralized error handling in HTTP interceptors
- Role-based error messages in Indonesian
- Toast notifications for user feedback
- Proper TypeScript error interfaces

## Theme and Styling

### 1. Chakra UI System
- Custom theme configuration in `src/theme/system.ts`
- Inter Variable font family for consistency
- Custom slot recipes for component variants
- Responsive design with breakpoint values

### 2. Color Mode Support
- Dark/light mode toggle functionality
- Persistent color mode preferences
- Proper color mode provider setup

## Best Practices

### 1. Component Development
- Use TypeScript interfaces for all props
- Implement proper error boundaries
- Follow single responsibility principle
- Use compound components for complex UI elements

### 2. Performance Optimization
- Implement proper React Query caching strategies
- Use Next.js built-in optimizations
- Lazy load components when appropriate
- Optimize bundle size with proper imports

### 3. Security
- Role-based access control in layouts
- Token-based authentication
- Proper route protection
- Input validation and sanitization

### 4. Code Quality
- Consistent code formatting
- Meaningful variable and function names
- Proper TypeScript typing
- Regular ESLint compliance

## Development Workflow

### 1. Environment Setup
- Use `pnpm` as package manager
- Node.js with TypeScript support
- ESLint for code quality
- Next.js development server

### 2. Component Creation
1. Create component in appropriate directory
2. Define TypeScript interfaces
3. Implement component logic
4. Add proper error handling
5. Test component functionality

### 3. API Integration
1. Define API endpoints in HTTP client
2. Create React Query hooks for data fetching
3. Implement proper error handling
4. Add loading and success states

This guideline should be regularly updated as the project evolves and new patterns emerge.
