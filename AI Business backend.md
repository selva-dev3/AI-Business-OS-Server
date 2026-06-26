# AI Business OS — Backend Architecture Documentation

> **Version:** 1.0.0 | **Stack:** NestJS + PostgreSQL + Prisma + Redis + BullMQ  
> **Author:** AI Business OS Team | **Last Updated:** 2025

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Clean Architecture & DDD](#4-clean-architecture--ddd)
5. [Database Design](#5-database-design)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [RBAC System](#7-rbac-system)
8. [Email Service](#8-email-service)
9. [File Upload Service](#9-file-upload-service)
10. [Notification Service](#10-notification-service)
11. [WebSocket Gateway](#11-websocket-gateway)
12. [Queue System — BullMQ](#12-queue-system--bullmq)
13. [AI Service](#13-ai-service)
14. [Audit Log System](#14-audit-log-system)
15. [Search Service](#15-search-service)
16. [Logging & Monitoring](#16-logging--monitoring)
17. [Module Documentation](#17-module-documentation)
    - [17.1 Auth Module](#171-auth-module)
    - [17.2 Users Module](#172-users-module)
    - [17.3 Company Module](#173-company-module)
    - [17.4 HRMS Module](#174-hrms-module)
    - [17.5 CRM Module](#175-crm-module)
    - [17.6 Inventory Module](#176-inventory-module)
    - [17.7 Procurement Module](#177-procurement-module)
    - [17.8 Finance Module](#178-finance-module)
    - [17.9 Projects Module](#179-projects-module)
    - [17.10 Support Module](#1710-support-module)
    - [17.11 Documents Module](#1711-documents-module)
    - [17.12 Analytics Module](#1712-analytics-module)
    - [17.13 Settings Module](#1713-settings-module)
18. [API Reference Summary](#18-api-reference-summary)
19. [Docker & Deployment](#19-docker--deployment)
20. [Testing Strategy](#20-testing-strategy)

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│           Next.js 15 (Vercel / Docker)                  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS / WSS
┌──────────────────────────▼──────────────────────────────┐
│                  API GATEWAY                             │
│           Nginx / Cloudflare                            │
│         Rate Limiting, SSL, Load Balance                │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                NESTJS APPLICATION                        │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Auth    │  │  HRMS    │  │   CRM    │  ...         │
│  │ Module   │  │ Module   │  │  Module  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Email   │  │  Queue   │  │    AI    │             │
│  │ Service  │  │ (BullMQ) │  │ Service  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          WebSocket Gateway (Socket.io)            │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼──────┐  ┌───────▼──────┐
│  PostgreSQL  │  │    Redis      │  │   AWS S3     │
│  (Prisma)   │  │  (Cache/Queue)│  │  Cloudflare  │
└──────────────┘  └───────────────┘  │     R2       │
                                     └──────────────┘
                           │
              ┌────────────▼────────────┐
              │   AI Providers          │
              │  OpenAI / Claude /      │
              │  Gemini                 │
              └─────────────────────────┘
```

### Request Lifecycle

```
Client Request
  → Nginx (rate limit, SSL termination)
  → NestJS Global Middleware (logging, correlation ID)
  → Guards (JwtAuthGuard → RbacGuard → TenantGuard)
  → Interceptors (Transform, Timeout, Audit)
  → Pipe (ValidationPipe → Zod/class-validator)
  → Controller
  → Service
  → Repository (Prisma)
  → Database
  → Response (TransformInterceptor → standard format)
```

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | NestJS | 10.x | Backend framework |
| Language | TypeScript | 5.x | Type safety |
| ORM | Prisma | 5.x | Database access |
| Database | PostgreSQL | 16.x | Primary database |
| Cache | Redis | 7.x | Caching, sessions |
| Queue | BullMQ | 5.x | Background jobs |
| Auth | JWT + Passport | Latest | Authentication |
| Realtime | Socket.io | 4.x | WebSocket |
| Validation | class-validator | Latest | DTO validation |
| Transform | class-transformer | Latest | Object transform |
| API Docs | Swagger/OpenAPI | Latest | API documentation |
| Email | Nodemailer | Latest | Email sending |
| Storage | AWS S3 / CF R2 | Latest | File storage |
| AI | OpenAI SDK | Latest | AI features |
| PDF | Puppeteer | Latest | PDF generation |
| Excel | ExcelJS | Latest | Excel export |
| Scheduler | @nestjs/schedule | Latest | Cron jobs |
| Testing | Jest | Latest | Unit/integration |
| Logging | Winston | Latest | Structured logging |

---

## 3. Folder Structure

```
apps/backend/
│
├── src/
│   ├── main.ts                        # Bootstrap
│   ├── app.module.ts                  # Root module
│   ├── app.controller.ts              # Health check
│   │
│   ├── config/
│   │   ├── configuration.ts           # Config factory
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   ├── storage.config.ts
│   │   └── ai.config.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── permissions.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   ├── tenant.decorator.ts
│   │   │   └── api-paginated.decorator.ts
│   │   │
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── prisma-exception.filter.ts
│   │   │   └── all-exception.filter.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── rbac.guard.ts
│   │   │   ├── tenant.guard.ts
│   │   │   └── ws-jwt.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── timeout.interceptor.ts
│   │   │   ├── audit.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── cache.interceptor.ts
│   │   │
│   │   ├── pipes/
│   │   │   ├── validation.pipe.ts
│   │   │   ├── parse-uuid.pipe.ts
│   │   │   └── file-validation.pipe.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── correlation-id.middleware.ts
│   │   │   ├── tenant-context.middleware.ts
│   │   │   └── request-logging.middleware.ts
│   │   │
│   │   ├── types/
│   │   │   ├── pagination.types.ts
│   │   │   ├── response.types.ts
│   │   │   ├── request.types.ts
│   │   │   └── common.types.ts
│   │   │
│   │   └── utils/
│   │       ├── pagination.util.ts
│   │       ├── date.util.ts
│   │       ├── string.util.ts
│   │       ├── crypto.util.ts
│   │       ├── file.util.ts
│   │       └── number.util.ts
│   │
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── prisma.service.ts
│   │   └── migrations/
│   │
│   ├── cache/
│   │   ├── cache.module.ts
│   │   └── cache.service.ts
│   │
│   ├── queue/
│   │   ├── queue.module.ts
│   │   ├── queue.service.ts
│   │   └── processors/
│   │       ├── email.processor.ts
│   │       ├── notification.processor.ts
│   │       ├── report.processor.ts
│   │       ├── payroll.processor.ts
│   │       └── ai.processor.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── refresh-token.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       └── reset-password.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   └── dto/
│   │   │
│   │   ├── companies/
│   │   ├── hrms/
│   │   │   ├── hrms.module.ts
│   │   │   ├── employees/
│   │   │   │   ├── employees.controller.ts
│   │   │   │   ├── employees.service.ts
│   │   │   │   ├── employees.repository.ts
│   │   │   │   └── dto/
│   │   │   ├── departments/
│   │   │   ├── attendance/
│   │   │   ├── leave/
│   │   │   ├── payroll/
│   │   │   ├── assets/
│   │   │   └── holidays/
│   │   │
│   │   ├── crm/
│   │   │   ├── crm.module.ts
│   │   │   ├── leads/
│   │   │   ├── contacts/
│   │   │   ├── accounts/
│   │   │   ├── deals/
│   │   │   └── activities/
│   │   │
│   │   ├── inventory/
│   │   ├── procurement/
│   │   ├── finance/
│   │   ├── projects/
│   │   ├── support/
│   │   ├── documents/
│   │   ├── analytics/
│   │   └── settings/
│   │
│   ├── services/
│   │   ├── email/
│   │   │   ├── email.module.ts
│   │   │   ├── email.service.ts
│   │   │   └── templates/
│   │   ├── storage/
│   │   │   ├── storage.module.ts
│   │   │   └── storage.service.ts
│   │   ├── ai/
│   │   │   ├── ai.module.ts
│   │   │   └── ai.service.ts
│   │   ├── notification/
│   │   │   ├── notification.module.ts
│   │   │   └── notification.service.ts
│   │   ├── audit/
│   │   │   ├── audit.module.ts
│   │   │   └── audit.service.ts
│   │   ├── pdf/
│   │   │   ├── pdf.module.ts
│   │   │   └── pdf.service.ts
│   │   └── export/
│   │       ├── export.module.ts
│   │       └── export.service.ts
│   │
│   └── gateways/
│       ├── notification.gateway.ts
│       └── chat.gateway.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## 4. Clean Architecture & DDD

### Layer Architecture

```
Controller (HTTP in/out)
    ↓ DTO (validated, transformed)
Service (business logic)
    ↓ Domain Entities
Repository (data access)
    ↓ Prisma
Database
```

### Module Structure Pattern

Every business module follows this pattern:

```
module/
├── module.module.ts          # NestJS module definition
├── module.controller.ts      # HTTP routes
├── module.service.ts         # Business logic
├── module.repository.ts      # Data access (Prisma queries)
├── module.events.ts          # Domain events (optional)
├── dto/
│   ├── create-entity.dto.ts
│   ├── update-entity.dto.ts
│   ├── filter-entity.dto.ts
│   └── entity-response.dto.ts
└── entities/
    └── entity.entity.ts      # Domain entity class (optional)
```

### Base Classes

```ts
// common/types/pagination.types.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  sortBy?: string

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// common/utils/pagination.util.ts
export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

export function getPaginationArgs(dto: PaginationDto) {
  return {
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
  }
}
```

### Standard API Response

```ts
// common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId: ctx.switchToHttp().getRequest().correlationId,
      }))
    )
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
  requestId: string
}
```

### Exception Filters

```ts
// common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    response.status(status).json({
      success: false,
      statusCode: status,
      error: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).error ?? exception.name,
      message: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId: request['correlationId'],
    })
  }
}

// common/filters/prisma-exception.filter.ts
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const statusMap: Record<string, number> = {
      P2002: 409,  // Unique constraint violation
      P2003: 400,  // Foreign key constraint
      P2025: 404,  // Record not found
    }

    const status = statusMap[exception.code] ?? 500
    const messageMap: Record<string, string> = {
      P2002: `${(exception.meta?.target as string[])?.join(', ')} already exists`,
      P2003: 'Related record not found',
      P2025: 'Record not found',
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error: 'Database Error',
      message: messageMap[exception.code] ?? 'Database error occurred',
    })
  }
}
```

---

## 5. Database Design

### Schema Overview (150+ Tables)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════
// CORE / MULTI-TENANT
// ═══════════════════════════════════════════

model Company {
  id           String     @id @default(uuid())
  name         String
  slug         String     @unique
  email        String     @unique
  phone        String?
  logo         String?
  website      String?
  address      Json?
  settings     Json       @default("{}")
  timezone     String     @default("Asia/Kolkata")
  currency     String     @default("INR")
  language     String     @default("en")
  plan         PlanType   @default(FREE)
  isActive     Boolean    @default(true)
  trialEndsAt  DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  users        User[]
  branches     Branch[]
  departments  Department[]
  employees    Employee[]
  roles        Role[]
  // ... all other relations
}

model Branch {
  id        String   @id @default(uuid())
  companyId String
  name      String
  code      String
  address   Json?
  phone     String?
  isHQ      Boolean  @default(false)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  company   Company  @relation(fields: [companyId], references: [id])
  employees Employee[]
  
  @@unique([companyId, code])
}

model User {
  id             String    @id @default(uuid())
  companyId      String
  employeeId     String?   @unique
  email          String
  passwordHash   String
  firstName      String
  lastName       String
  avatar         String?
  phone          String?
  isActive       Boolean   @default(true)
  isEmailVerified Boolean  @default(false)
  lastLoginAt    DateTime?
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret String?
  roleId         String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  company        Company   @relation(fields: [companyId], references: [id])
  role           Role      @relation(fields: [roleId], references: [id])
  employee       Employee? @relation(fields: [employeeId], references: [id])
  refreshTokens  RefreshToken[]
  notifications  Notification[]
  auditLogs      AuditLog[]
  
  @@unique([companyId, email])
  @@index([companyId])
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// ═══════════════════════════════════════════
// RBAC
// ═══════════════════════════════════════════

model Role {
  id          String       @id @default(uuid())
  companyId   String?      // null = system role
  name        String
  description String?
  isSystem    Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  company     Company?     @relation(fields: [companyId], references: [id])
  users       User[]
  permissions RolePermission[]
}

model Permission {
  id          String           @id @default(uuid())
  module      String
  action      String
  scope       PermissionScope  @default(COMPANY)
  description String?
  
  rolePermissions RolePermission[]
  
  @@unique([module, action, scope])
}

model RolePermission {
  roleId       String
  permissionId String
  
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id])
  
  @@id([roleId, permissionId])
}

// ═══════════════════════════════════════════
// HRMS
// ═══════════════════════════════════════════

model Department {
  id          String      @id @default(uuid())
  companyId   String
  branchId    String?
  parentId    String?     // for nested departments
  name        String
  code        String
  headId      String?
  description String?
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  company     Company     @relation(fields: [companyId], references: [id])
  parent      Department? @relation("DeptTree", fields: [parentId], references: [id])
  children    Department[] @relation("DeptTree")
  employees   Employee[]
  
  @@unique([companyId, code])
}

model Designation {
  id          String     @id @default(uuid())
  companyId   String
  name        String
  level       Int        @default(1)
  description String?
  isActive    Boolean    @default(true)
  
  employees   Employee[]
  
  @@unique([companyId, name])
}

model Employee {
  id               String           @id @default(uuid())
  companyId        String
  branchId         String?
  departmentId     String?
  designationId    String?
  reportingManagerId String?
  employeeCode     String
  firstName        String
  lastName         String
  email            String
  personalEmail    String?
  phone            String
  alternatePhone   String?
  dob              DateTime?
  gender           Gender?
  bloodGroup       String?
  maritalStatus    MaritalStatus?
  avatar           String?
  employmentType   EmploymentType
  status           EmployeeStatus   @default(ACTIVE)
  joiningDate      DateTime
  confirmationDate DateTime?
  exitDate         DateTime?
  exitReason       String?
  address          Json?
  emergencyContact Json?
  bankDetails      Json?
  panNumber        String?
  aadharNumber     String?
  passportNumber   String?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  
  company          Company          @relation(fields: [companyId], references: [id])
  department       Department?      @relation(fields: [departmentId], references: [id])
  designation      Designation?     @relation(fields: [designationId], references: [id])
  manager          Employee?        @relation("ReportingHierarchy", fields: [reportingManagerId], references: [id])
  directReports    Employee[]       @relation("ReportingHierarchy")
  user             User?
  attendance       Attendance[]
  leaveRequests    LeaveRequest[]
  payslips         Payslip[]
  assets           EmployeeAsset[]
  documents        EmployeeDocument[]
  salaryStructure  SalaryStructure?
  
  @@unique([companyId, employeeCode])
  @@unique([companyId, email])
  @@index([companyId])
  @@index([departmentId])
}

model Attendance {
  id           String           @id @default(uuid())
  companyId    String
  employeeId   String
  date         DateTime         @db.Date
  checkIn      DateTime?
  checkOut     DateTime?
  workingHours Float?
  status       AttendanceStatus
  source       AttendanceSource @default(MANUAL)
  overtime     Float?
  notes        String?
  approvedById String?
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  
  employee     Employee         @relation(fields: [employeeId], references: [id])
  
  @@unique([employeeId, date])
  @@index([companyId, date])
}

model LeaveType {
  id              String        @id @default(uuid())
  companyId       String
  name            String
  code            String
  annualAllowance Float
  carryForward    Boolean       @default(false)
  maxCarryForward Float?
  isPaid          Boolean       @default(true)
  requiresApproval Boolean      @default(true)
  description     String?
  isActive        Boolean       @default(true)
  
  leaveRequests   LeaveRequest[]
  leaveBalances   LeaveBalance[]
  
  @@unique([companyId, code])
}

model LeaveBalance {
  id          String    @id @default(uuid())
  companyId   String
  employeeId  String
  leaveTypeId String
  year        Int
  allocated   Float
  taken       Float     @default(0)
  pending     Float     @default(0)
  balance     Float
  updatedAt   DateTime  @updatedAt
  
  employee    Employee  @relation(fields: [employeeId], references: [id])
  leaveType   LeaveType @relation(fields: [leaveTypeId], references: [id])
  
  @@unique([employeeId, leaveTypeId, year])
}

model LeaveRequest {
  id           String        @id @default(uuid())
  companyId    String
  employeeId   String
  leaveTypeId  String
  fromDate     DateTime      @db.Date
  toDate       DateTime      @db.Date
  days         Float
  reason       String
  status       LeaveStatus   @default(PENDING)
  approvedById String?
  rejectedById String?
  comments     String?
  attachments  String[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  employee     Employee      @relation(fields: [employeeId], references: [id])
  leaveType    LeaveType     @relation(fields: [leaveTypeId], references: [id])
  
  @@index([companyId, status])
  @@index([employeeId])
}

model SalaryStructure {
  id             String    @id @default(uuid())
  employeeId     String    @unique
  effectiveFrom  DateTime
  basicSalary    Float
  hra            Float     @default(0)
  ta             Float     @default(0)
  da             Float     @default(0)
  pf             Float     @default(0)
  esi            Float     @default(0)
  otherAllowances Json     @default("[]")
  deductions      Json     @default("[]")
  grossSalary    Float
  netSalary      Float
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  employee       Employee  @relation(fields: [employeeId], references: [id])
}

model Payroll {
  id          String        @id @default(uuid())
  companyId   String
  month       Int
  year        Int
  status      PayrollStatus @default(DRAFT)
  processedAt DateTime?
  processedBy String?
  totalAmount Float?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  payslips    Payslip[]
  
  @@unique([companyId, month, year])
}

model Payslip {
  id           String   @id @default(uuid())
  companyId    String
  payrollId    String
  employeeId   String
  month        Int
  year         Int
  basicSalary  Float
  allowances   Json     @default("{}")
  deductions   Json     @default("{}")
  grossSalary  Float
  netSalary    Float
  paidAt       DateTime?
  status       PayslipStatus @default(DRAFT)
  pdfUrl       String?
  createdAt    DateTime @default(now())
  
  payroll      Payroll  @relation(fields: [payrollId], references: [id])
  employee     Employee @relation(fields: [employeeId], references: [id])
  
  @@unique([employeeId, month, year])
}

model Holiday {
  id          String      @id @default(uuid())
  companyId   String
  branchId    String?
  name        String
  date        DateTime    @db.Date
  type        HolidayType @default(PUBLIC)
  isOptional  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  
  @@unique([companyId, date, name])
}

model Asset {
  id           String        @id @default(uuid())
  companyId    String
  name         String
  code         String
  category     String
  brand        String?
  model        String?
  serialNumber String?
  purchaseDate DateTime?
  purchaseValue Float?
  status       AssetStatus   @default(AVAILABLE)
  location     String?
  description  String?
  images       String[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  assignments  EmployeeAsset[]
  
  @@unique([companyId, code])
}

model EmployeeAsset {
  id           String    @id @default(uuid())
  employeeId   String
  assetId      String
  assignedAt   DateTime  @default(now())
  returnedAt   DateTime?
  condition    String?
  notes        String?
  
  employee     Employee  @relation(fields: [employeeId], references: [id])
  asset        Asset     @relation(fields: [assetId], references: [id])
}

model EmployeeDocument {
  id           String   @id @default(uuid())
  employeeId   String
  type         String   // offer_letter, id_proof, experience_letter, etc.
  name         String
  fileUrl      String
  expiresAt    DateTime?
  uploadedAt   DateTime @default(now())
  
  employee     Employee @relation(fields: [employeeId], references: [id])
}

// ═══════════════════════════════════════════
// CRM
// ═══════════════════════════════════════════

model Lead {
  id           String     @id @default(uuid())
  companyId    String
  title        String
  firstName    String
  lastName     String?
  email        String?
  phone        String?
  company      String?
  jobTitle     String?
  source       LeadSource?
  status       LeadStatus  @default(NEW)
  score        Int         @default(0)
  ownerId      String?
  campaignId   String?
  notes        String?
  tags         String[]
  customFields Json        @default("{}")
  convertedAt  DateTime?
  dealId       String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  
  activities   CRMActivity[]
  
  @@index([companyId, status])
  @@index([ownerId])
}

model Contact {
  id           String     @id @default(uuid())
  companyId    String
  accountId    String?
  firstName    String
  lastName     String
  email        String?
  phone        String?
  mobile       String?
  jobTitle     String?
  department   String?
  isPrimary    Boolean    @default(false)
  avatar       String?
  address      Json?
  socialLinks  Json?
  tags         String[]
  notes        String?
  ownerId      String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  account      Account?   @relation(fields: [accountId], references: [id])
  deals        DealContact[]
  activities   CRMActivity[]
}

model Account {
  id           String     @id @default(uuid())
  companyId    String
  name         String
  website      String?
  industry     String?
  size         String?
  revenue      Float?
  phone        String?
  email        String?
  address      Json?
  tags         String[]
  ownerId      String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  contacts     Contact[]
  deals        Deal[]
  invoices     Invoice[]
}

model Deal {
  id              String     @id @default(uuid())
  companyId       String
  accountId       String?
  title           String
  value           Float
  currency        String     @default("INR")
  stage           DealStage  @default(QUALIFICATION)
  probability     Int        @default(20)
  expectedCloseDate DateTime?
  actualCloseDate DateTime?
  status          DealStatus @default(OPEN)
  ownerId         String?
  leadId          String?
  notes           String?
  tags            String[]
  customFields    Json       @default("{}")
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  account         Account?   @relation(fields: [accountId], references: [id])
  contacts        DealContact[]
  activities      CRMActivity[]
}

model DealContact {
  dealId    String
  contactId String
  role      String?
  
  deal      Deal    @relation(fields: [dealId], references: [id])
  contact   Contact @relation(fields: [contactId], references: [id])
  
  @@id([dealId, contactId])
}

model CRMActivity {
  id          String       @id @default(uuid())
  companyId   String
  type        ActivityType
  subject     String
  description String?
  outcome     String?
  scheduledAt DateTime?
  completedAt DateTime?
  dueAt       DateTime?
  leadId      String?
  contactId   String?
  dealId      String?
  createdById String
  assignedToId String?
  createdAt   DateTime     @default(now())
  
  lead        Lead?        @relation(fields: [leadId], references: [id])
  contact     Contact?     @relation(fields: [contactId], references: [id])
  deal        Deal?        @relation(fields: [dealId], references: [id])
}

// ═══════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════

model ProductCategory {
  id          String            @id @default(uuid())
  companyId   String
  parentId    String?
  name        String
  code        String
  description String?
  image       String?
  isActive    Boolean           @default(true)
  
  parent      ProductCategory?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    ProductCategory[] @relation("CategoryTree")
  products    Product[]
  
  @@unique([companyId, code])
}

model Product {
  id              String          @id @default(uuid())
  companyId       String
  categoryId      String?
  name            String
  description     String?
  sku             String
  barcode         String?
  unit            String          @default("pcs")
  type            ProductType     @default(PHYSICAL)
  costPrice       Float           @default(0)
  sellingPrice    Float           @default(0)
  taxRate         Float           @default(0)
  minStockLevel   Float           @default(0)
  maxStockLevel   Float?
  reorderPoint    Float           @default(0)
  reorderQty      Float           @default(0)
  images          String[]
  tags            String[]
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  category        ProductCategory? @relation(fields: [categoryId], references: [id])
  variants        ProductVariant[]
  stockMovements  StockMovement[]
  stockLevels     StockLevel[]
  purchaseOrderItems PurchaseOrderItem[]
  invoiceItems    InvoiceItem[]
  
  @@unique([companyId, sku])
}

model ProductVariant {
  id          String   @id @default(uuid())
  productId   String
  sku         String
  name        String
  attributes  Json     // { color: "Red", size: "L" }
  costPrice   Float?
  sellingPrice Float?
  isActive    Boolean  @default(true)
  
  product     Product  @relation(fields: [productId], references: [id])
  
  @@unique([productId, sku])
}

model Warehouse {
  id          String       @id @default(uuid())
  companyId   String
  branchId    String?
  name        String
  code        String
  address     Json?
  isActive    Boolean      @default(true)
  
  stockLevels StockLevel[]
  fromTransfers StockTransfer[] @relation("FromWarehouse")
  toTransfers StockTransfer[] @relation("ToWarehouse")
  
  @@unique([companyId, code])
}

model StockLevel {
  id          String    @id @default(uuid())
  companyId   String
  productId   String
  warehouseId String
  quantity    Float     @default(0)
  reservedQty Float     @default(0)
  updatedAt   DateTime  @updatedAt
  
  product     Product   @relation(fields: [productId], references: [id])
  warehouse   Warehouse @relation(fields: [warehouseId], references: [id])
  
  @@unique([productId, warehouseId])
}

model StockMovement {
  id           String          @id @default(uuid())
  companyId    String
  productId    String
  warehouseId  String
  type         MovementType
  quantity     Float
  quantityBefore Float
  quantityAfter  Float
  reason       String?
  reference    String?         // PO number, invoice number, etc.
  createdById  String
  createdAt    DateTime        @default(now())
  
  product      Product         @relation(fields: [productId], references: [id])
}

model StockTransfer {
  id              String          @id @default(uuid())
  companyId       String
  fromWarehouseId String
  toWarehouseId   String
  status          TransferStatus  @default(DRAFT)
  notes           String?
  requestedById   String
  approvedById    String?
  completedAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  fromWarehouse   Warehouse       @relation("FromWarehouse", fields: [fromWarehouseId], references: [id])
  toWarehouse     Warehouse       @relation("ToWarehouse", fields: [toWarehouseId], references: [id])
  items           StockTransferItem[]
}

model StockTransferItem {
  id         String        @id @default(uuid())
  transferId String
  productId  String
  quantity   Float
  
  transfer   StockTransfer @relation(fields: [transferId], references: [id])
}

// ═══════════════════════════════════════════
// PROCUREMENT
// ═══════════════════════════════════════════

model Vendor {
  id           String        @id @default(uuid())
  companyId    String
  name         String
  code         String
  email        String?
  phone        String?
  website      String?
  address      Json?
  taxNumber    String?
  paymentTerms Int           @default(30)
  currency     String        @default("INR")
  rating       Float?
  isActive     Boolean       @default(true)
  tags         String[]
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  rfqs         RFQ[]
  purchaseOrders PurchaseOrder[]
  
  @@unique([companyId, code])
}

model RFQ {
  id          String     @id @default(uuid())
  companyId   String
  rfqNumber   String
  title       String
  description String?
  status      RFQStatus  @default(DRAFT)
  deadline    DateTime?
  createdById String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  items       RFQItem[]
  quotes      VendorQuote[]
  
  @@unique([companyId, rfqNumber])
}

model RFQItem {
  id          String  @id @default(uuid())
  rfqId       String
  productId   String?
  description String
  quantity    Float
  unit        String
  
  rfq         RFQ     @relation(fields: [rfqId], references: [id])
}

model VendorQuote {
  id          String      @id @default(uuid())
  rfqId       String
  vendorId    String
  status      QuoteStatus @default(PENDING)
  validUntil  DateTime?
  terms       String?
  totalAmount Float?
  notes       String?
  submittedAt DateTime?
  createdAt   DateTime    @default(now())
  
  rfq         RFQ         @relation(fields: [rfqId], references: [id])
  vendor      Vendor      @relation(fields: [vendorId], references: [id])
  items       VendorQuoteItem[]
}

model VendorQuoteItem {
  id          String      @id @default(uuid())
  quoteId     String
  rfqItemId   String
  unitPrice   Float
  quantity    Float
  taxRate     Float       @default(0)
  totalAmount Float
  leadTime    Int?
  notes       String?
  
  quote       VendorQuote @relation(fields: [quoteId], references: [id])
}

model PurchaseOrder {
  id           String         @id @default(uuid())
  companyId    String
  poNumber     String
  vendorId     String
  status       POStatus       @default(DRAFT)
  orderDate    DateTime       @default(now())
  expectedDate DateTime?
  deliveryAddress Json?
  subtotal     Float
  taxAmount    Float          @default(0)
  discount     Float          @default(0)
  totalAmount  Float
  notes        String?
  approvedById String?
  approvedAt   DateTime?
  createdById  String
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  
  vendor       Vendor         @relation(fields: [vendorId], references: [id])
  items        PurchaseOrderItem[]
  receipts     GoodsReceipt[]
  
  @@unique([companyId, poNumber])
}

model PurchaseOrderItem {
  id          String        @id @default(uuid())
  poId        String
  productId   String?
  description String
  quantity    Float
  receivedQty Float         @default(0)
  unitPrice   Float
  taxRate     Float         @default(0)
  totalAmount Float
  
  po          PurchaseOrder @relation(fields: [poId], references: [id])
  product     Product?      @relation(fields: [productId], references: [id])
}

model GoodsReceipt {
  id          String        @id @default(uuid())
  companyId   String
  grNumber    String
  poId        String
  warehouseId String
  receivedAt  DateTime      @default(now())
  receivedById String
  notes       String?
  
  po          PurchaseOrder @relation(fields: [poId], references: [id])
  items       GoodsReceiptItem[]
  
  @@unique([companyId, grNumber])
}

model GoodsReceiptItem {
  id          String       @id @default(uuid())
  grId        String
  poItemId    String
  quantity    Float
  
  gr          GoodsReceipt @relation(fields: [grId], references: [id])
}

// ═══════════════════════════════════════════
// FINANCE
// ═══════════════════════════════════════════

model Invoice {
  id            String        @id @default(uuid())
  companyId     String
  invoiceNumber String
  type          InvoiceType   @default(SALES)
  accountId     String?
  status        InvoiceStatus @default(DRAFT)
  issueDate     DateTime      @default(now())
  dueDate       DateTime
  subtotal      Float
  taxAmount     Float         @default(0)
  discount      Float         @default(0)
  totalAmount   Float
  paidAmount    Float         @default(0)
  balanceDue    Float
  currency      String        @default("INR")
  notes         String?
  termsAndConditions String?
  sentAt        DateTime?
  paidAt        DateTime?
  cancelledAt   DateTime?
  createdById   String
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  account       Account?      @relation(fields: [accountId], references: [id])
  items         InvoiceItem[]
  payments      Payment[]
  
  @@unique([companyId, invoiceNumber])
}

model InvoiceItem {
  id          String   @id @default(uuid())
  invoiceId   String
  productId   String?
  description String
  quantity    Float
  unitPrice   Float
  taxRate     Float    @default(0)
  discount    Float    @default(0)
  totalAmount Float
  
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  product     Product? @relation(fields: [productId], references: [id])
}

model Payment {
  id            String        @id @default(uuid())
  companyId     String
  invoiceId     String?
  amount        Float
  currency      String        @default("INR")
  method        PaymentMethod
  reference     String?
  notes         String?
  paidAt        DateTime      @default(now())
  createdById   String
  createdAt     DateTime      @default(now())
  
  invoice       Invoice?      @relation(fields: [invoiceId], references: [id])
}

model Expense {
  id           String         @id @default(uuid())
  companyId    String
  employeeId   String?
  category     String
  title        String
  amount       Float
  currency     String         @default("INR")
  date         DateTime       @db.Date
  receipt      String?
  notes        String?
  status       ExpenseStatus  @default(PENDING)
  approvedById String?
  approvedAt   DateTime?
  rejectedAt   DateTime?
  paidAt       DateTime?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model Budget {
  id          String    @id @default(uuid())
  companyId   String
  name        String
  year        Int
  month       Int?      // null = annual budget
  department  String?
  category    String?
  amount      Float
  spent       Float     @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ═══════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════

model Project {
  id          String        @id @default(uuid())
  companyId   String
  name        String
  code        String
  description String?
  status      ProjectStatus @default(PLANNING)
  priority    Priority      @default(MEDIUM)
  startDate   DateTime?
  endDate     DateTime?
  budget      Float?
  ownerId     String
  clientId    String?
  tags        String[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  members     ProjectMember[]
  tasks       Task[]
  milestones  Milestone[]
  timesheets  Timesheet[]
  documents   ProjectDocument[]
  
  @@unique([companyId, code])
}

model ProjectMember {
  id        String  @id @default(uuid())
  projectId String
  userId    String
  role      String  @default("MEMBER")
  joinedAt  DateTime @default(now())
  
  project   Project @relation(fields: [projectId], references: [id])
  
  @@unique([projectId, userId])
}

model Milestone {
  id          String          @id @default(uuid())
  projectId   String
  name        String
  description String?
  status      MilestoneStatus @default(PENDING)
  dueDate     DateTime
  completedAt DateTime?
  
  project     Project         @relation(fields: [projectId], references: [id])
  tasks       Task[]
}

model Task {
  id           String     @id @default(uuid())
  companyId    String
  projectId    String
  milestoneId  String?
  parentTaskId String?
  title        String
  description  String?
  status       TaskStatus @default(TODO)
  priority     Priority   @default(MEDIUM)
  assigneeId   String?
  reporterId   String
  dueDate      DateTime?
  estimatedHours Float?
  loggedHours  Float      @default(0)
  tags         String[]
  attachments  String[]
  position     Int        @default(0)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  project      Project    @relation(fields: [projectId], references: [id])
  milestone    Milestone? @relation(fields: [milestoneId], references: [id])
  parent       Task?      @relation("SubTasks", fields: [parentTaskId], references: [id])
  subTasks     Task[]     @relation("SubTasks")
  comments     TaskComment[]
  timesheets   Timesheet[]
}

model TaskComment {
  id        String   @id @default(uuid())
  taskId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  task      Task     @relation(fields: [taskId], references: [id])
}

model Timesheet {
  id          String   @id @default(uuid())
  companyId   String
  projectId   String
  taskId      String?
  userId      String
  date        DateTime @db.Date
  hours       Float
  description String?
  isBillable  Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  project     Project  @relation(fields: [projectId], references: [id])
  task        Task?    @relation(fields: [taskId], references: [id])
}

model ProjectDocument {
  id        String   @id @default(uuid())
  projectId String
  name      String
  fileUrl   String
  uploadedById String
  uploadedAt DateTime @default(now())
  
  project   Project  @relation(fields: [projectId], references: [id])
}

// ═══════════════════════════════════════════
// SUPPORT
// ═══════════════════════════════════════════

model TicketCategory {
  id          String   @id @default(uuid())
  companyId   String
  name        String
  description String?
  color       String?
  slaHours    Int?
  isActive    Boolean  @default(true)
  
  tickets     Ticket[]
}

model Ticket {
  id           String         @id @default(uuid())
  companyId    String
  ticketNumber String
  title        String
  description  String
  status       TicketStatus   @default(OPEN)
  priority     Priority       @default(MEDIUM)
  categoryId   String?
  reporterId   String
  assigneeId   String?
  tags         String[]
  attachments  String[]
  slaDeadline  DateTime?
  firstResponseAt DateTime?
  resolvedAt   DateTime?
  closedAt     DateTime?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  
  category     TicketCategory? @relation(fields: [categoryId], references: [id])
  replies      TicketReply[]
  activities   TicketActivity[]
  
  @@unique([companyId, ticketNumber])
}

model TicketReply {
  id          String   @id @default(uuid())
  ticketId    String
  userId      String
  content     String
  isInternal  Boolean  @default(false)
  attachments String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  ticket      Ticket   @relation(fields: [ticketId], references: [id])
}

model TicketActivity {
  id          String   @id @default(uuid())
  ticketId    String
  userId      String
  action      String   // assigned, status_changed, priority_changed, etc.
  from        String?
  to          String?
  createdAt   DateTime @default(now())
  
  ticket      Ticket   @relation(fields: [ticketId], references: [id])
}

// ═══════════════════════════════════════════
// DOCUMENTS
// ═══════════════════════════════════════════

model DocumentFolder {
  id          String          @id @default(uuid())
  companyId   String
  parentId    String?
  name        String
  description String?
  createdById String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  parent      DocumentFolder? @relation("FolderTree", fields: [parentId], references: [id])
  children    DocumentFolder[] @relation("FolderTree")
  documents   Document[]
}

model Document {
  id           String           @id @default(uuid())
  companyId    String
  folderId     String?
  name         String
  description  String?
  fileUrl      String
  fileSize     Int
  mimeType     String
  extension    String
  tags         String[]
  isShared     Boolean          @default(false)
  shareToken   String?          @unique
  version      Int              @default(1)
  uploadedById String
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  
  folder       DocumentFolder?  @relation(fields: [folderId], references: [id])
  versions     DocumentVersion[]
  sharedWith   DocumentShare[]
}

model DocumentVersion {
  id         String   @id @default(uuid())
  documentId String
  version    Int
  fileUrl    String
  fileSize   Int
  createdById String
  createdAt  DateTime @default(now())
  
  document   Document @relation(fields: [documentId], references: [id])
}

model DocumentShare {
  id         String    @id @default(uuid())
  documentId String
  userId     String
  access     String    @default("VIEW")
  sharedById String
  sharedAt   DateTime  @default(now())
  
  document   Document  @relation(fields: [documentId], references: [id])
}

// ═══════════════════════════════════════════
// NOTIFICATIONS & AUDIT
// ═══════════════════════════════════════════

model Notification {
  id          String             @id @default(uuid())
  companyId   String
  userId      String
  type        String
  title       String
  message     String
  link        String?
  isRead      Boolean            @default(false)
  readAt      DateTime?
  metadata    Json               @default("{}")
  createdAt   DateTime           @default(now())
  
  user        User               @relation(fields: [userId], references: [id])
  
  @@index([userId, isRead])
  @@index([companyId])
}

model AuditLog {
  id           String   @id @default(uuid())
  companyId    String
  userId       String
  action       String   // CREATE, UPDATE, DELETE, LOGIN, EXPORT, etc.
  module       String
  entityType   String?
  entityId     String?
  oldValues    Json?
  newValues    Json?
  ipAddress    String?
  userAgent    String?
  metadata     Json     @default("{}")
  createdAt    DateTime @default(now())
  
  user         User     @relation(fields: [userId], references: [id])
  
  @@index([companyId, module])
  @@index([entityType, entityId])
  @@index([userId])
}

// ═══════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════

enum PlanType { FREE STARTER PROFESSIONAL ENTERPRISE }
enum PermissionScope { OWN DEPARTMENT COMPANY }
enum Gender { MALE FEMALE OTHER }
enum MaritalStatus { SINGLE MARRIED DIVORCED WIDOWED }
enum EmploymentType { FULL_TIME PART_TIME CONTRACT INTERN }
enum EmployeeStatus { ACTIVE INACTIVE ON_NOTICE TERMINATED }
enum AttendanceStatus { PRESENT ABSENT LATE HALF_DAY ON_LEAVE HOLIDAY WEEKEND }
enum AttendanceSource { MANUAL BIOMETRIC APP }
enum LeaveStatus { PENDING APPROVED REJECTED CANCELLED }
enum HolidayType { PUBLIC RESTRICTED OPTIONAL }
enum AssetStatus { AVAILABLE ASSIGNED MAINTENANCE DISPOSED }
enum PayrollStatus { DRAFT PROCESSING PROCESSED PAID }
enum PayslipStatus { DRAFT GENERATED SENT PAID }
enum LeadSource { WEBSITE REFERRAL SOCIAL_MEDIA EMAIL COLD_CALL EVENT OTHER }
enum LeadStatus { NEW CONTACTED QUALIFIED UNQUALIFIED CONVERTED }
enum DealStage { QUALIFICATION DEMO PROPOSAL NEGOTIATION WON LOST }
enum DealStatus { OPEN WON LOST }
enum ActivityType { CALL EMAIL MEETING TASK NOTE }
enum ProductType { PHYSICAL DIGITAL SERVICE }
enum MovementType { PURCHASE_IN SALE_OUT TRANSFER_IN TRANSFER_OUT ADJUSTMENT RETURN }
enum TransferStatus { DRAFT APPROVED IN_TRANSIT RECEIVED CANCELLED }
enum RFQStatus { DRAFT SENT QUOTES_RECEIVED CLOSED }
enum QuoteStatus { PENDING SUBMITTED ACCEPTED REJECTED }
enum POStatus { DRAFT PENDING_APPROVAL APPROVED SENT PARTIALLY_RECEIVED RECEIVED CANCELLED }
enum InvoiceType { SALES PURCHASE CREDIT_NOTE }
enum InvoiceStatus { DRAFT SENT PARTIALLY_PAID PAID OVERDUE CANCELLED }
enum PaymentMethod { CASH BANK_TRANSFER CHEQUE CARD UPI ONLINE }
enum ExpenseStatus { PENDING APPROVED REJECTED PAID }
enum ProjectStatus { PLANNING ACTIVE ON_HOLD COMPLETED CANCELLED }
enum Priority { LOW MEDIUM HIGH CRITICAL }
enum MilestoneStatus { PENDING IN_PROGRESS COMPLETED }
enum TaskStatus { TODO IN_PROGRESS REVIEW DONE CANCELLED }
enum TicketStatus { OPEN ASSIGNED IN_PROGRESS PENDING RESOLVED CLOSED }
```

---

## 6. Authentication & Authorization

### main.ts Bootstrap

```ts
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )

  // Global filters
  app.useGlobalFilters(
    new AllExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  )

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
  )

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('AI Business OS API')
      .setDescription('Enterprise SaaS API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(process.env.PORT ?? 3001)
  console.log(`Application running on: ${await app.getUrl()}`)
}
```

### JWT Strategy

```ts
// modules/auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive')
    }

    return {
      id: user.id,
      companyId: user.companyId,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions.map(rp => ({
        module: rp.permission.module,
        action: rp.permission.action,
        scope: rp.permission.scope,
      })),
    }
  }
}
```

### Auth Service

```ts
// modules/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  async login(dto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true }
    })

    if (!user || !await bcrypt.compare(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password')
    }

    if (!user.isActive) throw new ForbiddenException('Account is inactive')
    if (!user.company.isActive) throw new ForbiddenException('Company account is suspended')

    const tokens = await this.generateTokens(user.id, user.companyId)
    await this.saveRefreshToken(user.id, tokens.refreshToken, ipAddress, userAgent)
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    return { ...tokens, user: this.sanitizeUser(user) }
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email }
    })
    if (existing) throw new ConflictException('Email already registered')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    
    // Create company + owner user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          slug: generateSlug(dto.companyName),
          email: dto.email,
        }
      })
      
      const adminRole = await tx.role.create({
        data: {
          companyId: company.id,
          name: 'Admin',
          isSystem: true,
        }
      })
      
      const user = await tx.user.create({
        data: {
          companyId: company.id,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          roleId: adminRole.id,
        }
      })
      
      return { company, user }
    })
    
    await this.emailService.sendWelcomeEmail(result.user)
    return { message: 'Registration successful' }
  }

  async refreshToken(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true }
    })

    const tokens = await this.generateTokens(stored.userId, stored.user.companyId)
    await this.saveRefreshToken(stored.userId, tokens.refreshToken)
    return tokens
  }

  private async generateTokens(userId: string, companyId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, companyId },
        { expiresIn: '15m', secret: process.env.JWT_SECRET }
      ),
      this.jwtService.signAsync(
        { sub: userId, companyId },
        { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }
      ),
    ])
    return { accessToken, refreshToken }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } })
    if (!user) return { message: 'If email exists, OTP has been sent' }
    
    const otp = generateOTP(6)
    await this.cacheService.set(`otp:${email}`, otp, 600) // 10 min
    await this.emailService.sendPasswordResetOTP(user, otp)
    return { message: 'If email exists, OTP has been sent' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otp = await this.cacheService.get(`otp:${dto.email}`)
    if (otp !== dto.otp) throw new BadRequestException('Invalid or expired OTP')
    
    const passwordHash = await bcrypt.hash(dto.newPassword, 12)
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { passwordHash }
    })
    
    await this.cacheService.del(`otp:${dto.email}`)
    
    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { user: { email: dto.email } },
      data: { isRevoked: true }
    })
    
    return { message: 'Password reset successful' }
  }
}
```

---

## 7. RBAC System

### RBAC Guard

```ts
// common/guards/rbac.guard.ts
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    )
    
    if (!required || required.length === 0) return true
    
    const { user } = context.switchToHttp().getRequest()
    if (!user) return false
    
    // Super admin bypasses all checks
    if (user.roleName === 'SUPER_ADMIN') return true
    
    return required.some(({ module, action }) =>
      user.permissions.some(
        (p: any) => p.module === module && p.action === action
      )
    )
  }
}

