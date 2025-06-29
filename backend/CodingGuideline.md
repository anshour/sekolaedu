# Coding Guideline

This document outlines the coding standards, architecture, and best practices for the backend API of the SekolaEdu project. It is intended to ensure consistency, maintainability, and scalability across the codebase.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js 5.x
- **Database**: PostgreSQL with Knex.js query builder
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **Validation**: Zod for schema validation
- **File Upload**: Multer with Sharp for image processing
- **Cloud Storage**: AWS S3 SDK
- **Email**: Nodemailer with React Email templates
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Pino with pino-pretty
- **Development**: tsx for development server, TypeScript compiler

## Architecture Overview

This backend API follows a layered architecture pattern with clear separation of concerns:

```
Router → Controller → Service → Model/Database
```

- **Routers**: Handle HTTP routing and middleware application
- **Controllers**: Handle HTTP request/response logic and validation
- **Services**: Contain business logic and data manipulation
- **Models**: Define data structures and types
- **Migrations**: Handle database schema changes

## Coding Standard

Please follow these coding standards when writing code:

- Use clear and descriptive variable names.
- Follow the established architecture patterns described below.
- Use TypeScript interfaces for type safety.
- Implement proper error handling and validation.
- Dont add any comment as it is not needed as the code is self-explanatory.
- Use consistent naming conventions across all layers.

## Routers

Routers are responsible for defining API endpoints and applying middleware. They should be kept minimal and focused on routing concerns.

### Structure

- Located in `src/routers/`
- Named with `-router.ts` suffix (e.g., `user-router.ts`)
- Export a default Express router instance

### Conventions

- Apply authentication middleware at router level when needed
- Use permission-based authorization for protected routes
- Group related endpoints in the same router
- Use descriptive route paths that follow RESTful conventions

### Example Pattern

```typescript
import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import userController from "~/controllers/user-controller";
import { Permission } from "~/constants/permissions";

const userRouter = express.Router();

// Apply authentication to all routes
userRouter.use(authenticate);

// Define routes with appropriate permissions
userRouter.get(
  "/",
  authorizePermission(Permission.ManageUsers),
  userController.getAllUsers,
);

userRouter.post(
  "/",
  authorizePermission(Permission.ManageUsers),
  userController.createUser,
);

export default userRouter;
```

### Best Practices

- Keep routers focused on routing logic only
- Delegate business logic to controllers
- Use middleware for cross-cutting concerns (auth, validation, etc.)
- Follow RESTful naming conventions for endpoints

## Controllers

Controllers handle HTTP request/response logic, input validation, and coordinate between routers and services.

### Structure

- Located in `src/controllers/`
- Named with `-controller.ts` suffix (e.g., `user-controller.ts`)
- Export a default object with controller methods

### Conventions

- Each method should handle one specific endpoint
- Use Zod for request validation
- Handle errors appropriately with proper HTTP status codes
- Keep controllers thin - delegate business logic to services
- Always return consistent response formats

### Example Pattern

```typescript
import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import UserService from "~/services/user-service";
import { z } from "zod/v4";

const userController = {
  async getAllUsers(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["name", "email", "search"],
      allowedSorts: ["name", "email", "role_name", "is_active"],
    });

    const params = validate(schema, req.query);
    const users = await UserService.getAll(params);

    res.status(200).json(users);
  },

  async createUser(req: Request, res: Response) {
    const schema = z.object({
      name: z.string().min(2),
      email: z.email(),
      role_id: z.coerce.number().int().positive(),
    });

    const userData = validate(schema, req.body);
    const user = await UserService.createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  },
};

export default userController;
```

### Best Practices

- Validate all inputs using Zod schemas
- Use appropriate HTTP status codes
- Handle file uploads when needed (with multer)
- Implement proper error handling
- Keep methods focused on single responsibilities

## Services

Services contain the core business logic and handle data operations. They act as an abstraction layer between controllers and the database.

### Structure

- Located in `src/services/`
- Named with `-service.ts` suffix (e.g., `user-service.ts`)
- Implemented as classes with static methods
- Export a default class

### Conventions

- Contain all business logic and data manipulation
- Use Knex for database operations
- Handle complex operations like authentication, authorization
- Implement data validation and transformation
- Manage relationships between entities

### Example Pattern