// Decorator
export const RequirePermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

// Usage in controller:
@Get()
@RequirePermissions({ module: 'hrms', action: 'read' })
async getEmployees() { ... }
```

---

## 8. Email Service

```ts
// services/email/email.service.ts
@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    })
  }

  async sendWelcomeEmail(user: User) {
    await this.send({
      to: user.email,
      subject: 'Welcome to AI Business OS',
      template: 'welcome',
      context: { name: user.firstName, loginUrl: `${process.env.FRONTEND_URL}/login` },
    })
  }

  async sendPasswordResetOTP(user: User, otp: string) {
    await this.send({
      to: user.email,
      subject: 'Password Reset OTP',
      template: 'password-reset',
      context: { name: user.firstName, otp, expiresIn: '10 minutes' },
    })
  }

  async sendLeaveRequestApproval(employee: Employee, request: LeaveRequest) {
    await this.send({
      to: employee.email,
      subject: 'Leave Request Approved',
      template: 'leave-approved',
      context: { name: employee.firstName, request },
    })
  }

  async sendInvoice(client: { email: string; name: string }, invoiceUrl: string) {
    await this.send({
      to: client.email,
      subject: 'Invoice from AI Business OS',
      template: 'invoice',
      context: { clientName: client.name, invoiceUrl },
      attachments: [{ path: invoiceUrl }],
    })
  }

  private async send({ to, subject, template, context, attachments = [] }: SendEmailOptions) {
    const html = await this.renderTemplate(template, context)
    await this.transporter.sendMail({
      from: `"AI Business OS" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
      attachments,
    })
  }
}
```

---

## 9. File Upload Service

```ts
// services/storage/storage.service.ts
@Injectable()
export class StorageService {
  private s3: S3Client

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      region: config.get('AWS_REGION'),
      endpoint: config.get('CLOUDFLARE_R2_ENDPOINT'), // or AWS S3
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY'),
        secretAccessKey: config.get('AWS_SECRET_KEY'),
      },
    })
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const ext = path.extname(file.originalname)
    const key = `${folder}/${uuid()}${ext}`
    
    await this.s3.send(new PutObjectCommand({
      Bucket: this.config.get('STORAGE_BUCKET'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    }))
    
    return {
      key,
      url: `${this.config.get('STORAGE_PUBLIC_URL')}/${key}`,
      size: file.size,
      mimeType: file.mimetype,
      originalName: file.originalname,
    }
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({
      Bucket: this.config.get('STORAGE_BUCKET'),
      Key: key,
    }))
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.config.get('STORAGE_BUCKET'), Key: key }),
      { expiresIn }
    )
  }
}

// File upload controller helper
// Max file size: 50MB for documents, 5MB for avatars
// Allowed types: configured per endpoint
@UseInterceptors(FileInterceptor('file', {
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats...']
    cb(null, allowed.includes(file.mimetype))
  }
}))
```

---

## 10. Notification Service

```ts
// services/notification/notification.service.ts
@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
    private readonly emailService: EmailService,
    private readonly queueService: QueueService,
  ) {}

  async send(data: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({ data })
    
    // Push via WebSocket (real-time)
    this.notificationGateway.sendToUser(data.userId, 'notification', notification)
    
    // Queue email notification if needed
    if (data.sendEmail) {
      await this.queueService.addToQueue('notifications', {
        type: 'email',
        notificationId: notification.id,
      })
    }
    
    return notification
  }

  async sendBulk(userIds: string[], data: Omit<CreateNotificationDto, 'userId'>) {
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map(userId => ({ ...data, userId }))
    })
    
    userIds.forEach(userId => {
      this.notificationGateway.sendToUser(userId, 'notification', data)
    })
    
    return notifications
  }

  async sendToRole(companyId: string, roleName: string, data: Omit<CreateNotificationDto, 'userId' | 'companyId'>) {
    const users = await this.prisma.user.findMany({
      where: { companyId, role: { name: roleName }, isActive: true },
      select: { id: true }
    })
    return this.sendBulk(users.map(u => u.id), { ...data, companyId })
  }
}
```

---

## 11. WebSocket Gateway

```ts
// gateways/notification.gateway.ts
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/notifications',
})
@UseGuards(WsJwtGuard)
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userSockets = new Map<string, Set<string>>() // userId → socketIds

  async handleConnection(client: Socket) {
    try {
      const user = await this.verifyToken(client.handshake.auth.token)
      client.data.userId = user.id
      client.join(`user:${user.id}`)
      
      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set())
      }
      this.userSockets.get(user.id)!.add(client.id)
      
      client.emit('connected', { userId: user.id })
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id)
    }
  }

  sendToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data)
  }

  sendToCompany(companyId: string, event: string, data: unknown) {
    this.server.to(`company:${companyId}`).emit(event, data)
  }
}
```

---

## 12. Queue System — BullMQ

### Queue Module

```ts
// queue/queue.module.ts
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'notifications' },
      { name: 'reports' },
      { name: 'payroll' },
      { name: 'ai' },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
```

### Queue Processors

```ts
// queue/processors/email.processor.ts
@Processor('email')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send')
  async handleSend(job: Job<EmailJobData>) {
    const { to, subject, template, context } = job.data
    await this.emailService.send({ to, subject, template, context })
  }
}

// queue/processors/payroll.processor.ts
@Processor('payroll')
export class PayrollProcessor {
  @Process('run')
  async handlePayrollRun(job: Job<{ payrollId: string }>) {
    const { payrollId } = job.data
    // 1. Get all active employees
    // 2. Calculate salary (basic + allowances - deductions - taxes)
    // 3. Create payslips
    // 4. Update payroll status → PROCESSED
    // 5. Send payslip emails
    // 6. Notify HR
    await job.updateProgress(100)
  }
}

// queue/processors/report.processor.ts
@Processor('reports')
export class ReportProcessor {
  @Process('generate')
  async handleReportGeneration(job: Job<ReportJobData>) {
    // Generate Excel/PDF → Upload to S3 → Send email with link
  }
}

// queue/processors/ai.processor.ts
@Processor('ai')
export class AIProcessor {
  @Process('generate-insights')
  async handleInsights(job: Job<AIJobData>) {
    // Call AI service → Store results in cache
  }
}
```

### Queue Service

```ts
// queue/queue.service.ts
@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('notifications') private notifQueue: Queue,
    @InjectQueue('reports') private reportsQueue: Queue,
    @InjectQueue('payroll') private payrollQueue: Queue,
    @InjectQueue('ai') private aiQueue: Queue,
  ) {}

  async addEmailJob(data: EmailJobData, opts?: JobsOptions) {
    return this.emailQueue.add('send', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      ...opts,
    })
  }

  async addPayrollJob(payrollId: string) {
    return this.payrollQueue.add('run', { payrollId }, {
      attempts: 1,
      timeout: 5 * 60 * 1000, // 5 min
    })
  }
  
  async scheduleReport(data: ReportJobData, delay: number) {
    return this.reportsQueue.add('generate', data, { delay })
  }
}
```

---

## 13. AI Service

```ts
// services/ai/ai.service.ts
@Injectable()
export class AIService {
  private openai: OpenAI
  private anthropic: Anthropic

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') })
    this.anthropic = new Anthropic({ apiKey: config.get('ANTHROPIC_API_KEY') })
  }

  // General chat completion
  async chat(messages: Message[], context?: string, streaming = false) {
    const systemPrompt = `You are an AI assistant for AI Business OS, an enterprise SaaS platform.
    ${context ? `Current context: ${context}` : ''}
    Be concise, professional, and data-driven.`

    if (streaming) {
      return this.anthropic.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      })
    }

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    return response.content[0].type === 'text' ? response.content[0].text : ''
  }

  // Generate dashboard insights
  async generateInsights(data: Record<string, unknown>, module: string): Promise<string[]> {
    const prompt = `Analyze this ${module} data and provide 3-5 key business insights:
    ${JSON.stringify(data, null, 2)}
    
    Return JSON array of insight strings. Each insight should be actionable.`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content ?? '{}')
    return result.insights ?? []
  }

  // Summarize entity (ticket, employee, deal)
  async summarize(entityType: string, data: Record<string, unknown>): Promise<string> {
    const prompt = `Summarize this ${entityType} in 2-3 sentences for a business user:
    ${JSON.stringify(data, null, 2)}`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    })

    return response.choices[0].message.content ?? ''
  }

  // OCR + data extraction (receipts, invoices)
  async extractDocumentData(imageBase64: string, documentType: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
          },
          {
            type: 'text',
            text: `Extract all data from this ${documentType}. Return as JSON with relevant fields.`
          }
        ]
      }],
      response_format: { type: 'json_object' },
    })

    return JSON.parse(response.choices[0].message.content ?? '{}')
  }

  // Parse resume
  async parseResume(pdfBase64: string) {
    // Extract: name, email, phone, skills, experience, education
    return this.extractDocumentData(pdfBase64, 'resume/CV')
  }

  // Generate email
  async generateEmail(context: {
    type: string
    recipient: string
    subject: string
    keyPoints: string[]
    tone: 'professional' | 'friendly' | 'formal'
  }): Promise<string> {
    const prompt = `Write a ${context.tone} email for:
    Type: ${context.type}
    Recipient: ${context.recipient}
    Subject: ${context.subject}
    Key points: ${context.keyPoints.join(', ')}
    
    Write only the email body, no subject line.`

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    return response.content[0].type === 'text' ? response.content[0].text : ''
  }

  // Forecast (inventory demand, revenue)
  async forecast(historicalData: number[], periods: number, label: string): Promise<number[]> {
    const prompt = `Given this ${label} historical data: [${historicalData.join(', ')}]
    Forecast the next ${periods} periods.
    Return JSON: { "forecast": [number, ...] }`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content ?? '{}')
    return result.forecast ?? []
  }
}
```

---

## 14. Audit Log System

```ts
// services/audit/audit.service.ts
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: CreateAuditLogDto) {
    return this.prisma.auditLog.create({ data })
  }

  async getEntityHistory(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
  }
}

// Audit interceptor — auto-logs mutations
// common/interceptors/audit.interceptor.ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest()
    const { method, url, user, body } = req

    const actionMap: Record<string, string> = {
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    }

    const action = actionMap[method]
    if (!action || !user) return next.handle()

    return next.handle().pipe(
      tap((responseData) => {
        this.auditService.log({
          companyId: user.companyId,
          userId: user.id,
          action,
          module: extractModule(url),
          entityId: responseData?.id ?? req.params?.id,
          newValues: method !== 'DELETE' ? body : undefined,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        }).catch(console.error)
      })
    )
  }
}
```

---

## 15. Search Service

```ts
// services/search/search.service.ts
@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  // Global search across all modules
  async globalSearch(query: string, companyId: string, limit = 10) {
    const searchTerm = { contains: query, mode: 'insensitive' as const }

    const [employees, leads, contacts, deals, tickets, products, projects] = await Promise.all([
      this.prisma.employee.findMany({
        where: {
          companyId,
          OR: [
            { firstName: searchTerm },
            { lastName: searchTerm },
            { email: searchTerm },
            { employeeCode: searchTerm },
          ],
        },
        select: { id: true, firstName: true, lastName: true, employeeCode: true },
        take: limit,
      }),
      this.prisma.lead.findMany({
        where: {
          companyId,
          OR: [{ firstName: searchTerm }, { email: searchTerm }, { company: searchTerm }],
        },
        select: { id: true, firstName: true, lastName: true, company: true },
        take: limit,
      }),
      // ... contacts, deals, tickets, products, projects
    ])

    return {
      employees: employees.map(e => ({
        id: e.id,
        title: `${e.firstName} ${e.lastName}`,
        subtitle: e.employeeCode,
        type: 'employee',
        url: `/hrms/employees/${e.id}`,
      })),
      leads: leads.map(l => ({
        id: l.id,
        title: `${l.firstName} ${l.lastName ?? ''}`,
        subtitle: l.company ?? '',
        type: 'lead',
        url: `/crm/leads/${l.id}`,
      })),
      // ...
    }
  }
}
```

---

## 16. Logging & Monitoring

### Winston Logger

```ts
// config/logger.ts
export const winstonConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context, trace }) =>
          `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`
        )
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
})
```

### Request Logging Middleware

```ts
// common/middleware/request-logging.middleware.ts
@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP')

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()
    const { method, url } = req

    res.on('finish', () => {
      const duration = Date.now() - start
      const { statusCode } = res
      
      this.logger.log(
        `${method} ${url} ${statusCode} ${duration}ms [${req['correlationId']}]`
      )
    })
    
    next()
  }
}
```

### Health Check

```ts
// app.controller.ts
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get('health')
  @Public()
  async health() {
    const [dbOk, cacheOk] = await Promise.allSettled([
      this.prisma.$queryRaw`SELECT 1`,
      this.redis.ping(),
    ])

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbOk.status === 'fulfilled' ? 'ok' : 'error',
        cache: cacheOk.status === 'fulfilled' ? 'ok' : 'error',
      },
    }
  }
}
```

---

## 17. Module Documentation

---

## 17.1 Auth Module

### Controller

```ts
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Post('login')
  @Public()
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req.ip, req.headers['user-agent'] ?? '')
  }

  @Post('register')
  @Public()
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken)
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken)
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email)
  }

  @Post('reset-password')
  @Public()
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  @Get('me')
  async getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.id)
  }
  
  @Post('change-password')
  @HttpCode(200)
  async changePassword(@CurrentUser() user: AuthUser, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto)
  }
}
```

### DTOs

```ts
// dto/login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string
}

// dto/register.dto.ts
export class RegisterDto {
  @IsString() @MinLength(2) firstName: string
  @IsString() @MinLength(2) lastName: string
  @IsString() @MinLength(2) companyName: string
  @IsEmail() email: string
  @IsString() @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number'
  })
  password: string
}

// dto/reset-password.dto.ts
export class ResetPasswordDto {
  @IsEmail() email: string
  @IsString() @Length(6, 6) otp: string
  @IsString() @MinLength(8) newPassword: string
}
```

### API Examples

```yaml
# POST /api/v1/auth/login
Request:
  { "email": "admin@company.com", "password": "Password123" }

Response 200:
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci...",
      "user": {
        "id": "uuid",
        "email": "admin@company.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": { "name": "Admin" }
      }
    }
  }

Response 401:
  {
    "success": false,
    "statusCode": 401,
    "message": "Invalid email or password"
  }
```

---

## 17.2 Users Module

### APIs

```
GET    /users                    → List users (paginated)
POST   /users/invite             → Invite user by email
GET    /users/:id                → Get user detail
PATCH  /users/:id                → Update user
DELETE /users/:id                → Deactivate user
PATCH  /users/:id/role           → Change role
POST   /users/:id/reset-password → Admin reset password
GET    /users/me                 → Current user profile
PATCH  /users/me                 → Update own profile
POST   /users/me/avatar          → Upload avatar
```

---

## 17.3 Company Module

### APIs

```
GET    /company                  → Get company details
PATCH  /company                  → Update company info
POST   /company/logo             → Upload logo
GET    /company/settings         → Get settings
PATCH  /company/settings         → Update settings
GET    /company/branches         → List branches
POST   /company/branches         → Create branch
PATCH  /company/branches/:id     → Update branch
DELETE /company/branches/:id     → Delete branch
```

---

## 17.4 HRMS Module

### Employees Service

```ts
// modules/hrms/employees/employees.service.ts
@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(companyId: string, dto: EmployeeListDto): Promise<PaginatedResponse<Employee>> {
    const { page, limit, search, status, departmentId, sortBy, sortOrder } = dto
    
    const where = {
      companyId,
      ...(status && { status }),
      ...(departmentId && { departmentId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeCode: { contains: search, mode: 'insensitive' } },
        ]
      }),
    }
    
    const [data, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        include: {
          department: { select: { name: true } },
          designation: { select: { name: true } },
          _count: { select: { leaveRequests: true } },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ])
    
    return paginate(data, total, page, limit)
  }

  async create(companyId: string, dto: CreateEmployeeDto, createdById: string): Promise<Employee> {
    const employeeCode = dto.employeeCode ?? await this.generateEmployeeCode(companyId)
    
    const employee = await this.prisma.employee.create({
      data: { ...dto, companyId, employeeCode },
      include: { department: true, designation: true },
    })
    
    // Initialize leave balances
    await this.initializeLeaveBalances(employee.id, companyId)
    
    // Notify HR
    await this.notificationService.sendToRole(companyId, 'HR', {
      type: 'employee_onboarded',
      title: 'New Employee Added',
      message: `${employee.firstName} ${employee.lastName} has been added to the system`,
      link: `/hrms/employees/${employee.id}`,
    })
    
    await this.auditService.log({
      companyId, userId: createdById,
      action: 'CREATE', module: 'hrms',
      entityType: 'employee', entityId: employee.id,
      newValues: dto,
    })
    
    return employee
  }

  private async generateEmployeeCode(companyId: string): Promise<string> {
    const count = await this.prisma.employee.count({ where: { companyId } })
    return `EMP${String(count + 1).padStart(5, '0')}`
  }

  private async initializeLeaveBalances(employeeId: string, companyId: string) {
    const leaveTypes = await this.prisma.leaveType.findMany({ where: { companyId, isActive: true } })
    const year = new Date().getFullYear()
    
    await this.prisma.leaveBalance.createMany({
      data: leaveTypes.map(lt => ({
        companyId, employeeId,
        leaveTypeId: lt.id, year,
        allocated: lt.annualAllowance,
        balance: lt.annualAllowance,
      }))
    })
  }
}
```

### HRMS APIs Reference

```yaml
# EMPLOYEES
GET    /hrms/employees
  Query: page, limit, search, status, departmentId, designationId, employmentType, sortBy, sortOrder
  Auth: hrms:read

POST   /hrms/employees
  Body: CreateEmployeeDto
  Auth: hrms:create

GET    /hrms/employees/:id
  Auth: hrms:read (own profile allowed for EMPLOYEE)

PATCH  /hrms/employees/:id
  Body: UpdateEmployeeDto
  Auth: hrms:update

DELETE /hrms/employees/:id
  Auth: hrms:delete (soft delete → status: INACTIVE)

POST   /hrms/employees/:id/activate
  Auth: hrms:update

POST   /hrms/employees/bulk-import
  Body: multipart CSV file
  Auth: hrms:create

GET    /hrms/employees/export
  Query: format (xlsx|csv|pdf)
  Auth: hrms:export

# DEPARTMENTS
GET    /hrms/departments              → tree structure
POST   /hrms/departments
PATCH  /hrms/departments/:id
DELETE /hrms/departments/:id

# ATTENDANCE
GET    /hrms/attendance               → paginated list
  Query: date, employeeId, departmentId, status, from, to
POST   /hrms/attendance               → manual mark
PATCH  /hrms/attendance/:id           → correct attendance
GET    /hrms/attendance/summary       → summary stats
POST   /hrms/attendance/bulk          → bulk mark
GET    /hrms/attendance/export        → export

# LEAVE
GET    /hrms/leave-types              → list leave types
POST   /hrms/leave-types              → create leave type
GET    /hrms/leave-requests           → all requests (admin)
POST   /hrms/leave-requests           → apply leave
GET    /hrms/leave-requests/:id       → detail
PATCH  /hrms/leave-requests/:id/approve
PATCH  /hrms/leave-requests/:id/reject
DELETE /hrms/leave-requests/:id       → cancel (only PENDING)
GET    /hrms/leave-balance            → my balance
GET    /hrms/leave-calendar           → team calendar

# PAYROLL
GET    /hrms/payroll                  → payroll runs
POST   /hrms/payroll/run              → trigger run
GET    /hrms/payroll/:runId           → run + payslips
GET    /hrms/payroll/payslips/:id     → payslip detail
POST   /hrms/payroll/payslips/export  → bulk download

# ASSETS
GET    /hrms/assets                   → all assets
POST   /hrms/assets                   → create
PATCH  /hrms/assets/:id               → update
POST   /hrms/assets/:id/assign        → assign to employee
POST   /hrms/assets/:id/return        → return from employee
```

---

## 17.5 CRM Module

### Leads Controller

```ts
@ApiTags('CRM - Leads')
@Controller('crm/leads')
@UseGuards(JwtAuthGuard, RbacGuard)
export class LeadsController {
  @Get()
  @RequirePermissions({ module: 'crm', action: 'read' })
  async findAll(@CurrentUser() user: AuthUser, @Query() dto: LeadListDto) {
    return this.leadsService.findAll(user.companyId, dto)
  }

  @Post()
  @RequirePermissions({ module: 'crm', action: 'create' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user.companyId, dto, user.id)
  }

  @Get(':id')
  @RequirePermissions({ module: 'crm', action: 'read' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.leadsService.findOne(id, user.companyId)
  }

  @Patch(':id')
  @RequirePermissions({ module: 'crm', action: 'update' })
  async update(@Param('id') id: string, @Body() dto: UpdateLeadDto, @CurrentUser() user: AuthUser) {
    return this.leadsService.update(id, dto, user.companyId, user.id)
  }

  @Patch(':id/stage')
  @RequirePermissions({ module: 'crm', action: 'update' })
  async updateStage(@Param('id') id: string, @Body() dto: UpdateLeadStageDto, @CurrentUser() user: AuthUser) {
    return this.leadsService.updateStage(id, dto.status, user.companyId, user.id)
  }

  @Post(':id/convert')
  @RequirePermissions({ module: 'crm', action: 'create' })
  async convertToDeal(@Param('id') id: string, @Body() dto: ConvertLeadDto, @CurrentUser() user: AuthUser) {
    return this.leadsService.convertToDeal(id, dto, user.companyId, user.id)
  }

  @Post(':id/activity')
  @RequirePermissions({ module: 'crm', action: 'create' })
  async logActivity(@Param('id') id: string, @Body() dto: CreateActivityDto, @CurrentUser() user: AuthUser) {
    return this.leadsService.logActivity(id, dto, user.id)
  }
}
```

### CRM APIs Reference

```
# LEADS
GET    /crm/leads              → list (query: status, source, ownerId, search)
POST   /crm/leads
GET    /crm/leads/:id
PATCH  /crm/leads/:id
DELETE /crm/leads/:id
PATCH  /crm/leads/:id/stage
POST   /crm/leads/:id/convert
POST   /crm/leads/:id/activity

# CONTACTS
GET    /crm/contacts
POST   /crm/contacts
GET    /crm/contacts/:id
PATCH  /crm/contacts/:id
DELETE /crm/contacts/:id
POST   /crm/contacts/:id/activity
POST   /crm/contacts/merge       → merge duplicates

# ACCOUNTS
GET    /crm/accounts
POST   /crm/accounts
GET    /crm/accounts/:id
PATCH  /crm/accounts/:id
DELETE /crm/accounts/:id

# DEALS
GET    /crm/deals
POST   /crm/deals
GET    /crm/deals/:id
PATCH  /crm/deals/:id
DELETE /crm/deals/:id
PATCH  /crm/deals/:id/stage
POST   /crm/deals/:id/activity
POST   /crm/deals/:id/close-won
POST   /crm/deals/:id/close-lost

# ACTIVITIES
GET    /crm/activities
POST   /crm/activities
GET    /crm/activities/:id
PATCH  /crm/activities/:id
DELETE /crm/activities/:id

# PIPELINE
GET    /crm/pipeline            → deals grouped by stage with totals
PATCH  /crm/pipeline/reorder    → reorder deals within stage
```

---

## 17.6 Inventory Module

### Stock Management Service

```ts
// modules/inventory/stock/stock.service.ts
@Injectable()
export class StockService {
  async adjustStock(dto: StockAdjustmentDto, userId: string) {
    const { productId, warehouseId, quantity, type, reason } = dto
    
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.stockLevel.findUnique({
        where: { productId_warehouseId: { productId, warehouseId } }
      })
      
      if (!current) throw new NotFoundException('Stock record not found')
      
      const newQty = type === 'ADD' ? current.quantity + quantity : current.quantity - quantity
      if (newQty < 0) throw new BadRequestException('Insufficient stock')
      
      await tx.stockLevel.update({
        where: { productId_warehouseId: { productId, warehouseId } },
        data: { quantity: newQty }
      })
      
      await tx.stockMovement.create({
        data: {
          companyId: dto.companyId,
          productId, warehouseId,
          type: dto.movementType,
          quantity,
          quantityBefore: current.quantity,
          quantityAfter: newQty,
          reason, createdById: userId,
        }
      })
      
      // Low stock alert
      const product = await tx.product.findUnique({ where: { id: productId } })
      if (product && newQty <= product.reorderPoint) {
        await this.notificationService.sendToRole(dto.companyId, 'PROCUREMENT', {
          type: 'low_stock_alert',
          title: 'Low Stock Alert',
          message: `${product.name} stock is at ${newQty} units (reorder point: ${product.reorderPoint})`,
          link: `/inventory/products/${productId}`,
        })
      }
    })
  }
}
```

### Inventory APIs Reference

```
# PRODUCTS
GET    /inventory/products        → list (query: categoryId, isActive, search, minStock)
POST   /inventory/products
GET    /inventory/products/:id
PATCH  /inventory/products/:id
DELETE /inventory/products/:id
GET    /inventory/products/:id/stock-history
GET    /inventory/products/low-stock     → products below reorder point

# CATEGORIES
GET    /inventory/categories      → tree
POST   /inventory/categories
PATCH  /inventory/categories/:id
DELETE /inventory/categories/:id

# WAREHOUSES
GET    /inventory/warehouses
POST   /inventory/warehouses
PATCH  /inventory/warehouses/:id
GET    /inventory/warehouses/:id/stock  → stock levels in warehouse

# STOCK
GET    /inventory/stock            → all stock levels (query: warehouseId, productId)
POST   /inventory/stock/adjust     → manual adjustment
GET    /inventory/stock/movements  → movement history
POST   /inventory/stock/transfers  → create transfer
GET    /inventory/stock/transfers
PATCH  /inventory/stock/transfers/:id/approve
PATCH  /inventory/stock/transfers/:id/complete
```

---

## 17.7 Procurement Module

### Purchase Order Workflow

```ts
// modules/procurement/purchase-orders/purchase-orders.service.ts
async approvePO(id: string, companyId: string, approvedById: string) {
  const po = await this.findOne(id, companyId)
  
  if (po.status !== POStatus.PENDING_APPROVAL) {
    throw new BadRequestException('Only pending POs can be approved')
  }
  
  const updated = await this.prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: POStatus.APPROVED,
      approvedById,
      approvedAt: new Date(),
    }
  })
  
  // Notify requester
  await this.notificationService.send({
    userId: po.createdById,
    companyId,
    type: 'po_approved',
    title: 'Purchase Order Approved',
    message: `PO ${po.poNumber} has been approved`,
    link: `/procurement/purchase-orders/${id}`,
  })
  
  return updated
}
```

### Procurement APIs Reference

```
# VENDORS
GET    /procurement/vendors
POST   /procurement/vendors
GET    /procurement/vendors/:id
PATCH  /procurement/vendors/:id
DELETE /procurement/vendors/:id
GET    /procurement/vendors/:id/purchase-history

# RFQ
GET    /procurement/rfq
POST   /procurement/rfq
GET    /procurement/rfq/:id
PATCH  /procurement/rfq/:id
DELETE /procurement/rfq/:id
POST   /procurement/rfq/:id/send          → send to vendors
GET    /procurement/rfq/:id/quotes        → vendor quotes
POST   /procurement/rfq/:id/create-po    → create PO from selected quote

# VENDOR QUOTES
POST   /procurement/rfq/:rfqId/quotes    → submit quote
PATCH  /procurement/rfq/:rfqId/quotes/:id

# PURCHASE ORDERS
GET    /procurement/purchase-orders
POST   /procurement/purchase-orders
GET    /procurement/purchase-orders/:id
PATCH  /procurement/purchase-orders/:id
PATCH  /procurement/purchase-orders/:id/submit     → submit for approval
PATCH  /procurement/purchase-orders/:id/approve
PATCH  /procurement/purchase-orders/:id/reject
PATCH  /procurement/purchase-orders/:id/cancel
POST   /procurement/purchase-orders/:id/receipt   → create goods receipt
GET    /procurement/purchase-orders/:id/receipts
GET    /procurement/purchase-orders/export
```

---

## 17.8 Finance Module

### Invoice Service

```ts
// modules/finance/invoices/invoices.service.ts
async generateInvoiceNumber(companyId: string): Promise<string> {
  const year = new Date().getFullYear()
  const count = await this.prisma.invoice.count({
    where: { companyId, issueDate: { gte: new Date(`${year}-01-01`) } }
  })
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`
}

async recordPayment(id: string, dto: RecordPaymentDto, userId: string) {
  const invoice = await this.findOne(id)
  
  const newPaidAmount = invoice.paidAmount + dto.amount
  const newBalance = invoice.totalAmount - newPaidAmount
  
  const status = newBalance <= 0 
    ? InvoiceStatus.PAID 
    : InvoiceStatus.PARTIALLY_PAID

  return this.prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        companyId: invoice.companyId,
        invoiceId: id,
        amount: dto.amount,
        method: dto.method,
        reference: dto.reference,
        paidAt: dto.paidAt ?? new Date(),
        createdById: userId,
      }
    })
    
    return tx.invoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        balanceDue: Math.max(0, newBalance),
        status,
        paidAt: status === InvoiceStatus.PAID ? new Date() : undefined,
      }
    })
  })
}