```typescript
import bcrypt from "bcryptjs";
import knex from "../database/connection";
import { User } from "../models/user";
import { HttpError } from "../types/http-error";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { paginate } from "~/utils/pagination";

class UserService {
  static async createUser(user: Partial<User>): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password!);

    const [insertedUser] = await knex("users")
      .insert({
        ...user,
        password: hashedPassword,
      })
      .returning("id");

    return { id: insertedUser.id, ...user } as User;
  }

  static async getById(id: number): Promise<User | null> {
    const user = await knex("users")
      .select("id", "name", "email", "role_id", "photo_url", "is_active")
      .where({ id })
      .first();

    if (!user) {
      return null;
    }

    return user;
  }

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<User>> {
    const query = knex("users")
      .join("roles", "users.role_id", "roles.id")
      .select([
        "users.id",
        "users.name",
        "users.email",
        "users.is_active",
        "roles.name AS role_name",
      ]);

    return await paginate<User>(query, params, "users.id");
  }

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}

export default UserService;
```

### Best Practices

- Use static methods for stateless operations
- Implement proper error handling with custom HttpError
- Use transactions for complex operations
- Handle password hashing and security concerns
- Implement pagination for list operations
- Use joins efficiently for related data

## Models

Models define TypeScript interfaces that represent data structures and database entities.

### Structure

- Located in `src/models/`
- Named with the entity name (e.g., `user.ts`, `role.ts`)
- Export interfaces that match database table structure

### Conventions

- Use PascalCase for interface names
- Include all database fields as interface properties
- Use appropriate TypeScript types
- Include optional properties where applicable
- Add computed properties when needed (e.g., `role_name`)

### Example Pattern

```typescript
export interface User {
  id: number;
  name: string;
  role_id: number | null;
  role_name: string | null; // Computed property from join
  photo_url?: string | null;
  email: string;
  password?: string; // Optional for security
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: string[]; // Computed property
}

export interface Role {
  id: number;
  name: string;
  readable_name?: string;
  created_at: string;
  updated_at: string;
}
```

### Best Practices

- Keep interfaces simple and focused
- Use nullable types appropriately
- Include computed properties for joined data
- Make sensitive fields optional (like passwords)
- Use consistent naming with database columns

## Migrations

Migrations handle database schema changes and ensure consistent database structure across environments.

### Structure

- Located in `src/migrations/`
- Named with timestamp prefix (e.g., `20250129040838_create_users_table.ts`)
- Export `up` and `down` functions

### Conventions

- Use descriptive names that explain the change
- Always implement both `up` and `down` functions
- Use Knex schema builder methods
- Handle foreign key constraints properly
- Include proper indexing for performance

### Example Pattern

```typescript
import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("email", 150).notNullable().unique().index();
    table.string("password", 180).notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
```

### Complex Migration Example

```typescript
export async function up(knex: Knex) {
  return knex.schema
    .createTable("permissions", (table) => {
      table.increments("id").primary();
      table.string("name", 100).unique().notNullable();
      table.string("description").nullable();
      table.timestamps(true, true);
    })
    .createTable("roles", (table) => {
      table.increments("id").primary();
      table.string("name", 25).unique().notNullable();
      table.timestamps(true, true);
    })
    .table("users", (table) => {
      table.integer("role_id").unsigned().nullable();
      table.foreign("role_id").references("roles.id").onDelete("CASCADE");
    });
}
```

### Best Practices

- Always test migrations in development first
- Use appropriate data types and constraints
- Implement proper foreign key relationships
- Add indexes for frequently queried columns
- Use transactions for complex migrations
- Keep migrations atomic and reversible

## File Organization

```
src/
├── controllers/          # HTTP request handlers
├── services/            # Business logic layer
├── models/              # TypeScript interfaces
├── routers/             # Route definitions
├── migrations/          # Database schema changes
├── middlewares/         # Express middlewares
├── utils/               # Utility functions
├── types/               # Custom type definitions
└── config/              # Configuration files
```

## Integration Example

Here's how all layers work together for a typical user creation flow:

1. **Router** (`user-router.ts`): Defines POST `/users` endpoint with authentication and authorization
2. **Controller** (`user-controller.ts`): Validates request data using Zod schema
3. **Service** (`user-service.ts`): Handles password hashing, database insertion, and related entity creation
4. **Model** (`user.ts`): Defines the User interface structure
5. **Migration**: Ensures the users table exists with proper schema

This architecture ensures separation of concerns, maintainability, and scalability of the application.