async generatePDF(id: string): Promise<Buffer> {
  const invoice = await this.prisma.invoice.findUnique({
    where: { id },
    include: { items: true, account: true }
  })
  return this.pdfService.generateInvoice(invoice)
}
```

### Finance APIs Reference

```
# INVOICES
GET    /finance/invoices            → list (query: type, status, accountId, dateFrom, dateTo)
POST   /finance/invoices
GET    /finance/invoices/:id
PATCH  /finance/invoices/:id
DELETE /finance/invoices/:id        → void invoice
POST   /finance/invoices/:id/send   → email to client
POST   /finance/invoices/:id/payment → record payment
GET    /finance/invoices/:id/pdf    → download PDF
GET    /finance/invoices/:id/payments → payment history
GET    /finance/invoices/export

# EXPENSES
GET    /finance/expenses
POST   /finance/expenses
GET    /finance/expenses/:id
PATCH  /finance/expenses/:id
DELETE /finance/expenses/:id
PATCH  /finance/expenses/:id/approve
PATCH  /finance/expenses/:id/reject
POST   /finance/expenses/:id/receipt    → upload receipt (OCR auto-fill)

# PAYMENTS
GET    /finance/payments
GET    /finance/payments/:id

# REPORTS
GET    /finance/reports/profit-loss     → P&L statement
GET    /finance/reports/balance-sheet
GET    /finance/reports/cash-flow
GET    /finance/reports/tax-report      → GST/VAT
GET    /finance/reports/ar-aging        → accounts receivable
GET    /finance/reports/ap-aging        → accounts payable
POST   /finance/reports/schedule        → schedule email report

# BUDGETS
GET    /finance/budgets
POST   /finance/budgets
PATCH  /finance/budgets/:id
DELETE /finance/budgets/:id
GET    /finance/budgets/vs-actual       → budget vs actual comparison
```

---

## 17.9 Projects Module

### Task Service

```ts
async moveTask(taskId: string, dto: MoveTaskDto) {
  const { status, position } = dto
  
  return this.prisma.$transaction(async (tx) => {
    // Reorder tasks in new status column
    await tx.task.updateMany({
      where: { status, position: { gte: position } },
      data: { position: { increment: 1 } }
    })
    
    return tx.task.update({
      where: { id: taskId },
      data: { status, position }
    })
  })
}

async logTime(taskId: string, dto: LogTimeDto, userId: string) {
  await this.prisma.timesheet.create({
    data: {
      companyId: dto.companyId,
      projectId: dto.projectId,
      taskId,
      userId,
      date: dto.date,
      hours: dto.hours,
      description: dto.description,
      isBillable: dto.isBillable,
    }
  })
  
  await this.prisma.task.update({
    where: { id: taskId },
    data: { loggedHours: { increment: dto.hours } }
  })
}
```

### Projects APIs Reference

```
# PROJECTS
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
POST   /projects/:id/members       → add member
DELETE /projects/:id/members/:userId → remove member

# TASKS
GET    /projects/:id/tasks
POST   /projects/:id/tasks
GET    /projects/tasks/:id
PATCH  /projects/tasks/:id
DELETE /projects/tasks/:id
PATCH  /projects/tasks/:id/move    → kanban move
POST   /projects/tasks/:id/time    → log time
POST   /projects/tasks/:id/comment
GET    /projects/tasks/:id/comments

# MILESTONES
GET    /projects/:id/milestones
POST   /projects/:id/milestones
PATCH  /projects/milestones/:id
DELETE /projects/milestones/:id

# TIMESHEETS
GET    /projects/timesheets        → all timesheets (my / project)
GET    /projects/:id/timesheets    → project timesheet
POST   /projects/timesheets        → log time (standalone)

# REPORTS
GET    /projects/:id/reports/summary
GET    /projects/:id/reports/timesheets
GET    /projects/:id/reports/budget
```

---

## 17.10 Support Module

### Ticket Service

```ts
async createTicket(dto: CreateTicketDto, companyId: string, reporterId: string) {
  const ticketNumber = await this.generateTicketNumber(companyId)
  
  const category = dto.categoryId 
    ? await this.prisma.ticketCategory.findUnique({ where: { id: dto.categoryId } })
    : null
  
  const slaDeadline = category?.slaHours 
    ? addHours(new Date(), category.slaHours)
    : undefined

  const ticket = await this.prisma.ticket.create({
    data: { ...dto, companyId, reporterId, ticketNumber, slaDeadline },
    include: { category: true }
  })
  
  // Auto-assign if rules configured
  await this.autoAssign(ticket)
  
  // Notify available agents
  await this.notificationService.sendToRole(companyId, 'SUPPORT_AGENT', {
    type: 'ticket_created',
    title: 'New Ticket',
    message: `Ticket #${ticketNumber}: ${dto.title}`,
    link: `/support/tickets/${ticket.id}`,
  })
  
  return ticket
}

async addReply(ticketId: string, dto: AddReplyDto, userId: string) {
  const ticket = await this.findOne(ticketId)
  
  const reply = await this.prisma.ticketReply.create({
    data: { ticketId, userId, content: dto.content, isInternal: dto.isInternal ?? false, attachments: dto.attachments ?? [] }
  })
  
  // Record first response time
  if (!ticket.firstResponseAt && !dto.isInternal) {
    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { firstResponseAt: new Date() }
    })
  }
  
  // Notify ticket reporter
  if (!dto.isInternal) {
    await this.notificationService.send({
      userId: ticket.reporterId,
      companyId: ticket.companyId,
      type: 'ticket_reply',
      title: 'New Reply on Your Ticket',
      message: `Ticket #${ticket.ticketNumber} has a new reply`,
      link: `/support/tickets/${ticketId}`,
    })
  }
  
  return reply
}
```

### Support APIs Reference

```
# TICKETS
GET    /support/tickets               → list
POST   /support/tickets
GET    /support/tickets/:id
PATCH  /support/tickets/:id
DELETE /support/tickets/:id
POST   /support/tickets/:id/reply
PATCH  /support/tickets/:id/assign
PATCH  /support/tickets/:id/status
PATCH  /support/tickets/:id/priority
POST   /support/tickets/:id/close
GET    /support/tickets/:id/ai-summary

# CATEGORIES
GET    /support/categories
POST   /support/categories
PATCH  /support/categories/:id
DELETE /support/categories/:id

# REPORTS
GET    /support/reports/summary       → ticket stats
GET    /support/reports/sla           → SLA compliance
GET    /support/reports/agent-perf    → agent performance
```

---

## 17.11 Documents Module

### Documents APIs Reference

```
# FOLDERS
GET    /documents/folders             → root folders
GET    /documents/folders/:id         → folder contents
POST   /documents/folders
PATCH  /documents/folders/:id
DELETE /documents/folders/:id

# DOCUMENTS
GET    /documents                     → list (query: folderId, search, tags)
POST   /documents                     → upload file
GET    /documents/:id                 → detail
PATCH  /documents/:id                 → rename / update
DELETE /documents/:id
GET    /documents/:id/download        → download file
POST   /documents/:id/share           → share with users
GET    /documents/:id/versions        → version history
POST   /documents/:id/restore/:version → restore old version

# SEARCH
GET    /documents/search?q=...        → full text search
```

---

## 17.12 Analytics Module

### Analytics Service

```ts
@Injectable()
export class AnalyticsService {
  async getBusinessOverview(companyId: string, params: DateRangeDto) {
    const { from, to } = params
    
    const [revenue, expenses, newEmployees, newLeads, openTickets] = await Promise.all([
      this.getTotalRevenue(companyId, from, to),
      this.getTotalExpenses(companyId, from, to),
      this.getNewEmployees(companyId, from, to),
      this.getNewLeads(companyId, from, to),
      this.getOpenTickets(companyId),
    ])
    
    return { revenue, expenses, profit: revenue - expenses, newEmployees, newLeads, openTickets }
  }

  async getRevenueChart(companyId: string, period: 'daily' | 'weekly' | 'monthly', from: Date, to: Date) {
    const invoices = await this.prisma.invoice.groupBy({
      by: [period === 'monthly' ? 'month' : 'date'],
      where: {
        companyId, status: { in: ['PAID', 'PARTIALLY_PAID'] },
        paidAt: { gte: from, lte: to },
      },
      _sum: { paidAmount: true },
    })
    return invoices
  }
}
```

### Analytics APIs Reference

```
GET    /analytics/overview            → business KPIs
GET    /analytics/revenue             → revenue chart (query: period, from, to)
GET    /analytics/hrms                → HR analytics
GET    /analytics/crm                 → CRM analytics
GET    /analytics/inventory           → inventory analytics
GET    /analytics/support             → support analytics
GET    /analytics/finance             → finance analytics
POST   /analytics/ai-insights         → AI-generated insights
POST   /analytics/schedule-report     → schedule email report
```

---

## 17.13 Settings Module

### Settings APIs Reference

```
# ROLES & PERMISSIONS
GET    /settings/roles
POST   /settings/roles
GET    /settings/roles/:id
PATCH  /settings/roles/:id
DELETE /settings/roles/:id
GET    /settings/permissions          → all available permissions

# EMAIL SETTINGS
GET    /settings/email
PATCH  /settings/email                → update SMTP config
POST   /settings/email/test           → send test email
GET    /settings/email/templates
PATCH  /settings/email/templates/:type → update template

# INTEGRATIONS
GET    /settings/integrations
POST   /settings/integrations/:type/connect
DELETE /settings/integrations/:type/disconnect

# API KEYS
GET    /settings/api-keys
POST   /settings/api-keys
DELETE /settings/api-keys/:id

# AUDIT LOGS
GET    /settings/audit-logs           → paginated (query: userId, module, action, from, to)
GET    /settings/audit-logs/export

# BILLING
GET    /settings/billing/plan
GET    /settings/billing/usage
GET    /settings/billing/invoices
POST   /settings/billing/upgrade
```

---

## 18. API Reference Summary

### Total API Count: ~480+

| Module | Count |
|---|---|
| Auth | 10 |
| Users | 8 |
| Company | 10 |
| HRMS (Employees, Dept, Attendance, Leave, Payroll, Assets) | 65 |
| CRM (Leads, Contacts, Accounts, Deals, Activities) | 55 |
| Inventory (Products, Stock, Warehouse, Transfers) | 40 |
| Procurement (Vendors, RFQ, PO, GR) | 45 |
| Finance (Invoices, Expenses, Payments, Reports, Budgets) | 50 |
| Projects (Projects, Tasks, Milestones, Timesheets) | 40 |
| Support (Tickets, Categories, Reports) | 20 |
| Documents (Folders, Files, Sharing) | 18 |
| Analytics | 10 |
| Settings (Roles, Email, Integrations, API Keys, Audit) | 20 |
| AI | 15 |
| Notifications | 8 |
| **Total** | **~480** |

### Standard Error Codes

| HTTP | Code | Meaning |
|---|---|---|
| 400 | BAD_REQUEST | Validation error |
| 401 | UNAUTHORIZED | Not authenticated |
| 403 | FORBIDDEN | No permission |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate entry |
| 422 | UNPROCESSABLE | Business rule violation |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 500 | INTERNAL_ERROR | Server error |

### Rate Limiting

```ts
// Configured via @nestjs/throttler
ThrottlerModule.forRoot([{
  name: 'short',
  ttl: 1000,
  limit: 20,     // 20 req/sec
}, {
  name: 'long',
  ttl: 60000,
  limit: 500,    // 500 req/min
}])

// Auth endpoints: stricter
@Throttle({ default: { ttl: 60000, limit: 10 } }) // 10/min
@Post('login')
```

---

## 19. Docker & Deployment

### docker-compose.yml

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: aibos_db
      POSTGRES_USER: aibos_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aibos_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://aibos_user:${POSTGRES_PASSWORD}@postgres:5432/aibos_db
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
      - AWS_SECRET_KEY=${AWS_SECRET_KEY}
      - STORAGE_BUCKET=${STORAGE_BUCKET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3001:3001"
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Backend Dockerfile

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json ./

EXPOSE 3001
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main"]
```

### GitHub Actions — Backend CI/CD

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
        ports: ["6379:6379"]
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install
      - run: pnpm prisma generate
      - run: pnpm prisma migrate dev
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
      - run: pnpm test:unit
      - run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ secrets.REGISTRY }}/backend:${{ github.sha }}
      - name: Deploy to server
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} \
            "cd /app && docker-compose pull && docker-compose up -d"
```

### Prisma Database Migrations

```bash
# Development
pnpm prisma migrate dev --name init

# Production
pnpm prisma migrate deploy

# Seed
pnpm prisma db seed

# Reset (dev only)
pnpm prisma migrate reset
```

### Seed Script

```ts
// prisma/seed.ts
async function main() {
  // Create super admin company
  const company = await prisma.company.create({
    data: {
      name: 'Demo Company',
      slug: 'demo-company',
      email: 'admin@demo.com',
      plan: 'ENTERPRISE',
    }
  })

  // Create system roles
  const adminRole = await prisma.role.create({
    data: { companyId: company.id, name: 'Admin', isSystem: true }
  })

  // Seed all permissions
  const permissions = generateAllPermissions()
  await prisma.permission.createMany({ data: permissions, skipDuplicates: true })

  // Assign all permissions to admin
  await prisma.rolePermission.createMany({
    data: permissions.map(p => ({ roleId: adminRole.id, permissionId: p.id }))
  })

  // Create admin user
  await prisma.user.create({
    data: {
      companyId: company.id,
      email: 'admin@demo.com',
      passwordHash: await bcrypt.hash('Admin@123', 12),
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole.id,
    }
  })

  // Seed departments
  const departments = ['Engineering', 'HR', 'Sales', 'Finance', 'Operations']
  for (const name of departments) {
    await prisma.department.create({
      data: { companyId: company.id, name, code: name.toUpperCase() }
    })
  }

  // Seed leave types
  const leaveTypes = [
    { name: 'Earned Leave', code: 'EL', annualAllowance: 15, carryForward: true, isPaid: true },
    { name: 'Sick Leave', code: 'SL', annualAllowance: 10, carryForward: false, isPaid: true },
    { name: 'Casual Leave', code: 'CL', annualAllowance: 12, carryForward: false, isPaid: true },
    { name: 'Maternity Leave', code: 'ML', annualAllowance: 180, carryForward: false, isPaid: true },
    { name: 'Paternity Leave', code: 'PL', annualAllowance: 15, carryForward: false, isPaid: true },
    { name: 'Loss of Pay', code: 'LOP', annualAllowance: 0, carryForward: false, isPaid: false },
  ]
  
  await prisma.leaveType.createMany({
    data: leaveTypes.map(lt => ({ ...lt, companyId: company.id }))
  })

  console.log('✅ Seed completed')
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

---

## 20. Testing Strategy

### Unit Tests

```ts
// test/unit/hrms/employees.service.spec.ts
describe('EmployeesService', () => {
  let service: EmployeesService
  let prisma: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: StorageService, useValue: { upload: jest.fn() } },
        { provide: NotificationService, useValue: { sendToRole: jest.fn() } },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile()
    
    service = module.get(EmployeesService)
    prisma = module.get(PrismaService)
  })

  describe('create', () => {
    it('should create employee and return data', async () => {
      const dto: CreateEmployeeDto = {
        firstName: 'John', lastName: 'Doe',
        email: 'john@company.com', phone: '+919999999999',
        departmentId: 'dept-uuid', designationId: 'des-uuid',
        joiningDate: new Date(), employmentType: EmploymentType.FULL_TIME,
      }
      
      prisma.employee.count.mockResolvedValue(0)
      prisma.employee.create.mockResolvedValue({
        ...dto, id: 'emp-uuid', employeeCode: 'EMP00001', companyId: 'co-uuid',
      } as Employee)
      prisma.leaveType.findMany.mockResolvedValue([])
      
      const result = await service.create('co-uuid', dto, 'user-uuid')
      expect(result.employeeCode).toBe('EMP00001')
      expect(prisma.employee.create).toHaveBeenCalledTimes(1)
    })
  })
})
```

### Integration Tests

```ts
// test/integration/auth.spec.ts
describe('AuthController (integration)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    
    app = module.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter())
    await app.init()
    
    prisma = module.get(PrismaService)
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  describe('POST /auth/login', () => {
    it('should return tokens on valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@demo.com', password: 'Admin@123' })
        .expect(200)

      expect(response.body.data).toHaveProperty('accessToken')
      expect(response.body.data).toHaveProperty('refreshToken')
    })

    it('should return 401 on invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrongpass' })
        .expect(401)
    })
  })
})
```

### Cron Jobs

```ts
// Common cron jobs registered in app

@Injectable()
export class ScheduledTasks {
  @Cron('0 0 * * *') // Daily midnight
  async dailyAttendanceReport() {
    // Send attendance summary to HR managers
  }

  @Cron('0 9 1 * *') // 1st of each month at 9am
  async monthlyPayrollReminder() {
    // Remind HR to run payroll
  }

  @Cron('0 */6 * * *') // Every 6 hours
  async checkOverdueInvoices() {
    // Mark invoices as OVERDUE if past due date
    await this.prisma.invoice.updateMany({
      where: {
        status: InvoiceStatus.SENT,
        dueDate: { lt: new Date() },
      },
      data: { status: InvoiceStatus.OVERDUE }
    })
  }

  @Cron('0 8 * * 1') // Every Monday 8am
  async weeklyLeaveReport() {
    // Send leave summary to managers
  }
  
  @Cron('0 2 * * *') // Daily 2am
  async cleanExpiredTokens() {
    await this.prisma.refreshToken.deleteMany({
      where: { OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }] }
    })
  }
}
```

---

*AI Business OS — Backend Architecture Documentation v1.0.0*  
*Coverage: System Architecture, 150+ DB Tables (Prisma Schema), Authentication, RBAC, 480+ APIs, 13 Modules, AI Service, Queue System, WebSocket, Docker, CI/CD, Testing*
