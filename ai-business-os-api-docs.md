# AI Business OS — Full API Documentation

> **Version:** 1.0.0 | **Base URL:** `https://api.yourdomain.com/api/v1`
> **Auth:** Bearer Token (JWT) — All endpoints require `Authorization: Bearer <token>` unless marked `[PUBLIC]`

---

## Standard Response Format

### Success
```json
{
  "success": true,
  "data": { },
  "timestamp": "2025-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

### Paginated Success
```json
{
  "success": true,
  "data": {
    "data": [],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Error
```json
{
  "success": false,
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Validation failed",
  "path": "/api/v1/hrms/employees",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

### Error Codes
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

---

## Table of Contents

1. [Auth Module](#1-auth-module)
2. [Users Module](#2-users-module)
3. [Company Module](#3-company-module)
4. [HRMS Module](#4-hrms-module)
5. [CRM Module](#5-crm-module)
6. [Inventory Module](#6-inventory-module)
7. [Procurement Module](#7-procurement-module)
8. [Finance Module](#8-finance-module)
9. [Projects Module](#9-projects-module)
10. [Support Module](#10-support-module)
11. [Documents Module](#11-documents-module)
12. [Analytics Module](#12-analytics-module)
13. [Settings Module](#13-settings-module)
14. [Notifications Module](#14-notifications-module)
15. [AI Module](#15-ai-module)

---

# 1. Auth Module

## POST /auth/register `[PUBLIC]`

Register new company + admin user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corp",
  "email": "john@acme.com",
  "password": "Password@123"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "message": "Registration successful. Please check your email."
  }
}
```

**Validation:**
- `password`: min 8 chars, must contain uppercase, lowercase, number
- `email`: unique across system

---

## POST /auth/login `[PUBLIC]`

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "john@acme.com",
  "password": "Password@123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "john@acme.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://storage.../avatar.jpg",
      "companyId": "uuid",
      "roleId": "uuid",
      "role": {
        "id": "uuid",
        "name": "Admin"
      },
      "permissions": [
        { "module": "hrms", "action": "read", "scope": "company" },
        { "module": "hrms", "action": "create", "scope": "company" }
      ]
    }
  }
}
```

---

## POST /auth/refresh `[PUBLIC]`

Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## POST /auth/logout

Revoke refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

## POST /auth/forgot-password `[PUBLIC]`

Send OTP to email.

**Request Body:**
```json
{
  "email": "john@acme.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "If email exists, OTP has been sent" }
}
```

---

## POST /auth/reset-password `[PUBLIC]`

Reset password using OTP.

**Request Body:**
```json
{
  "email": "john@acme.com",
  "otp": "123456",
  "newPassword": "NewPassword@123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Password reset successful" }
}
```

---

## GET /auth/me

Get current user profile.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://storage.../avatar.jpg",
    "phone": "+919999999999",
    "isEmailVerified": true,
    "twoFactorEnabled": false,
    "lastLoginAt": "2025-01-01T00:00:00.000Z",
    "companyId": "uuid",
    "company": {
      "id": "uuid",
      "name": "Acme Corp",
      "logo": "https://storage.../logo.png",
      "plan": "PROFESSIONAL"
    },
    "role": {
      "id": "uuid",
      "name": "Admin",
      "permissions": []
    }
  }
}
```

---

## POST /auth/change-password

Change password (authenticated).

**Request Body:**
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Password changed successfully" }
}
```

---

## POST /auth/enable-2fa

Enable two-factor authentication.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "secret": "BASE32SECRET"
  }
}
```

---

## POST /auth/verify-2fa

Verify 2FA token.

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "2FA enabled successfully" }
}
```

---

# 2. Users Module

## GET /users

List all users in the company.

**Query Params:**
```
page=1&limit=20&search=john&roleId=uuid&isActive=true&sortBy=createdAt&sortOrder=desc
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "john@acme.com",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://storage.../avatar.jpg",
        "phone": "+919999999999",
        "isActive": true,
        "isEmailVerified": true,
        "lastLoginAt": "2025-01-01T00:00:00.000Z",
        "role": { "id": "uuid", "name": "Admin" },
        "employee": { "id": "uuid", "employeeCode": "EMP00001" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 50, "page": 1, "limit": 20, "totalPages": 3, "hasNext": true, "hasPrev": false }
  }
}
```

---

## POST /users/invite

Invite a user by email.

**Request Body:**
```json
{
  "email": "jane@acme.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "roleId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "jane@acme.com",
    "message": "Invitation sent successfully"
  }
}
```

---

## GET /users/:id

Get user detail.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null,
    "phone": "+919999999999",
    "isActive": true,
    "isEmailVerified": true,
    "twoFactorEnabled": false,
    "lastLoginAt": "2025-01-01T00:00:00.000Z",
    "role": {
      "id": "uuid",
      "name": "Admin",
      "permissions": [
        { "module": "hrms", "action": "read", "scope": "company" }
      ]
    },
    "employee": {
      "id": "uuid",
      "employeeCode": "EMP00001",
      "department": { "name": "Engineering" }
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## PATCH /users/:id

Update user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+919999999999",
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Smith",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## DELETE /users/:id

Deactivate user (soft delete).

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "User deactivated successfully" }
}
```

---

## PATCH /users/:id/role

Change user role.

**Request Body:**
```json
{
  "roleId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": { "id": "uuid", "name": "Manager" }
  }
}
```

---

## POST /users/:id/reset-password

Admin reset user password.

**Request Body:**
```json
{
  "newPassword": "TempPassword@123",
  "sendEmail": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Password reset and email sent" }
}
```

---

## PATCH /users/me

Update own profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919999999999"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919999999999",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## POST /users/me/avatar

Upload avatar (multipart/form-data).

**Request:** `multipart/form-data` — field: `file` (image/jpeg or image/png, max 5MB)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://storage.../avatars/uuid.jpg"
  }
}
```

---

# 3. Company Module

## GET /company

Get company details.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "email": "admin@acme.com",
    "phone": "+911234567890",
    "logo": "https://storage.../logo.png",
    "website": "https://acme.com",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "zip": "400001"
    },
    "timezone": "Asia/Kolkata",
    "currency": "INR",
    "language": "en",
    "plan": "PROFESSIONAL",
    "isActive": true,
    "trialEndsAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## PATCH /company

Update company info.

**Request Body:**
```json
{
  "name": "Acme Corp Ltd",
  "phone": "+911234567890",
  "website": "https://acme.com",
  "address": {
    "street": "456 New St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zip": "400002"
  },
  "timezone": "Asia/Kolkata",
  "currency": "INR"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp Ltd",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## POST /company/logo

Upload company logo (multipart/form-data).

**Request:** `multipart/form-data` — field: `file` (image/jpeg or image/png, max 5MB)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logoUrl": "https://storage.../logos/uuid.png"
  }
}
```

---

## GET /company/settings

Get company settings.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "attendance": {
      "workStartTime": "09:00",
      "workEndTime": "18:00",
      "workingDays": ["MON","TUE","WED","THU","FRI"],
      "lateThresholdMinutes": 15
    },
    "leave": {
      "autoApproveAfterDays": 0,
      "maxConsecutiveDays": 15
    },
    "payroll": {
      "payDay": 28,
      "pfPercentage": 12,
      "esiPercentage": 0.75
    },
    "notifications": {
      "emailEnabled": true,
      "inAppEnabled": true
    }
  }
}
```

---

## PATCH /company/settings

Update company settings.

**Request Body:**
```json
{
  "attendance": {
    "workStartTime": "09:30",
    "workEndTime": "18:30",
    "workingDays": ["MON","TUE","WED","THU","FRI"],
    "lateThresholdMinutes": 10
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Settings updated successfully" }
}
```

---

## GET /company/branches

List all branches.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mumbai HQ",
      "code": "MUM",
      "address": { "city": "Mumbai", "state": "Maharashtra" },
      "phone": "+911234567890",
      "isHQ": true,
      "isActive": true,
      "employeeCount": 50
    }
  ]
}
```

---

## POST /company/branches

Create a branch.

**Request Body:**
```json
{
  "name": "Delhi Branch",
  "code": "DEL",
  "address": {
    "street": "789 Ring Rd",
    "city": "Delhi",
    "state": "Delhi",
    "country": "India",
    "zip": "110001"
  },
  "phone": "+919876543210",
  "isHQ": false
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Delhi Branch",
    "code": "DEL",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## PATCH /company/branches/:id

Update branch.

**Request Body:**
```json
{
  "name": "Delhi Office",
  "phone": "+919876543210"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Delhi Office",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## DELETE /company/branches/:id

Delete branch.

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Branch deleted successfully" }
}
```

---

# 4. HRMS Module

## 4.1 Dashboard

### GET /hrms/dashboard

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEmployees": 120,
      "presentToday": 98,
      "onLeaveToday": 5,
      "newHiresThisMonth": 3,
      "attritionRate": 2.5,
      "pendingLeaveRequests": 8
    },
    "headcountTrend": [
      { "month": "Jan", "count": 115 },
      { "month": "Feb", "count": 117 }
    ],
    "departmentWise": [
      { "department": "Engineering", "count": 45 },
      { "department": "Sales", "count": 30 }
    ],
    "weeklyAttendance": [
      { "day": "Mon", "present": 110, "absent": 10 }
    ]
  }
}
```

---

## 4.2 Employees

### GET /hrms/employees

**Query Params:**
```
page=1&limit=20&search=john&status=ACTIVE&departmentId=uuid
&designationId=uuid&employmentType=FULL_TIME&branchId=uuid
&sortBy=createdAt&sortOrder=desc
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "employeeCode": "EMP00001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@acme.com",
        "phone": "+919999999999",
        "avatar": "https://storage.../avatar.jpg",
        "gender": "MALE",
        "employmentType": "FULL_TIME",
        "status": "ACTIVE",
        "joiningDate": "2023-01-01",
        "department": { "id": "uuid", "name": "Engineering" },
        "designation": { "id": "uuid", "name": "Senior Engineer" },
        "branch": { "id": "uuid", "name": "Mumbai HQ" },
        "manager": { "id": "uuid", "firstName": "Jane", "lastName": "Smith" },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 120, "page": 1, "limit": 20, "totalPages": 6, "hasNext": true, "hasPrev": false }
  }
}
```

---

### POST /hrms/employees

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@acme.com",
  "personalEmail": "john.personal@gmail.com",
  "phone": "+919999999999",
  "alternatePhone": "+918888888888",
  "dob": "1990-05-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "maritalStatus": "SINGLE",
  "employeeCode": "EMP00001",
  "departmentId": "uuid",
  "designationId": "uuid",
  "branchId": "uuid",
  "reportingManagerId": "uuid",
  "employmentType": "FULL_TIME",
  "joiningDate": "2025-01-01",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zip": "400001"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relation": "Spouse",
    "phone": "+917777777777"
  },
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234",
    "bankName": "HDFC Bank",
    "accountType": "SAVINGS"
  },
  "panNumber": "ABCDE1234F",
  "aadharNumber": "1234-5678-9012"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeCode": "EMP00001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@acme.com",
    "status": "ACTIVE",
    "department": { "id": "uuid", "name": "Engineering" },
    "designation": { "id": "uuid", "name": "Senior Engineer" },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /hrms/employees/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeCode": "EMP00001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@acme.com",
    "personalEmail": "john.personal@gmail.com",
    "phone": "+919999999999",
    "alternatePhone": null,
    "dob": "1990-05-15",
    "gender": "MALE",
    "bloodGroup": "O+",
    "maritalStatus": "SINGLE",
    "avatar": null,
    "employmentType": "FULL_TIME",
    "status": "ACTIVE",
    "joiningDate": "2025-01-01",
    "confirmationDate": "2025-04-01",
    "exitDate": null,
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "zip": "400001"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relation": "Spouse",
      "phone": "+917777777777"
    },
    "bankDetails": {
      "accountNumber": "XXXX7890",
      "ifscCode": "HDFC0001234",
      "bankName": "HDFC Bank"
    },
    "panNumber": "ABCDE1234F",
    "aadharNumber": "XXXX-XXXX-9012",
    "department": { "id": "uuid", "name": "Engineering" },
    "designation": { "id": "uuid", "name": "Senior Engineer" },
    "branch": { "id": "uuid", "name": "Mumbai HQ" },
    "manager": { "id": "uuid", "firstName": "Jane", "lastName": "Smith" },
    "user": { "id": "uuid", "email": "john@acme.com", "isActive": true },
    "salaryStructure": {
      "basicSalary": 50000,
      "hra": 20000,
      "grossSalary": 75000,
      "netSalary": 68000
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/employees/:id

**Request Body:** (all fields optional)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919999999999",
  "departmentId": "uuid",
  "designationId": "uuid",
  "reportingManagerId": "uuid",
  "status": "ACTIVE",
  "address": {
    "street": "456 New St",
    "city": "Pune"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### DELETE /hrms/employees/:id

Soft delete (sets status to INACTIVE).

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Employee deactivated successfully" }
}
```

---

### POST /hrms/employees/:id/activate

Reactivate employee.

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Employee activated successfully" }
}
```

---

### POST /hrms/employees/bulk-import

Bulk import employees via CSV.

**Request:** `multipart/form-data` — field: `file` (text/csv, max 10MB)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "imported": 48,
    "failed": 2,
    "errors": [
      { "row": 5, "error": "Email already exists" },
      { "row": 12, "error": "Invalid department" }
    ]
  }
}
```

---

### GET /hrms/employees/export

Export employees list.

**Query Params:** `format=xlsx&status=ACTIVE&departmentId=uuid`

**Response:** Binary file download (xlsx/csv/pdf)

---

## 4.3 Departments

### GET /hrms/departments

**Query Params:** `includeTree=true&includeEmployeeCount=true`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Engineering",
      "code": "ENG",
      "description": "Engineering team",
      "parentId": null,
      "headId": "uuid",
      "head": { "id": "uuid", "firstName": "Jane", "lastName": "Smith" },
      "isActive": true,
      "employeeCount": 45,
      "children": [
        {
          "id": "uuid",
          "name": "Frontend",
          "code": "ENG-FE",
          "parentId": "uuid",
          "employeeCount": 15,
          "children": []
        }
      ]
    }
  ]
}
```

---

### POST /hrms/departments

**Request Body:**
```json
{
  "name": "Marketing",
  "code": "MKT",
  "description": "Marketing department",
  "parentId": null,
  "headId": "uuid",
  "branchId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Marketing",
    "code": "MKT",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/departments/:id

**Request Body:**
```json
{
  "name": "Marketing & PR",
  "headId": "uuid",
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Marketing & PR",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### DELETE /hrms/departments/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Department deleted successfully" }
}
```

**Error 422:**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Cannot delete department with active employees"
}
```

---

### GET /hrms/departments/:id/employees

**Query Params:** `page=1&limit=20`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "employeeCode": "EMP00001",
        "firstName": "John",
        "lastName": "Doe",
        "designation": { "name": "Senior Engineer" },
        "status": "ACTIVE"
      }
    ],
    "meta": { "total": 45, "page": 1, "limit": 20, "totalPages": 3 }
  }
}
```

---

## 4.4 Designations

### GET /hrms/designations

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Senior Engineer",
      "level": 3,
      "description": "Senior level engineering role",
      "isActive": true,
      "employeeCount": 12
    }
  ]
}
```

---

### POST /hrms/designations

**Request Body:**
```json
{
  "name": "Lead Engineer",
  "level": 4,
  "description": "Lead level engineering role"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Lead Engineer",
    "level": 4,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/designations/:id

**Request Body:**
```json
{
  "name": "Principal Engineer",
  "level": 5
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Principal Engineer", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /hrms/designations/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Designation deleted successfully" }
}
```

---

## 4.5 Attendance

### GET /hrms/attendance

**Query Params:**
```
page=1&limit=20&date=2025-01-01&employeeId=uuid&departmentId=uuid
&status=PRESENT&from=2025-01-01&to=2025-01-31
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "date": "2025-01-01",
        "checkIn": "2025-01-01T09:05:00.000Z",
        "checkOut": "2025-01-01T18:10:00.000Z",
        "workingHours": 9.08,
        "status": "PRESENT",
        "source": "APP",
        "overtime": 0,
        "notes": null,
        "employee": {
          "id": "uuid",
          "employeeCode": "EMP00001",
          "firstName": "John",
          "lastName": "Doe",
          "department": { "name": "Engineering" }
        }
      }
    ],
    "meta": { "total": 200, "page": 1, "limit": 20 }
  }
}
```

---

### POST /hrms/attendance

Mark attendance manually.

**Request Body:**
```json
{
  "employeeId": "uuid",
  "date": "2025-01-01",
  "checkIn": "2025-01-01T09:00:00.000Z",
  "checkOut": "2025-01-01T18:00:00.000Z",
  "status": "PRESENT",
  "source": "MANUAL",
  "notes": "Manual entry by admin"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "2025-01-01",
    "status": "PRESENT",
    "workingHours": 9,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/attendance/:id

Correct attendance.

**Request Body:**
```json
{
  "checkIn": "2025-01-01T09:00:00.000Z",
  "checkOut": "2025-01-01T18:30:00.000Z",
  "status": "PRESENT",
  "notes": "Correction by admin"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workingHours": 9.5,
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /hrms/attendance/summary

**Query Params:** `from=2025-01-01&to=2025-01-31&departmentId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalDays": 23,
    "totalPresent": 2300,
    "totalAbsent": 115,
    "totalLate": 45,
    "totalHalfDay": 22,
    "totalOnLeave": 38,
    "averageWorkingHours": 8.7,
    "attendanceRate": 91.3,
    "byDepartment": [
      { "department": "Engineering", "attendanceRate": 94.2 }
    ]
  }
}
```

---

### POST /hrms/attendance/bulk

Bulk mark attendance.

**Request Body:**
```json
{
  "date": "2025-01-01",
  "entries": [
    {
      "employeeId": "uuid",
      "status": "PRESENT",
      "checkIn": "2025-01-01T09:00:00.000Z",
      "checkOut": "2025-01-01T18:00:00.000Z"
    },
    {
      "employeeId": "uuid2",
      "status": "ABSENT"
    }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "processed": 50,
    "failed": 0
  }
}
```

---

### GET /hrms/attendance/export

**Query Params:** `format=xlsx&from=2025-01-01&to=2025-01-31&departmentId=uuid`

**Response:** Binary file download

---

## 4.6 Leave Types

### GET /hrms/leave-types

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Earned Leave",
      "code": "EL",
      "annualAllowance": 15,
      "carryForward": true,
      "maxCarryForward": 10,
      "isPaid": true,
      "requiresApproval": true,
      "description": "Annual earned leave",
      "isActive": true
    }
  ]
}
```

---

### POST /hrms/leave-types

**Request Body:**
```json
{
  "name": "Sick Leave",
  "code": "SL",
  "annualAllowance": 10,
  "carryForward": false,
  "isPaid": true,
  "requiresApproval": true,
  "description": "Medical leave"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Sick Leave",
    "code": "SL",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/leave-types/:id

**Request Body:**
```json
{
  "annualAllowance": 12,
  "carryForward": true,
  "maxCarryForward": 5
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "annualAllowance": 12, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /hrms/leave-types/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Leave type deleted successfully" }
}
```

---

## 4.7 Leave Requests

### GET /hrms/leave-requests

**Query Params:**
```
page=1&limit=20&status=PENDING&employeeId=uuid&leaveTypeId=uuid
&from=2025-01-01&to=2025-01-31&departmentId=uuid
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "fromDate": "2025-01-10",
        "toDate": "2025-01-12",
        "days": 3,
        "reason": "Personal work",
        "status": "PENDING",
        "attachments": [],
        "employee": {
          "id": "uuid",
          "employeeCode": "EMP00001",
          "firstName": "John",
          "lastName": "Doe",
          "department": { "name": "Engineering" }
        },
        "leaveType": { "id": "uuid", "name": "Earned Leave", "code": "EL" },
        "approvedBy": null,
        "createdAt": "2025-01-05T00:00:00.000Z"
      }
    ],
    "meta": { "total": 25, "page": 1, "limit": 20 }
  }
}
```

---

### POST /hrms/leave-requests

**Request Body:**
```json
{
  "leaveTypeId": "uuid",
  "fromDate": "2025-01-10",
  "toDate": "2025-01-12",
  "reason": "Personal work",
  "attachments": ["https://storage.../doc.pdf"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fromDate": "2025-01-10",
    "toDate": "2025-01-12",
    "days": 3,
    "status": "PENDING",
    "createdAt": "2025-01-05T00:00:00.000Z"
  }
}
```

---

### GET /hrms/leave-requests/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fromDate": "2025-01-10",
    "toDate": "2025-01-12",
    "days": 3,
    "reason": "Personal work",
    "status": "PENDING",
    "comments": null,
    "attachments": [],
    "employee": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "employeeCode": "EMP00001"
    },
    "leaveType": { "name": "Earned Leave", "code": "EL", "isPaid": true },
    "approvedBy": null,
    "rejectedBy": null,
    "createdAt": "2025-01-05T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/leave-requests/:id/approve

**Request Body:**
```json
{
  "comments": "Approved. Enjoy your leave."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "approvedBy": { "id": "uuid", "firstName": "Manager" },
    "updatedAt": "2025-01-05T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/leave-requests/:id/reject

**Request Body:**
```json
{
  "comments": "Rejected due to project deadline."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "REJECTED",
    "comments": "Rejected due to project deadline.",
    "updatedAt": "2025-01-05T00:00:00.000Z"
  }
}
```

---

### DELETE /hrms/leave-requests/:id

Cancel leave request (only PENDING).

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Leave request cancelled successfully" }
}
```

---

### GET /hrms/leave-balance

**Query Params:** `employeeId=uuid&year=2025`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "year": 2025,
      "allocated": 15,
      "taken": 5,
      "pending": 2,
      "balance": 8,
      "leaveType": { "id": "uuid", "name": "Earned Leave", "code": "EL" }
    },
    {
      "id": "uuid",
      "year": 2025,
      "allocated": 10,
      "taken": 2,
      "pending": 0,
      "balance": 8,
      "leaveType": { "id": "uuid", "name": "Sick Leave", "code": "SL" }
    }
  ]
}
```

---

### GET /hrms/leave-calendar

**Query Params:** `from=2025-01-01&to=2025-01-31&departmentId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-10",
      "employees": [
        {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe",
          "leaveType": "Earned Leave",
          "status": "APPROVED"
        }
      ]
    }
  ]
}
```

---

## 4.8 Payroll

### GET /hrms/payroll

**Query Params:** `page=1&limit=20&year=2025&status=PROCESSED`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "month": 1,
        "year": 2025,
        "status": "PROCESSED",
        "totalAmount": 2500000,
        "processedAt": "2025-01-28T00:00:00.000Z",
        "processedBy": { "firstName": "Admin", "lastName": "User" },
        "payslipCount": 50,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 12, "page": 1, "limit": 20 }
  }
}
```

---

### POST /hrms/payroll/run

Trigger payroll run for a month.

**Request Body:**
```json
{
  "month": 2,
  "year": 2025
}
```

**Response 202:**
```json
{
  "success": true,
  "data": {
    "payrollId": "uuid",
    "status": "PROCESSING",
    "message": "Payroll run started. You will be notified when complete."
  }
}
```

---

### GET /hrms/payroll/:runId

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "month": 2,
    "year": 2025,
    "status": "PROCESSED",
    "totalAmount": 2500000,
    "processedAt": "2025-02-28T00:00:00.000Z",
    "payslips": [
      {
        "id": "uuid",
        "employeeCode": "EMP00001",
        "employeeName": "John Doe",
        "basicSalary": 50000,
        "grossSalary": 75000,
        "netSalary": 68000,
        "status": "GENERATED"
      }
    ]
  }
}
```

---

### GET /hrms/payroll/payslips/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "month": 2,
    "year": 2025,
    "employee": {
      "id": "uuid",
      "employeeCode": "EMP00001",
      "firstName": "John",
      "lastName": "Doe",
      "department": { "name": "Engineering" },
      "designation": { "name": "Senior Engineer" },
      "bankDetails": { "accountNumber": "XXXX7890", "bankName": "HDFC Bank" }
    },
    "basicSalary": 50000,
    "allowances": {
      "hra": 20000,
      "ta": 2000,
      "da": 1000,
      "other": 2000
    },
    "deductions": {
      "pf": 6000,
      "esi": 1500,
      "tds": 2000,
      "other": 0
    },
    "grossSalary": 75000,
    "netSalary": 65500,
    "status": "GENERATED",
    "pdfUrl": "https://storage.../payslip-EMP00001-Feb-2025.pdf",
    "paidAt": null
  }
}
```

---

### POST /hrms/payroll/payslips/export

Bulk export payslips as ZIP.

**Request Body:**
```json
{
  "payrollId": "uuid",
  "format": "pdf"
}
```

**Response:** Binary ZIP file download

---

## 4.9 Salary Structure

### GET /hrms/salary-structure/:employeeId

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "effectiveFrom": "2025-01-01",
    "basicSalary": 50000,
    "hra": 20000,
    "ta": 2000,
    "da": 1000,
    "pf": 6000,
    "esi": 1500,
    "otherAllowances": [
      { "name": "Special Allowance", "amount": 2000 }
    ],
    "deductions": [
      { "name": "Loan EMI", "amount": 5000 }
    ],
    "grossSalary": 75000,
    "netSalary": 62500,
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### POST /hrms/salary-structure

**Request Body:**
```json
{
  "employeeId": "uuid",
  "effectiveFrom": "2025-01-01",
  "basicSalary": 50000,
  "hra": 20000,
  "ta": 2000,
  "da": 1000,
  "pf": 6000,
  "esi": 1500,
  "otherAllowances": [
    { "name": "Special Allowance", "amount": 2000 }
  ],
  "deductions": []
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "grossSalary": 75000,
    "netSalary": 66500,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 4.10 Assets

### GET /hrms/assets

**Query Params:** `page=1&limit=20&status=AVAILABLE&category=Laptop&search=macbook`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "MacBook Pro 14\"",
        "code": "ASSET-001",
        "category": "Laptop",
        "brand": "Apple",
        "model": "MacBook Pro 14",
        "serialNumber": "C02XJ1234567",
        "purchaseDate": "2024-01-01",
        "purchaseValue": 200000,
        "status": "ASSIGNED",
        "location": "Mumbai HQ",
        "currentAssignee": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe",
          "employeeCode": "EMP00001"
        }
      }
    ],
    "meta": { "total": 80, "page": 1, "limit": 20 }
  }
}
```

---

### POST /hrms/assets

**Request Body:**
```json
{
  "name": "Dell Monitor 27\"",
  "code": "ASSET-002",
  "category": "Monitor",
  "brand": "Dell",
  "model": "P2723D",
  "serialNumber": "CN-0ABCD1234",
  "purchaseDate": "2025-01-01",
  "purchaseValue": 35000,
  "location": "Mumbai HQ",
  "description": "27-inch QHD monitor"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dell Monitor 27\"",
    "code": "ASSET-002",
    "status": "AVAILABLE",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/assets/:id

**Request Body:**
```json
{
  "status": "MAINTENANCE",
  "location": "Service Center",
  "description": "Sent for repair"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "MAINTENANCE", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /hrms/assets/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Asset deleted successfully" }
}
```

---

### POST /hrms/assets/:id/assign

**Request Body:**
```json
{
  "employeeId": "uuid",
  "condition": "Good",
  "notes": "Assigned for remote work"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "assetId": "uuid",
    "employeeId": "uuid",
    "assignedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### POST /hrms/assets/:id/return

**Request Body:**
```json
{
  "condition": "Good",
  "notes": "Returned in good condition"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "returnedAt": "2025-01-01T00:00:00.000Z",
    "message": "Asset returned successfully"
  }
}
```

---

## 4.11 Holidays

### GET /hrms/holidays

**Query Params:** `year=2025&branchId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Republic Day",
      "date": "2025-01-26",
      "type": "PUBLIC",
      "isOptional": false,
      "branchId": null
    },
    {
      "id": "uuid",
      "name": "Company Foundation Day",
      "date": "2025-03-15",
      "type": "RESTRICTED",
      "isOptional": true,
      "branchId": "uuid"
    }
  ]
}
```

---

### POST /hrms/holidays

**Request Body:**
```json
{
  "name": "Diwali",
  "date": "2025-10-20",
  "type": "PUBLIC",
  "isOptional": false,
  "branchId": null
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Diwali",
    "date": "2025-10-20",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /hrms/holidays/:id

**Request Body:**
```json
{
  "name": "Diwali Festival",
  "isOptional": false
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Diwali Festival", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /hrms/holidays/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Holiday deleted successfully" }
}
```

---

## 4.12 HRMS Reports

### GET /hrms/reports/attendance

**Query Params:** `from=2025-01-01&to=2025-01-31&departmentId=uuid&format=json`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEmployees": 120,
      "averageAttendanceRate": 91.3,
      "totalOvertimeHours": 245
    },
    "byEmployee": [
      {
        "employeeCode": "EMP00001",
        "name": "John Doe",
        "presentDays": 21,
        "absentDays": 2,
        "lateDays": 1,
        "totalHours": 189
      }
    ]
  }
}
```

---

### GET /hrms/reports/leave

**Query Params:** `from=2025-01-01&to=2025-12-31&leaveTypeId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalLeavesTaken": 450,
    "byLeaveType": [
      { "leaveType": "Earned Leave", "totalDays": 300, "employeeCount": 65 }
    ],
    "byMonth": [
      { "month": "Jan", "days": 45 }
    ]
  }
}
```

---

### GET /hrms/reports/payroll

**Query Params:** `year=2025&month=1`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalGrossSalary": 4500000,
    "totalNetSalary": 3800000,
    "totalDeductions": 700000,
    "byDepartment": [
      { "department": "Engineering", "grossSalary": 2000000, "headcount": 45 }
    ]
  }
}
```

---

### GET /hrms/reports/headcount

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "currentHeadcount": 120,
    "newHires": 15,
    "exits": 8,
    "netChange": 7,
    "byMonth": [
      { "month": "Jan", "hires": 2, "exits": 1, "total": 118 }
    ]
  }
}
```

---

### GET /hrms/reports/attrition

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "attritionRate": 6.5,
    "totalExits": 8,
    "voluntary": 6,
    "involuntary": 2,
    "byDepartment": [
      { "department": "Sales", "exits": 3, "rate": 10.0 }
    ],
    "byMonth": [
      { "month": "Jan", "exits": 1 }
    ]
  }
}
```

---

# 5. CRM Module

## 5.1 Dashboard

### GET /crm/dashboard

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalLeads": 250,
      "newLeadsThisMonth": 35,
      "openDeals": 45,
      "totalPipelineValue": 12500000,
      "revenueThisMonth": 1800000,
      "winRate": 32.5
    },
    "pipeline": [
      { "stage": "QUALIFICATION", "count": 15, "value": 3000000 },
      { "stage": "DEMO", "count": 10, "value": 2500000 },
      { "stage": "PROPOSAL", "count": 8, "value": 2000000 }
    ],
    "revenueByMonth": [
      { "month": "Jan", "revenue": 1500000, "target": 2000000 }
    ]
  }
}
```

---

## 5.2 Leads

### GET /crm/leads

**Query Params:**
```
page=1&limit=20&search=john&status=NEW&source=WEBSITE
&ownerId=uuid&from=2025-01-01&to=2025-12-31
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Mr",
        "firstName": "Raj",
        "lastName": "Kumar",
        "email": "raj@startup.com",
        "phone": "+919999999999",
        "company": "TechStartup Inc",
        "jobTitle": "CTO",
        "source": "WEBSITE",
        "status": "NEW",
        "score": 65,
        "tags": ["hot", "enterprise"],
        "owner": { "id": "uuid", "firstName": "Sales", "lastName": "Rep" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 250, "page": 1, "limit": 20 }
  }
}
```

---

### POST /crm/leads

**Request Body:**
```json
{
  "title": "Mr",
  "firstName": "Raj",
  "lastName": "Kumar",
  "email": "raj@startup.com",
  "phone": "+919999999999",
  "company": "TechStartup Inc",
  "jobTitle": "CTO",
  "source": "WEBSITE",
  "ownerId": "uuid",
  "notes": "Interested in HRMS module",
  "tags": ["hot"],
  "customFields": {
    "budget": "5-10L",
    "timeline": "Q2 2025"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Raj",
    "lastName": "Kumar",
    "status": "NEW",
    "score": 0,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /crm/leads/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Mr",
    "firstName": "Raj",
    "lastName": "Kumar",
    "email": "raj@startup.com",
    "phone": "+919999999999",
    "company": "TechStartup Inc",
    "jobTitle": "CTO",
    "source": "WEBSITE",
    "status": "CONTACTED",
    "score": 65,
    "notes": "Interested in HRMS module",
    "tags": ["hot", "enterprise"],
    "customFields": { "budget": "5-10L" },
    "convertedAt": null,
    "dealId": null,
    "owner": { "id": "uuid", "firstName": "Sales", "lastName": "Rep" },
    "activities": [
      {
        "id": "uuid",
        "type": "CALL",
        "subject": "Initial call",
        "outcome": "Interested, needs demo",
        "completedAt": "2025-01-02T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /crm/leads/:id

**Request Body:**
```json
{
  "status": "CONTACTED",
  "score": 70,
  "notes": "Scheduled demo for next week",
  "ownerId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "CONTACTED", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /crm/leads/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Lead deleted successfully" }
}
```

---

### PATCH /crm/leads/:id/stage

**Request Body:**
```json
{
  "status": "QUALIFIED"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "QUALIFIED", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### POST /crm/leads/:id/convert

Convert lead to deal.

**Request Body:**
```json
{
  "dealTitle": "TechStartup - HRMS License",
  "dealValue": 500000,
  "expectedCloseDate": "2025-03-31",
  "accountId": "uuid",
  "createContact": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "deal": {
      "id": "uuid",
      "title": "TechStartup - HRMS License",
      "value": 500000,
      "stage": "QUALIFICATION"
    },
    "contact": {
      "id": "uuid",
      "firstName": "Raj",
      "lastName": "Kumar"
    },
    "lead": { "id": "uuid", "status": "CONVERTED", "convertedAt": "2025-01-01T00:00:00.000Z" }
  }
}
```

---

### POST /crm/leads/:id/activity

**Request Body:**
```json
{
  "type": "CALL",
  "subject": "Follow-up call",
  "description": "Discussed pricing and implementation timeline",
  "outcome": "Positive. Will send proposal.",
  "scheduledAt": "2025-01-10T10:00:00.000Z",
  "completedAt": "2025-01-10T10:30:00.000Z",
  "assignedToId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "CALL",
    "subject": "Follow-up call",
    "createdAt": "2025-01-10T10:30:00.000Z"
  }
}
```

---

## 5.3 Contacts

### GET /crm/contacts

**Query Params:** `page=1&limit=20&search=raj&accountId=uuid&ownerId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "firstName": "Raj",
        "lastName": "Kumar",
        "email": "raj@startup.com",
        "phone": "+919999999999",
        "mobile": "+918888888888",
        "jobTitle": "CTO",
        "isPrimary": true,
        "account": { "id": "uuid", "name": "TechStartup Inc" },
        "owner": { "id": "uuid", "firstName": "Sales" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 180, "page": 1, "limit": 20 }
  }
}
```

---

### POST /crm/contacts

**Request Body:**
```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya@company.com",
  "phone": "+919999999999",
  "mobile": "+918888888888",
  "jobTitle": "CFO",
  "department": "Finance",
  "accountId": "uuid",
  "isPrimary": false,
  "address": {
    "city": "Mumbai",
    "country": "India"
  },
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/priya",
    "twitter": "@priya"
  },
  "tags": ["finance", "decision-maker"],
  "notes": "Key decision maker for finance modules",
  "ownerId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Priya",
    "lastName": "Sharma",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /crm/contacts/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya@company.com",
    "phone": "+919999999999",
    "jobTitle": "CFO",
    "isPrimary": false,
    "account": { "id": "uuid", "name": "TechStartup Inc" },
    "deals": [
      { "id": "uuid", "title": "HRMS License", "value": 500000, "stage": "PROPOSAL" }
    ],
    "activities": [],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /crm/contacts/:id

**Request Body:**
```json
{
  "jobTitle": "VP Finance",
  "phone": "+917777777777"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "jobTitle": "VP Finance", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /crm/contacts/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Contact deleted successfully" }
}
```

---

### POST /crm/contacts/merge

Merge duplicate contacts.

**Request Body:**
```json
{
  "primaryContactId": "uuid",
  "duplicateContactIds": ["uuid2", "uuid3"]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "mergedContact": { "id": "uuid", "firstName": "Priya" },
    "mergedCount": 2
  }
}
```

---

## 5.4 Accounts

### GET /crm/accounts

**Query Params:** `page=1&limit=20&search=tech&industry=Technology&ownerId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "TechStartup Inc",
        "website": "https://techstartup.com",
        "industry": "Technology",
        "size": "51-200",
        "revenue": 50000000,
        "phone": "+912233445566",
        "email": "info@techstartup.com",
        "tags": ["startup", "saas"],
        "contactCount": 3,
        "openDeals": 2,
        "owner": { "firstName": "Sales", "lastName": "Rep" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 95, "page": 1, "limit": 20 }
  }
}
```

---

### POST /crm/accounts

**Request Body:**
```json
{
  "name": "BigCorp Ltd",
  "website": "https://bigcorp.com",
  "industry": "Manufacturing",
  "size": "501-1000",
  "revenue": 500000000,
  "phone": "+911122334455",
  "email": "info@bigcorp.com",
  "address": {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  },
  "tags": ["enterprise", "manufacturing"],
  "ownerId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "BigCorp Ltd",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /crm/accounts/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "TechStartup Inc",
    "website": "https://techstartup.com",
    "industry": "Technology",
    "contacts": [
      { "id": "uuid", "firstName": "Raj", "jobTitle": "CTO", "isPrimary": true }
    ],
    "deals": [
      { "id": "uuid", "title": "HRMS License", "value": 500000, "stage": "PROPOSAL" }
    ],
    "invoices": [
      { "id": "uuid", "invoiceNumber": "INV-2025-00001", "totalAmount": 100000, "status": "PAID" }
    ]
  }
}
```

---

### PATCH /crm/accounts/:id

**Request Body:**
```json
{
  "size": "201-500",
  "revenue": 100000000
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /crm/accounts/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Account deleted successfully" }
}
```

---

## 5.5 Deals

### GET /crm/deals

**Query Params:**
```
page=1&limit=20&search=hrms&stage=PROPOSAL&status=OPEN
&accountId=uuid&ownerId=uuid&from=2025-01-01&to=2025-12-31
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "TechStartup - HRMS License",
        "value": 500000,
        "currency": "INR",
        "stage": "PROPOSAL",
        "probability": 60,
        "expectedCloseDate": "2025-03-31",
        "status": "OPEN",
        "account": { "id": "uuid", "name": "TechStartup Inc" },
        "owner": { "firstName": "Sales", "lastName": "Rep" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 45, "page": 1, "limit": 20 }
  }
}
```

---

### POST /crm/deals

**Request Body:**
```json
{
  "title": "BigCorp - ERP Implementation",
  "value": 2000000,
  "currency": "INR",
  "accountId": "uuid",
  "stage": "QUALIFICATION",
  "probability": 20,
  "expectedCloseDate": "2025-06-30",
  "ownerId": "uuid",
  "leadId": "uuid",
  "notes": "Full ERP implementation project",
  "tags": ["enterprise", "implementation"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "BigCorp - ERP Implementation",
    "value": 2000000,
    "stage": "QUALIFICATION",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /crm/deals/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "BigCorp - ERP Implementation",
    "value": 2000000,
    "stage": "PROPOSAL",
    "probability": 60,
    "expectedCloseDate": "2025-06-30",
    "status": "OPEN",
    "account": { "id": "uuid", "name": "BigCorp Ltd" },
    "contacts": [
      { "id": "uuid", "firstName": "Priya", "role": "Decision Maker" }
    ],
    "activities": [],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /crm/deals/:id

**Request Body:**
```json
{
  "value": 2500000,
  "probability": 70,
  "expectedCloseDate": "2025-07-31"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "value": 2500000, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /crm/deals/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Deal deleted successfully" }
}
```

---

### PATCH /crm/deals/:id/stage

**Request Body:**
```json
{
  "stage": "NEGOTIATION"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "stage": "NEGOTIATION", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### POST /crm/deals/:id/close-won

**Request Body:**
```json
{
  "actualCloseDate": "2025-03-15",
  "finalValue": 2300000,
  "notes": "Deal closed after final negotiation"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "WON",
    "stage": "WON",
    "actualCloseDate": "2025-03-15",
    "finalValue": 2300000
  }
}
```

---

### POST /crm/deals/:id/close-lost

**Request Body:**
```json
{
  "reason": "Budget constraints. Chose competitor.",
  "notes": "May revisit in Q3"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "LOST", "stage": "LOST" }
}
```

---

## 5.6 Pipeline

### GET /crm/pipeline

**Response 200:**
```json
{
  "success": true,
  "data": {
    "stages": [
      {
        "stage": "QUALIFICATION",
        "count": 15,
        "totalValue": 7500000,
        "deals": [
          {
            "id": "uuid",
            "title": "BigCorp - ERP",
            "value": 2000000,
            "probability": 20,
            "expectedCloseDate": "2025-06-30",
            "account": { "name": "BigCorp Ltd" },
            "position": 0
          }
        ]
      }
    ],
    "totalPipelineValue": 25000000,
    "weightedValue": 8500000
  }
}
```

---

### PATCH /crm/pipeline/reorder

**Request Body:**
```json
{
  "dealId": "uuid",
  "stage": "DEMO",
  "position": 2
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Deal reordered successfully" }
}
```

---

## 5.7 Activities

### GET /crm/activities

**Query Params:** `page=1&limit=20&type=CALL&leadId=uuid&dealId=uuid&from=2025-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "type": "CALL",
        "subject": "Follow-up call",
        "description": "Discussed pricing",
        "outcome": "Positive",
        "scheduledAt": "2025-01-10T10:00:00.000Z",
        "completedAt": "2025-01-10T10:30:00.000Z",
        "dueAt": null,
        "lead": { "id": "uuid", "firstName": "Raj" },
        "deal": null,
        "createdBy": { "firstName": "Sales", "lastName": "Rep" }
      }
    ],
    "meta": { "total": 120, "page": 1, "limit": 20 }
  }
}
```

---

### POST /crm/activities

**Request Body:**
```json
{
  "type": "MEETING",
  "subject": "Product Demo",
  "description": "Full product demo for TechStartup team",
  "scheduledAt": "2025-01-15T14:00:00.000Z",
  "dueAt": "2025-01-15T16:00:00.000Z",
  "leadId": null,
  "dealId": "uuid",
  "contactId": "uuid",
  "assignedToId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "MEETING",
    "subject": "Product Demo",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /crm/activities/:id

**Request Body:**
```json
{
  "completedAt": "2025-01-15T15:30:00.000Z",
  "outcome": "Demo successful. Client wants proposal by next week."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "completedAt": "2025-01-15T15:30:00.000Z" }
}
```

---

### DELETE /crm/activities/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Activity deleted successfully" }
}
```

---

# 6. Inventory Module

## 6.1 Products

### GET /inventory/products

**Query Params:**
```
page=1&limit=20&search=laptop&categoryId=uuid&type=PHYSICAL
&isActive=true&lowStock=true
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "MacBook Pro 14",
        "sku": "TECH-MBP-14",
        "barcode": "1234567890123",
        "unit": "pcs",
        "type": "PHYSICAL",
        "costPrice": 150000,
        "sellingPrice": 200000,
        "taxRate": 18,
        "minStockLevel": 5,
        "reorderPoint": 3,
        "isActive": true,
        "category": { "id": "uuid", "name": "Laptops" },
        "totalStock": 12,
        "images": ["https://storage.../product.jpg"],
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 150, "page": 1, "limit": 20 }
  }
}
```

---

### POST /inventory/products

**Request Body:**
```json
{
  "name": "Dell Laptop 15",
  "description": "Dell Inspiron 15 laptop",
  "sku": "TECH-DELL-15",
  "barcode": "9876543210987",
  "categoryId": "uuid",
  "unit": "pcs",
  "type": "PHYSICAL",
  "costPrice": 60000,
  "sellingPrice": 80000,
  "taxRate": 18,
  "minStockLevel": 5,
  "maxStockLevel": 50,
  "reorderPoint": 10,
  "reorderQty": 20,
  "tags": ["laptop", "dell"],
  "images": ["https://storage.../dell.jpg"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dell Laptop 15",
    "sku": "TECH-DELL-15",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /inventory/products/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dell Laptop 15",
    "sku": "TECH-DELL-15",
    "costPrice": 60000,
    "sellingPrice": 80000,
    "taxRate": 18,
    "category": { "name": "Laptops" },
    "variants": [
      {
        "id": "uuid",
        "sku": "TECH-DELL-15-8GB",
        "name": "8GB RAM",
        "attributes": { "ram": "8GB", "storage": "512GB" },
        "sellingPrice": 75000
      }
    ],
    "stockLevels": [
      {
        "warehouse": { "name": "Main Warehouse" },
        "quantity": 10,
        "reservedQty": 2
      }
    ]
  }
}
```

---

### PATCH /inventory/products/:id

**Request Body:**
```json
{
  "sellingPrice": 85000,
  "reorderPoint": 8,
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "sellingPrice": 85000, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /inventory/products/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Product deleted successfully" }
}
```

---

### GET /inventory/products/:id/stock-history

**Query Params:** `page=1&limit=20&warehouseId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "type": "PURCHASE_IN",
        "quantity": 20,
        "quantityBefore": 5,
        "quantityAfter": 25,
        "reason": "Purchase Order PO-2025-00001",
        "reference": "PO-2025-00001",
        "warehouse": { "name": "Main Warehouse" },
        "createdBy": { "firstName": "Admin" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 30, "page": 1, "limit": 20 }
  }
}
```

---

### GET /inventory/products/low-stock

**Query Params:** `warehouseId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dell Laptop 15",
      "sku": "TECH-DELL-15",
      "currentStock": 2,
      "reorderPoint": 10,
      "reorderQty": 20,
      "warehouse": { "name": "Main Warehouse" }
    }
  ]
}
```

---

## 6.2 Categories

### GET /inventory/categories

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "code": "ELEC",
      "description": "Electronic items",
      "image": null,
      "isActive": true,
      "productCount": 45,
      "children": [
        {
          "id": "uuid",
          "name": "Laptops",
          "code": "ELEC-LAP",
          "productCount": 15,
          "children": []
        }
      ]
    }
  ]
}
```

---

### POST /inventory/categories

**Request Body:**
```json
{
  "name": "Office Supplies",
  "code": "OFF-SUP",
  "description": "Office stationery and supplies",
  "parentId": null,
  "image": "https://storage.../category.jpg"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Office Supplies", "createdAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### PATCH /inventory/categories/:id

**Request Body:**
```json
{
  "name": "Office & Stationery",
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Office & Stationery", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /inventory/categories/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Category deleted successfully" }
}
```

---

## 6.3 Warehouses

### GET /inventory/warehouses

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Main Warehouse",
      "code": "WH-MAIN",
      "address": { "city": "Mumbai" },
      "isActive": true,
      "totalProducts": 150,
      "totalStockValue": 5000000
    }
  ]
}
```

---

### POST /inventory/warehouses

**Request Body:**
```json
{
  "name": "Delhi Warehouse",
  "code": "WH-DEL",
  "branchId": "uuid",
  "address": {
    "street": "Industrial Area",
    "city": "Delhi",
    "state": "Delhi",
    "country": "India",
    "zip": "110020"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Delhi Warehouse", "code": "WH-DEL" }
}
```

---

### PATCH /inventory/warehouses/:id

**Request Body:**
```json
{
  "name": "Delhi Distribution Center",
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Delhi Distribution Center" }
}
```

---

### GET /inventory/warehouses/:id/stock

**Query Params:** `page=1&limit=20&search=laptop`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "productId": "uuid",
        "product": { "name": "Dell Laptop 15", "sku": "TECH-DELL-15" },
        "quantity": 10,
        "reservedQty": 2,
        "availableQty": 8,
        "reorderPoint": 5
      }
    ],
    "meta": { "total": 150, "page": 1, "limit": 20 }
  }
}
```

---

## 6.4 Stock Management

### GET /inventory/stock

**Query Params:** `warehouseId=uuid&productId=uuid&lowStock=true`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "warehouseId": "uuid",
      "quantity": 25,
      "reservedQty": 5,
      "product": { "name": "Dell Laptop 15", "sku": "TECH-DELL-15", "reorderPoint": 10 },
      "warehouse": { "name": "Main Warehouse" },
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST /inventory/stock/adjust

**Request Body:**
```json
{
  "productId": "uuid",
  "warehouseId": "uuid",
  "type": "ADD",
  "quantity": 10,
  "movementType": "ADJUSTMENT",
  "reason": "Stock count correction",
  "reference": "AUDIT-2025-001"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "productId": "uuid",
    "warehouseId": "uuid",
    "previousQuantity": 15,
    "newQuantity": 25,
    "movement": { "id": "uuid", "type": "ADJUSTMENT", "quantity": 10 }
  }
}
```

---

### GET /inventory/stock/movements

**Query Params:** `page=1&limit=20&productId=uuid&warehouseId=uuid&type=PURCHASE_IN&from=2025-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "type": "PURCHASE_IN",
        "quantity": 20,
        "quantityBefore": 5,
        "quantityAfter": 25,
        "reason": "PO received",
        "reference": "PO-2025-00001",
        "product": { "name": "Dell Laptop", "sku": "TECH-DELL-15" },
        "warehouse": { "name": "Main Warehouse" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 500, "page": 1, "limit": 20 }
  }
}
```

---

### POST /inventory/stock/transfers

**Request Body:**
```json
{
  "fromWarehouseId": "uuid",
  "toWarehouseId": "uuid",
  "notes": "Transfer for Delhi sales",
  "items": [
    { "productId": "uuid", "quantity": 5 },
    { "productId": "uuid2", "quantity": 10 }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "DRAFT",
    "fromWarehouse": { "name": "Main Warehouse" },
    "toWarehouse": { "name": "Delhi Warehouse" },
    "itemCount": 2,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /inventory/stock/transfers

**Query Params:** `page=1&limit=20&status=DRAFT&fromWarehouseId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "status": "APPROVED",
        "fromWarehouse": { "name": "Main Warehouse" },
        "toWarehouse": { "name": "Delhi Warehouse" },
        "itemCount": 3,
        "requestedBy": { "firstName": "Stock", "lastName": "Manager" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 20, "page": 1, "limit": 20 }
  }
}
```

---

### PATCH /inventory/stock/transfers/:id/approve

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "APPROVED", "approvedBy": { "firstName": "Admin" } }
}
```

---

### PATCH /inventory/stock/transfers/:id/complete

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "RECEIVED", "completedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

# 7. Procurement Module

## 7.1 Vendors

### GET /procurement/vendors

**Query Params:** `page=1&limit=20&search=supplier&isActive=true`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "Tech Suppliers Ltd",
        "code": "VEND-001",
        "email": "sales@techsuppliers.com",
        "phone": "+911234567890",
        "website": "https://techsuppliers.com",
        "taxNumber": "GST123456",
        "paymentTerms": 30,
        "currency": "INR",
        "rating": 4.5,
        "isActive": true,
        "totalOrders": 25,
        "totalSpend": 2500000
      }
    ],
    "meta": { "total": 50, "page": 1, "limit": 20 }
  }
}
```

---

### POST /procurement/vendors

**Request Body:**
```json
{
  "name": "Office Mart Pvt Ltd",
  "code": "VEND-002",
  "email": "contact@officemart.com",
  "phone": "+919876543210",
  "website": "https://officemart.com",
  "address": {
    "street": "Industrial Area",
    "city": "Pune",
    "state": "Maharashtra",
    "country": "India",
    "zip": "411001"
  },
  "taxNumber": "GST987654",
  "paymentTerms": 45,
  "currency": "INR",
  "tags": ["office-supplies", "stationery"],
  "notes": "Preferred vendor for office supplies"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Office Mart Pvt Ltd",
    "code": "VEND-002",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /procurement/vendors/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Suppliers Ltd",
    "code": "VEND-001",
    "email": "sales@techsuppliers.com",
    "phone": "+911234567890",
    "taxNumber": "GST123456",
    "paymentTerms": 30,
    "rating": 4.5,
    "totalOrders": 25,
    "totalSpend": 2500000,
    "recentOrders": [
      { "id": "uuid", "poNumber": "PO-2025-00001", "totalAmount": 100000, "status": "RECEIVED" }
    ]
  }
}
```

---

### PATCH /procurement/vendors/:id

**Request Body:**
```json
{
  "rating": 4.0,
  "paymentTerms": 30,
  "notes": "Reliable but slow delivery"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "rating": 4.0, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /procurement/vendors/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Vendor deleted successfully" }
}
```

---

### GET /procurement/vendors/:id/purchase-history

**Query Params:** `page=1&limit=20&from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "poNumber": "PO-2025-00001",
        "orderDate": "2025-01-01",
        "totalAmount": 100000,
        "status": "RECEIVED",
        "itemCount": 3
      }
    ],
    "meta": { "total": 25, "page": 1, "limit": 20 }
  }
}
```

---

## 7.2 RFQ

### GET /procurement/rfq

**Query Params:** `page=1&limit=20&status=DRAFT&from=2025-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "rfqNumber": "RFQ-2025-00001",
        "title": "Office Laptops Q1 2025",
        "status": "QUOTES_RECEIVED",
        "deadline": "2025-01-15",
        "vendorCount": 3,
        "quotesReceived": 2,
        "createdBy": { "firstName": "Procurement" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 15, "page": 1, "limit": 20 }
  }
}
```

---

### POST /procurement/rfq

**Request Body:**
```json
{
  "title": "Office Supplies Q2 2025",
  "description": "Quarterly office supplies procurement",
  "deadline": "2025-04-10",
  "items": [
    {
      "description": "A4 Paper Ream",
      "productId": "uuid",
      "quantity": 100,
      "unit": "reams"
    },
    {
      "description": "Ball Point Pens",
      "quantity": 500,
      "unit": "pcs"
    }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rfqNumber": "RFQ-2025-00002",
    "status": "DRAFT",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /procurement/rfq/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rfqNumber": "RFQ-2025-00001",
    "title": "Office Laptops Q1 2025",
    "status": "QUOTES_RECEIVED",
    "deadline": "2025-01-15",
    "items": [
      { "id": "uuid", "description": "Dell Laptop 15", "quantity": 10, "unit": "pcs" }
    ],
    "quotes": [
      {
        "id": "uuid",
        "vendor": { "name": "Tech Suppliers Ltd" },
        "status": "SUBMITTED",
        "totalAmount": 850000,
        "validUntil": "2025-01-31"
      }
    ]
  }
}
```

---

### PATCH /procurement/rfq/:id

**Request Body:**
```json
{
  "title": "Office Laptops Q1 2025 - Updated",
  "deadline": "2025-01-20"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /procurement/rfq/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "RFQ deleted successfully" }
}
```

---

### POST /procurement/rfq/:id/send

Send RFQ to vendors.

**Request Body:**
```json
{
  "vendorIds": ["uuid1", "uuid2", "uuid3"],
  "message": "Please submit your best quote by the deadline."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rfqId": "uuid",
    "status": "SENT",
    "sentTo": 3,
    "message": "RFQ sent to 3 vendors"
  }
}
```

---

### GET /procurement/rfq/:id/quotes

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "vendor": { "name": "Tech Suppliers Ltd", "rating": 4.5 },
      "status": "SUBMITTED",
      "totalAmount": 850000,
      "validUntil": "2025-01-31",
      "terms": "Net 30",
      "items": [
        {
          "rfqItem": { "description": "Dell Laptop 15" },
          "unitPrice": 85000,
          "quantity": 10,
          "totalAmount": 850000,
          "leadTime": 7
        }
      ]
    }
  ]
}
```

---

### POST /procurement/rfq/:id/create-po

Create PO from selected quote.

**Request Body:**
```json
{
  "quoteId": "uuid",
  "deliveryAddress": {
    "street": "Main Office",
    "city": "Mumbai"
  },
  "expectedDate": "2025-01-25",
  "notes": "Urgent delivery required"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "purchaseOrderId": "uuid",
    "poNumber": "PO-2025-00001",
    "vendorId": "uuid",
    "totalAmount": 850000
  }
}
```

---

## 7.3 Purchase Orders

### GET /procurement/purchase-orders

**Query Params:** `page=1&limit=20&status=APPROVED&vendorId=uuid&from=2025-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "poNumber": "PO-2025-00001",
        "vendor": { "name": "Tech Suppliers Ltd" },
        "status": "APPROVED",
        "orderDate": "2025-01-01",
        "expectedDate": "2025-01-10",
        "totalAmount": 850000,
        "itemCount": 5,
        "createdBy": { "firstName": "Procurement" }
      }
    ],
    "meta": { "total": 30, "page": 1, "limit": 20 }
  }
}
```

---

### POST /procurement/purchase-orders

**Request Body:**
```json
{
  "vendorId": "uuid",
  "expectedDate": "2025-01-25",
  "deliveryAddress": {
    "street": "Main Office",
    "city": "Mumbai"
  },
  "items": [
    {
      "productId": "uuid",
      "description": "Dell Laptop 15",
      "quantity": 10,
      "unitPrice": 65000,
      "taxRate": 18
    }
  ],
  "notes": "Urgent order",
  "discount": 0
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "poNumber": "PO-2025-00002",
    "status": "DRAFT",
    "subtotal": 650000,
    "taxAmount": 117000,
    "totalAmount": 767000,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /procurement/purchase-orders/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "poNumber": "PO-2025-00001",
    "vendor": {
      "id": "uuid",
      "name": "Tech Suppliers Ltd",
      "email": "sales@techsuppliers.com"
    },
    "status": "APPROVED",
    "orderDate": "2025-01-01",
    "expectedDate": "2025-01-10",
    "items": [
      {
        "id": "uuid",
        "description": "Dell Laptop 15",
        "quantity": 10,
        "receivedQty": 0,
        "unitPrice": 65000,
        "taxRate": 18,
        "totalAmount": 767000,
        "product": { "name": "Dell Laptop 15", "sku": "TECH-DELL-15" }
      }
    ],
    "subtotal": 650000,
    "taxAmount": 117000,
    "totalAmount": 767000,
    "approvedBy": { "firstName": "Manager" },
    "approvedAt": "2025-01-02T00:00:00.000Z"
  }
}
```

---

### PATCH /procurement/purchase-orders/:id

**Request Body:**
```json
{
  "expectedDate": "2025-01-15",
  "notes": "Updated delivery date"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### PATCH /procurement/purchase-orders/:id/submit

Submit for approval.

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "PENDING_APPROVAL" }
}
```

---

### PATCH /procurement/purchase-orders/:id/approve

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "approvedBy": { "firstName": "Manager" },
    "approvedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /procurement/purchase-orders/:id/reject

**Request Body:**
```json
{
  "reason": "Budget exceeded for this quarter"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "DRAFT" }
}
```

---

### PATCH /procurement/purchase-orders/:id/cancel

**Request Body:**
```json
{
  "reason": "Vendor not available"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "CANCELLED" }
}
```

---

### POST /procurement/purchase-orders/:id/receipt

Create goods receipt.

**Request Body:**
```json
{
  "warehouseId": "uuid",
  "receivedAt": "2025-01-10T14:00:00.000Z",
  "notes": "All items received in good condition",
  "items": [
    {
      "poItemId": "uuid",
      "quantity": 8
    }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "grNumber": "GR-2025-00001",
    "status": "PARTIALLY_RECEIVED",
    "receivedAt": "2025-01-10T14:00:00.000Z"
  }
}
```

---

### GET /procurement/purchase-orders/:id/receipts

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "grNumber": "GR-2025-00001",
      "receivedAt": "2025-01-10T14:00:00.000Z",
      "warehouse": { "name": "Main Warehouse" },
      "items": [
        { "poItem": { "description": "Dell Laptop 15" }, "quantity": 8 }
      ]
    }
  ]
}
```

---

### GET /procurement/purchase-orders/export

**Query Params:** `format=xlsx&from=2025-01-01&to=2025-12-31&status=RECEIVED`

**Response:** Binary file download

---

# 8. Finance Module

## 8.1 Invoices

### GET /finance/invoices

**Query Params:**
```
page=1&limit=20&type=SALES&status=SENT&accountId=uuid
&from=2025-01-01&to=2025-12-31&search=INV-2025
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "invoiceNumber": "INV-2025-00001",
        "type": "SALES",
        "status": "SENT",
        "issueDate": "2025-01-01",
        "dueDate": "2025-01-31",
        "totalAmount": 500000,
        "paidAmount": 0,
        "balanceDue": 500000,
        "currency": "INR",
        "account": { "name": "TechStartup Inc" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 80, "page": 1, "limit": 20 }
  }
}
```

---

### POST /finance/invoices

**Request Body:**
```json
{
  "type": "SALES",
  "accountId": "uuid",
  "issueDate": "2025-01-01",
  "dueDate": "2025-01-31",
  "currency": "INR",
  "discount": 0,
  "notes": "Thank you for your business",
  "termsAndConditions": "Payment due within 30 days",
  "items": [
    {
      "productId": "uuid",
      "description": "HRMS License - Annual",
      "quantity": 1,
      "unitPrice": 120000,
      "taxRate": 18,
      "discount": 0
    },
    {
      "description": "Implementation Services",
      "quantity": 40,
      "unitPrice": 3000,
      "taxRate": 18
    }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-2025-00001",
    "subtotal": 240000,
    "taxAmount": 43200,
    "totalAmount": 283200,
    "balanceDue": 283200,
    "status": "DRAFT",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /finance/invoices/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-2025-00001",
    "type": "SALES",
    "status": "SENT",
    "issueDate": "2025-01-01",
    "dueDate": "2025-01-31",
    "account": { "id": "uuid", "name": "TechStartup Inc", "email": "billing@techstartup.com" },
    "items": [
      {
        "id": "uuid",
        "description": "HRMS License - Annual",
        "quantity": 1,
        "unitPrice": 120000,
        "taxRate": 18,
        "totalAmount": 141600
      }
    ],
    "subtotal": 240000,
    "taxAmount": 43200,
    "discount": 0,
    "totalAmount": 283200,
    "paidAmount": 100000,
    "balanceDue": 183200,
    "payments": [
      {
        "id": "uuid",
        "amount": 100000,
        "method": "BANK_TRANSFER",
        "paidAt": "2025-01-10T00:00:00.000Z"
      }
    ],
    "sentAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /finance/invoices/:id

**Request Body:**
```json
{
  "dueDate": "2025-02-28",
  "notes": "Extended payment terms"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "dueDate": "2025-02-28", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /finance/invoices/:id

Void invoice.

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "CANCELLED", "cancelledAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### POST /finance/invoices/:id/send

Email invoice to client.

**Request Body:**
```json
{
  "to": "billing@techstartup.com",
  "cc": ["cto@techstartup.com"],
  "subject": "Invoice INV-2025-00001",
  "message": "Please find attached invoice for your reference."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "SENT", "sentAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### POST /finance/invoices/:id/payment

Record payment.

**Request Body:**
```json
{
  "amount": 150000,
  "method": "BANK_TRANSFER",
  "reference": "NEFT-1234567890",
  "paidAt": "2025-01-15T00:00:00.000Z",
  "notes": "Partial payment received"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "uuid",
    "paidAmount": 250000,
    "balanceDue": 33200,
    "status": "PARTIALLY_PAID",
    "payment": {
      "id": "uuid",
      "amount": 150000,
      "method": "BANK_TRANSFER",
      "paidAt": "2025-01-15T00:00:00.000Z"
    }
  }
}
```

---

### GET /finance/invoices/:id/pdf

Download invoice as PDF.

**Response:** Binary PDF file download

---

### GET /finance/invoices/:id/payments

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 100000,
      "method": "BANK_TRANSFER",
      "reference": "NEFT-1234567890",
      "notes": "First payment",
      "paidAt": "2025-01-10T00:00:00.000Z",
      "createdBy": { "firstName": "Finance", "lastName": "Admin" }
    }
  ]
}
```

---

### GET /finance/invoices/export

**Query Params:** `format=xlsx&from=2025-01-01&to=2025-12-31&status=PAID`

**Response:** Binary file download

---

## 8.2 Expenses

### GET /finance/expenses

**Query Params:** `page=1&limit=20&status=PENDING&employeeId=uuid&category=Travel&from=2025-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Flight to Delhi - Sales Meeting",
        "category": "Travel",
        "amount": 12000,
        "currency": "INR",
        "date": "2025-01-10",
        "receipt": "https://storage.../receipt.jpg",
        "status": "PENDING",
        "employee": { "firstName": "John", "employeeCode": "EMP00001" },
        "createdAt": "2025-01-10T00:00:00.000Z"
      }
    ],
    "meta": { "total": 45, "page": 1, "limit": 20 }
  }
}
```

---

### POST /finance/expenses

**Request Body:**
```json
{
  "title": "Hotel - Delhi Trip",
  "category": "Accommodation",
  "amount": 8000,
  "currency": "INR",
  "date": "2025-01-10",
  "receipt": "https://storage.../hotel_receipt.jpg",
  "notes": "2 nights stay for client meeting"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Hotel - Delhi Trip",
    "amount": 8000,
    "status": "PENDING",
    "createdAt": "2025-01-10T00:00:00.000Z"
  }
}
```

---

### GET /finance/expenses/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Hotel - Delhi Trip",
    "category": "Accommodation",
    "amount": 8000,
    "date": "2025-01-10",
    "receipt": "https://storage.../hotel_receipt.jpg",
    "status": "APPROVED",
    "notes": "2 nights stay",
    "employee": { "firstName": "John", "employeeCode": "EMP00001" },
    "approvedBy": { "firstName": "Manager" },
    "approvedAt": "2025-01-11T00:00:00.000Z"
  }
}
```

---

### PATCH /finance/expenses/:id

**Request Body:**
```json
{
  "amount": 7500,
  "notes": "Updated after final bill"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "amount": 7500, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /finance/expenses/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Expense deleted successfully" }
}
```

---

### PATCH /finance/expenses/:id/approve

**Request Body:**
```json
{
  "notes": "Approved as per travel policy"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "APPROVED", "approvedAt": "2025-01-11T00:00:00.000Z" }
}
```

---

### PATCH /finance/expenses/:id/reject

**Request Body:**
```json
{
  "notes": "Receipt not valid. Please resubmit."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "REJECTED", "rejectedAt": "2025-01-11T00:00:00.000Z" }
}
```

---

### POST /finance/expenses/:id/receipt

Upload receipt (OCR auto-fill).

**Request:** `multipart/form-data` — field: `file` (image/jpeg or image/png)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "receiptUrl": "https://storage.../receipt.jpg",
    "extracted": {
      "vendor": "Taj Hotels",
      "amount": 8000,
      "date": "2025-01-10",
      "gstNumber": "GST123456"
    }
  }
}
```

---

## 8.3 Payments

### GET /finance/payments

**Query Params:** `page=1&limit=20&invoiceId=uuid&method=BANK_TRANSFER&from=2025-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "amount": 100000,
        "currency": "INR",
        "method": "BANK_TRANSFER",
        "reference": "NEFT-1234567890",
        "paidAt": "2025-01-10T00:00:00.000Z",
        "invoice": { "invoiceNumber": "INV-2025-00001" },
        "createdBy": { "firstName": "Finance" }
      }
    ],
    "meta": { "total": 60, "page": 1, "limit": 20 }
  }
}
```

---

### GET /finance/payments/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 100000,
    "currency": "INR",
    "method": "BANK_TRANSFER",
    "reference": "NEFT-1234567890",
    "notes": "First payment",
    "paidAt": "2025-01-10T00:00:00.000Z",
    "invoice": {
      "id": "uuid",
      "invoiceNumber": "INV-2025-00001",
      "totalAmount": 283200,
      "account": { "name": "TechStartup Inc" }
    }
  }
}
```

---

## 8.4 Finance Reports

### GET /finance/reports/profit-loss

**Query Params:** `from=2025-01-01&to=2025-12-31&period=monthly`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period": "2025",
    "revenue": 15000000,
    "expenses": 8000000,
    "grossProfit": 7000000,
    "netProfit": 5500000,
    "profitMargin": 36.7,
    "byMonth": [
      {
        "month": "Jan",
        "revenue": 1500000,
        "expenses": 800000,
        "profit": 700000
      }
    ]
  }
}
```

---

### GET /finance/reports/balance-sheet

**Query Params:** `asOf=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "asOf": "2025-12-31",
    "assets": {
      "current": {
        "cash": 2000000,
        "accountsReceivable": 1500000,
        "inventory": 3000000,
        "total": 6500000
      },
      "fixed": { "total": 5000000 },
      "total": 11500000
    },
    "liabilities": {
      "current": {
        "accountsPayable": 800000,
        "total": 800000
      },
      "total": 800000
    },
    "equity": { "total": 10700000 }
  }
}
```

---

### GET /finance/reports/cash-flow

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "openingBalance": 500000,
    "inflows": 15000000,
    "outflows": 12000000,
    "closingBalance": 3500000,
    "byMonth": [
      { "month": "Jan", "inflows": 1200000, "outflows": 900000, "net": 300000 }
    ]
  }
}
```

---

### GET /finance/reports/tax-report

**Query Params:** `from=2025-01-01&to=2025-03-31&type=GST`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period": "Q1 2025",
    "totalSales": 5000000,
    "totalTaxCollected": 900000,
    "totalPurchases": 2000000,
    "totalTaxPaid": 360000,
    "netTaxPayable": 540000,
    "breakdown": [
      { "rate": 18, "sales": 4000000, "taxCollected": 720000 },
      { "rate": 12, "sales": 1000000, "taxCollected": 120000 }
    ]
  }
}
```

---

### GET /finance/reports/ar-aging

Accounts Receivable Aging.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalOutstanding": 3000000,
    "current": { "amount": 1200000, "count": 8 },
    "overdue_1_30": { "amount": 800000, "count": 5 },
    "overdue_31_60": { "amount": 600000, "count": 3 },
    "overdue_61_90": { "amount": 250000, "count": 2 },
    "overdue_90_plus": { "amount": 150000, "count": 1 },
    "byClient": [
      {
        "account": "TechStartup Inc",
        "total": 500000,
        "overdue_1_30": 300000,
        "oldest_invoice": "2024-11-01"
      }
    ]
  }
}
```

---

### GET /finance/reports/ap-aging

Accounts Payable Aging.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalPayable": 800000,
    "current": { "amount": 500000, "count": 5 },
    "overdue_1_30": { "amount": 200000, "count": 2 },
    "overdue_31_plus": { "amount": 100000, "count": 1 }
  }
}
```

---

### POST /finance/reports/schedule

Schedule email report.

**Request Body:**
```json
{
  "reportType": "profit-loss",
  "frequency": "MONTHLY",
  "dayOfMonth": 1,
  "recipients": ["cfo@acme.com", "ceo@acme.com"],
  "format": "xlsx"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reportType": "profit-loss",
    "frequency": "MONTHLY",
    "nextRunAt": "2025-02-01T00:00:00.000Z"
  }
}
```

---

## 8.5 Budgets

### GET /finance/budgets

**Query Params:** `year=2025&month=1&department=Engineering`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Q1 Marketing Budget",
      "year": 2025,
      "month": null,
      "department": "Marketing",
      "category": "Marketing",
      "amount": 500000,
      "spent": 320000,
      "remaining": 180000,
      "utilizationPercent": 64.0
    }
  ]
}
```

---

### POST /finance/budgets

**Request Body:**
```json
{
  "name": "Q2 Operations Budget",
  "year": 2025,
  "month": null,
  "department": "Operations",
  "category": "Operations",
  "amount": 800000
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Q2 Operations Budget",
    "amount": 800000,
    "spent": 0,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /finance/budgets/:id

**Request Body:**
```json
{
  "amount": 900000,
  "name": "Q2 Operations Budget - Revised"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "amount": 900000, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /finance/budgets/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Budget deleted successfully" }
}
```

---

### GET /finance/budgets/vs-actual

**Query Params:** `year=2025&department=Engineering`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "budget": {
        "name": "Engineering Budget",
        "amount": 2000000
      },
      "actual": {
        "spent": 1500000
      },
      "variance": 500000,
      "variancePercent": 25.0,
      "status": "UNDER_BUDGET"
    }
  ]
}
```

---

# 9. Projects Module

## 9.1 Projects

### GET /projects

**Query Params:** `page=1&limit=20&status=ACTIVE&ownerId=uuid&search=website`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "Website Redesign 2025",
        "code": "PROJ-001",
        "status": "ACTIVE",
        "priority": "HIGH",
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "budget": 500000,
        "completionPercent": 35,
        "owner": { "firstName": "PM", "lastName": "Lead" },
        "memberCount": 6,
        "openTaskCount": 24,
        "tags": ["design", "frontend"],
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 20, "page": 1, "limit": 20 }
  }
}
```

---

### POST /projects

**Request Body:**
```json
{
  "name": "Mobile App Development",
  "code": "PROJ-002",
  "description": "Develop iOS and Android apps for AI Business OS",
  "status": "PLANNING",
  "priority": "HIGH",
  "startDate": "2025-02-01",
  "endDate": "2025-06-30",
  "budget": 1500000,
  "clientId": "uuid",
  "tags": ["mobile", "react-native"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mobile App Development",
    "code": "PROJ-002",
    "status": "PLANNING",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /projects/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Website Redesign 2025",
    "code": "PROJ-001",
    "description": "Complete redesign of company website",
    "status": "ACTIVE",
    "priority": "HIGH",
    "startDate": "2025-01-01",
    "endDate": "2025-03-31",
    "budget": 500000,
    "completionPercent": 35,
    "owner": { "id": "uuid", "firstName": "PM Lead" },
    "members": [
      { "userId": "uuid", "firstName": "Dev", "role": "DEVELOPER", "joinedAt": "2025-01-01" }
    ],
    "milestones": [
      { "id": "uuid", "name": "Design Complete", "dueDate": "2025-01-31", "status": "COMPLETED" }
    ],
    "taskStats": { "total": 40, "todo": 16, "inProgress": 8, "done": 16 },
    "loggedHours": 245,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /projects/:id

**Request Body:**
```json
{
  "status": "ACTIVE",
  "endDate": "2025-04-30",
  "budget": 600000
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "ACTIVE", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /projects/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Project deleted successfully" }
}
```

---

### POST /projects/:id/members

**Request Body:**
```json
{
  "userId": "uuid",
  "role": "DEVELOPER"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "userId": "uuid",
    "role": "DEVELOPER",
    "joinedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### DELETE /projects/:id/members/:userId

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Member removed from project" }
}
```

---

## 9.2 Tasks

### GET /projects/:id/tasks

**Query Params:** `status=TODO&assigneeId=uuid&priority=HIGH&milestoneId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Design login page",
      "description": "Create new login page design",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "position": 0,
      "dueDate": "2025-01-15",
      "estimatedHours": 8,
      "loggedHours": 3.5,
      "assignee": { "id": "uuid", "firstName": "Designer" },
      "milestone": { "id": "uuid", "name": "Design Complete" },
      "subTaskCount": 3,
      "commentCount": 5,
      "tags": ["design", "ui"],
      "createdAt": "2025-01-05T00:00:00.000Z"
    }
  ]
}
```

---

### POST /projects/:id/tasks

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "JWT-based auth with refresh tokens",
  "status": "TODO",
  "priority": "HIGH",
  "assigneeId": "uuid",
  "milestoneId": "uuid",
  "parentTaskId": null,
  "dueDate": "2025-01-20",
  "estimatedHours": 16,
  "tags": ["backend", "auth"],
  "attachments": []
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Implement user authentication",
    "status": "TODO",
    "priority": "HIGH",
    "createdAt": "2025-01-05T00:00:00.000Z"
  }
}
```

---

### GET /projects/tasks/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Implement user authentication",
    "description": "JWT-based auth with refresh tokens",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2025-01-20",
    "estimatedHours": 16,
    "loggedHours": 8,
    "assignee": { "id": "uuid", "firstName": "Backend Dev" },
    "reporter": { "id": "uuid", "firstName": "PM Lead" },
    "milestone": { "name": "Phase 1" },
    "subTasks": [
      { "id": "uuid", "title": "Setup JWT", "status": "DONE" }
    ],
    "comments": [],
    "timesheets": [
      { "userId": "uuid", "date": "2025-01-10", "hours": 4, "description": "Setup completed" }
    ],
    "project": { "id": "uuid", "name": "Website Redesign 2025" }
  }
}
```

---

### PATCH /projects/tasks/:id

**Request Body:**
```json
{
  "status": "REVIEW",
  "loggedHours": 12,
  "assigneeId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "REVIEW", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /projects/tasks/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

---

### PATCH /projects/tasks/:id/move

Kanban move.

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "position": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "IN_PROGRESS", "position": 1 }
}
```

---

### POST /projects/tasks/:id/time

Log time to task.

**Request Body:**
```json
{
  "projectId": "uuid",
  "date": "2025-01-10",
  "hours": 4.5,
  "description": "Implemented refresh token logic",
  "isBillable": true
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "hours": 4.5,
    "date": "2025-01-10",
    "task": { "title": "Implement user authentication", "loggedHours": 12.5 }
  }
}
```

---

### POST /projects/tasks/:id/comment

**Request Body:**
```json
{
  "content": "PR raised for review. Please check by EOD."
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "PR raised for review. Please check by EOD.",
    "user": { "firstName": "Backend Dev" },
    "createdAt": "2025-01-10T00:00:00.000Z"
  }
}
```

---

### GET /projects/tasks/:id/comments

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "PR raised for review. Please check by EOD.",
      "user": { "id": "uuid", "firstName": "Backend Dev", "avatar": null },
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

---

## 9.3 Milestones

### GET /projects/:id/milestones

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Design Phase Complete",
      "description": "All designs approved",
      "status": "COMPLETED",
      "dueDate": "2025-01-31",
      "completedAt": "2025-01-28T00:00:00.000Z",
      "taskCount": 10,
      "completedTaskCount": 10
    }
  ]
}
```

---

### POST /projects/:id/milestones

**Request Body:**
```json
{
  "name": "Development Phase Complete",
  "description": "All features developed and unit tested",
  "dueDate": "2025-03-15"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Development Phase Complete",
    "status": "PENDING",
    "dueDate": "2025-03-15",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /projects/milestones/:id

**Request Body:**
```json
{
  "dueDate": "2025-03-31",
  "status": "IN_PROGRESS"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "dueDate": "2025-03-31", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /projects/milestones/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Milestone deleted successfully" }
}
```

---

## 9.4 Timesheets

### GET /projects/timesheets

**Query Params:** `page=1&limit=20&projectId=uuid&userId=uuid&from=2025-01-01&to=2025-01-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "date": "2025-01-10",
        "hours": 4.5,
        "description": "Auth implementation",
        "isBillable": true,
        "project": { "name": "Website Redesign 2025" },
        "task": { "title": "Implement authentication" },
        "user": { "firstName": "Backend Dev" }
      }
    ],
    "meta": { "total": 80, "page": 1, "limit": 20 },
    "totalHours": 245,
    "billableHours": 220
  }
}
```

---

### GET /projects/:id/timesheets

**Query Params:** `userId=uuid&from=2025-01-01&to=2025-01-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "project": { "name": "Website Redesign 2025", "budget": 500000 },
    "totalHours": 245,
    "billableHours": 220,
    "byMember": [
      { "user": "Backend Dev", "hours": 80, "billableHours": 75 }
    ],
    "byWeek": [
      { "week": "Jan W1", "hours": 65 }
    ]
  }
}
```

---

### POST /projects/timesheets

**Request Body:**
```json
{
  "projectId": "uuid",
  "taskId": "uuid",
  "date": "2025-01-10",
  "hours": 6,
  "description": "API development and testing",
  "isBillable": true
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "hours": 6,
    "date": "2025-01-10",
    "createdAt": "2025-01-10T00:00:00.000Z"
  }
}
```

---

## 9.5 Project Reports

### GET /projects/:id/reports/summary

**Response 200:**
```json
{
  "success": true,
  "data": {
    "project": { "name": "Website Redesign 2025", "status": "ACTIVE" },
    "progress": {
      "completionPercent": 35,
      "tasksTotal": 40,
      "tasksDone": 14,
      "milestonesTotal": 4,
      "milestonesDone": 1
    },
    "timeline": {
      "startDate": "2025-01-01",
      "endDate": "2025-03-31",
      "daysTotal": 90,
      "daysElapsed": 31,
      "daysRemaining": 59,
      "isOnTrack": true
    },
    "budget": {
      "allocated": 500000,
      "spent": 175000,
      "remaining": 325000,
      "burnRate": 5645
    },
    "team": { "total": 6, "activeThisWeek": 5 }
  }
}
```

---

# 10. Support Module

## 10.1 Tickets

### GET /support/tickets

**Query Params:**
```
page=1&limit=20&status=OPEN&priority=HIGH&categoryId=uuid
&assigneeId=uuid&reporterId=uuid&from=2025-01-01
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "ticketNumber": "TKT-2025-00001",
        "title": "Cannot login to the system",
        "status": "OPEN",
        "priority": "HIGH",
        "category": { "name": "Technical", "color": "#FF5733" },
        "reporter": { "firstName": "John", "lastName": "Doe" },
        "assignee": null,
        "slaDeadline": "2025-01-02T08:00:00.000Z",
        "firstResponseAt": null,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 55, "page": 1, "limit": 20 }
  }
}
```

---

### POST /support/tickets

**Request Body:**
```json
{
  "title": "Attendance not syncing",
  "description": "My attendance is not showing for last week. I have checked in/out but the records are missing.",
  "priority": "MEDIUM",
  "categoryId": "uuid",
  "tags": ["attendance", "sync"],
  "attachments": ["https://storage.../screenshot.png"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticketNumber": "TKT-2025-00002",
    "status": "OPEN",
    "priority": "MEDIUM",
    "slaDeadline": "2025-01-03T00:00:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /support/tickets/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticketNumber": "TKT-2025-00001",
    "title": "Cannot login to the system",
    "description": "Login page shows error 401 for all users.",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "category": { "name": "Technical", "slaHours": 4 },
    "reporter": { "id": "uuid", "firstName": "John", "email": "john@acme.com" },
    "assignee": { "id": "uuid", "firstName": "Support", "lastName": "Agent" },
    "tags": ["auth", "critical"],
    "attachments": ["https://storage.../error.png"],
    "slaDeadline": "2025-01-02T08:00:00.000Z",
    "firstResponseAt": "2025-01-01T09:00:00.000Z",
    "replies": [
      {
        "id": "uuid",
        "content": "We are investigating the issue.",
        "isInternal": false,
        "user": { "firstName": "Support Agent" },
        "createdAt": "2025-01-01T09:00:00.000Z"
      }
    ],
    "activities": [
      {
        "action": "status_changed",
        "from": "OPEN",
        "to": "IN_PROGRESS",
        "user": { "firstName": "Support Agent" },
        "createdAt": "2025-01-01T08:30:00.000Z"
      }
    ]
  }
}
```

---

### PATCH /support/tickets/:id

**Request Body:**
```json
{
  "priority": "CRITICAL",
  "tags": ["auth", "critical", "escalated"]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "priority": "CRITICAL", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /support/tickets/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Ticket deleted successfully" }
}
```

---

### POST /support/tickets/:id/reply

**Request Body:**
```json
{
  "content": "The issue has been identified. A fix is being deployed. ETA: 2 hours.",
  "isInternal": false,
  "attachments": []
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "The issue has been identified. A fix is being deployed.",
    "isInternal": false,
    "user": { "firstName": "Support Agent" },
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### PATCH /support/tickets/:id/assign

**Request Body:**
```json
{
  "assigneeId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignee": { "id": "uuid", "firstName": "Support Agent" },
    "status": "ASSIGNED"
  }
}
```

---

### PATCH /support/tickets/:id/status

**Request Body:**
```json
{
  "status": "RESOLVED",
  "resolution": "Fixed server configuration issue"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "RESOLVED", "resolvedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### PATCH /support/tickets/:id/priority

**Request Body:**
```json
{
  "priority": "CRITICAL"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "priority": "CRITICAL" }
}
```

---

### POST /support/tickets/:id/close

**Request Body:**
```json
{
  "resolution": "Issue resolved. Server restarted and configuration updated."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "CLOSED", "closedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### GET /support/tickets/:id/ai-summary

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": "Login failure reported by multiple users due to JWT token expiration issue. Support agent identified server config problem. Fix deployed and verified.",
    "keyPoints": [
      "Affected: All users",
      "Root cause: JWT secret rotation",
      "Resolution: Config updated and server restarted"
    ],
    "sentiment": "RESOLVED",
    "timeToResolve": "4h 30m"
  }
}
```

---

## 10.2 Ticket Categories

### GET /support/categories

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Technical",
      "description": "Technical issues",
      "color": "#FF5733",
      "slaHours": 4,
      "isActive": true,
      "ticketCount": 120
    }
  ]
}
```

---

### POST /support/categories

**Request Body:**
```json
{
  "name": "Billing",
  "description": "Billing and payment issues",
  "color": "#3498DB",
  "slaHours": 24
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Billing", "createdAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### PATCH /support/categories/:id

**Request Body:**
```json
{
  "slaHours": 12,
  "color": "#2ECC71"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "slaHours": 12, "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /support/categories/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Category deleted successfully" }
}
```

---

## 10.3 Support Reports

### GET /support/reports/summary

**Query Params:** `from=2025-01-01&to=2025-01-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalTickets": 120,
    "openTickets": 25,
    "resolvedTickets": 80,
    "closedTickets": 15,
    "avgResolutionTimeHours": 6.5,
    "avgFirstResponseTimeHours": 1.2,
    "customerSatisfaction": 4.2,
    "byPriority": [
      { "priority": "HIGH", "count": 15, "resolved": 12 }
    ],
    "byCategory": [
      { "category": "Technical", "count": 45, "resolved": 38 }
    ]
  }
}
```

---

### GET /support/reports/sla

**Query Params:** `from=2025-01-01&to=2025-01-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalTickets": 120,
    "withinSla": 98,
    "breachedSla": 22,
    "slaComplianceRate": 81.7,
    "byCategory": [
      { "category": "Technical", "compliance": 90.0 }
    ],
    "byAgent": [
      { "agent": "Support Agent A", "assigned": 40, "withinSla": 36, "compliance": 90.0 }
    ]
  }
}
```

---

### GET /support/reports/agent-perf

**Query Params:** `from=2025-01-01&to=2025-01-31`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "agent": { "id": "uuid", "firstName": "Support", "lastName": "Agent A" },
      "assigned": 40,
      "resolved": 35,
      "avgResolutionHours": 5.2,
      "avgFirstResponseHours": 0.8,
      "slaCompliance": 92.5,
      "satisfaction": 4.5
    }
  ]
}
```

---

# 11. Documents Module

## 11.1 Folders

### GET /documents/folders

Get root folders.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Company Policies",
      "description": "All company policy documents",
      "parentId": null,
      "documentCount": 12,
      "subFolderCount": 3,
      "createdBy": { "firstName": "Admin" },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /documents/folders/:id

Get folder contents.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "folder": {
      "id": "uuid",
      "name": "Company Policies",
      "path": "Company Policies"
    },
    "subFolders": [
      { "id": "uuid", "name": "HR Policies", "documentCount": 5 }
    ],
    "documents": [
      {
        "id": "uuid",
        "name": "Employee Handbook 2025.pdf",
        "fileSize": 2048000,
        "mimeType": "application/pdf",
        "extension": "pdf",
        "tags": ["hr", "policy"],
        "version": 2,
        "uploadedBy": { "firstName": "HR Admin" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /documents/folders

**Request Body:**
```json
{
  "name": "Legal Documents",
  "description": "Legal contracts and agreements",
  "parentId": null
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Legal Documents", "createdAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### PATCH /documents/folders/:id

**Request Body:**
```json
{
  "name": "Legal & Compliance",
  "description": "Updated description"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Legal & Compliance", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /documents/folders/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Folder deleted successfully" }
}
```

---

## 11.2 Documents

### GET /documents

**Query Params:** `page=1&limit=20&folderId=uuid&search=policy&tags=hr`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "Employee Handbook 2025.pdf",
        "description": "Annual employee handbook",
        "fileUrl": "https://storage.../handbook.pdf",
        "fileSize": 2048000,
        "mimeType": "application/pdf",
        "extension": "pdf",
        "tags": ["hr", "policy"],
        "isShared": false,
        "version": 2,
        "folder": { "name": "HR Policies" },
        "uploadedBy": { "firstName": "HR Admin" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 80, "page": 1, "limit": 20 }
  }
}
```

---

### POST /documents

Upload a file (multipart/form-data).

**Request:** `multipart/form-data`
- `file`: the file (max 50MB)
- `name`: display name
- `folderId`: folder UUID (optional)
- `description`: string (optional)
- `tags`: comma-separated string

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Q1 Report 2025.xlsx",
    "fileUrl": "https://storage.../q1-report.xlsx",
    "fileSize": 512000,
    "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "extension": "xlsx",
    "version": 1,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /documents/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Employee Handbook 2025.pdf",
    "description": "Annual employee handbook",
    "fileUrl": "https://storage.../handbook.pdf",
    "fileSize": 2048000,
    "mimeType": "application/pdf",
    "tags": ["hr", "policy"],
    "isShared": true,
    "shareToken": "abc123xyz",
    "version": 2,
    "folder": { "id": "uuid", "name": "HR Policies" },
    "uploadedBy": { "firstName": "HR Admin" },
    "sharedWith": [
      { "user": { "firstName": "Manager" }, "access": "VIEW" }
    ]
  }
}
```

---

### PATCH /documents/:id

**Request Body:**
```json
{
  "name": "Employee Handbook 2025 v2.pdf",
  "description": "Updated version",
  "tags": ["hr", "policy", "2025"]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Employee Handbook 2025 v2.pdf", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /documents/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Document deleted successfully" }
}
```

---

### GET /documents/:id/download

**Response:** Binary file download (signed URL redirect)

---

### POST /documents/:id/share

**Request Body:**
```json
{
  "userIds": ["uuid1", "uuid2"],
  "access": "VIEW",
  "generateLink": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "sharedWith": 2,
    "shareLink": "https://app.yourdomain.com/shared/abc123xyz",
    "shareToken": "abc123xyz"
  }
}
```

---

### GET /documents/:id/versions

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "version": 2,
      "fileUrl": "https://storage.../handbook_v2.pdf",
      "fileSize": 2048000,
      "createdBy": { "firstName": "HR Admin" },
      "createdAt": "2025-01-15T00:00:00.000Z"
    },
    {
      "id": "uuid2",
      "version": 1,
      "fileUrl": "https://storage.../handbook_v1.pdf",
      "fileSize": 1900000,
      "createdBy": { "firstName": "HR Admin" },
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST /documents/:id/restore/:version

Restore to previous version.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "version": 3,
    "restoredFrom": 1,
    "message": "Restored to version 1"
  }
}
```

---

### GET /documents/search

**Query Params:** `q=employee+policy&folderId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Employee Handbook 2025.pdf",
      "extension": "pdf",
      "folder": { "name": "HR Policies" },
      "tags": ["hr", "policy"],
      "score": 0.95
    }
  ]
}
```

---

# 12. Analytics Module

## GET /analytics/overview

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "revenue": 15000000,
    "expenses": 8000000,
    "profit": 7000000,
    "profitMargin": 46.7,
    "newEmployees": 15,
    "totalEmployees": 120,
    "newLeads": 250,
    "dealsWon": 35,
    "openTickets": 25,
    "trends": {
      "revenue": { "change": 12.5, "direction": "UP" },
      "employees": { "change": 14.3, "direction": "UP" },
      "leads": { "change": -5.2, "direction": "DOWN" }
    }
  }
}
```

---

## GET /analytics/revenue

**Query Params:** `period=monthly&from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "period": "Jan 2025",
      "revenue": 1200000,
      "expenses": 700000,
      "profit": 500000,
      "invoiceCount": 15
    }
  ]
}
```

---

## GET /analytics/hrms

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "headcount": { "current": 120, "change": 14.3 },
    "attrition": { "rate": 6.5, "change": -1.2 },
    "attendance": { "rate": 91.3, "change": 2.1 },
    "pendingLeaves": 8,
    "headcountByDept": [
      { "department": "Engineering", "count": 45 }
    ],
    "attendanceTrend": [
      { "month": "Jan", "rate": 90.5 }
    ]
  }
}
```

---

## GET /analytics/crm

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 250,
    "qualifiedLeads": 120,
    "dealsCreated": 60,
    "dealsWon": 35,
    "dealsLost": 15,
    "winRate": 58.3,
    "avgDealValue": 850000,
    "totalRevenue": 29750000,
    "pipelineByStage": [
      { "stage": "QUALIFICATION", "count": 15, "value": 3000000 }
    ],
    "leadsBySource": [
      { "source": "WEBSITE", "count": 80, "percentage": 32 }
    ],
    "conversionFunnel": [
      { "stage": "Leads", "count": 250 },
      { "stage": "Qualified", "count": 120 },
      { "stage": "Demo", "count": 75 },
      { "stage": "Won", "count": 35 }
    ]
  }
}
```

---

## GET /analytics/inventory

**Query Params:** `warehouseId=uuid`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "totalStockValue": 8500000,
    "lowStockItems": 12,
    "outOfStockItems": 3,
    "topMovingProducts": [
      { "product": "Dell Laptop 15", "movements": 45, "value": 2700000 }
    ],
    "stockValueByCategory": [
      { "category": "Electronics", "value": 5000000 }
    ],
    "stockTrend": [
      { "month": "Jan", "in": 500000, "out": 300000, "net": 200000 }
    ]
  }
}
```

---

## GET /analytics/support

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalTickets": 450,
    "openTickets": 25,
    "resolvedTickets": 380,
    "avgResolutionHours": 6.5,
    "slaComplianceRate": 88.5,
    "satisfactionScore": 4.3,
    "ticketsByPriority": [
      { "priority": "HIGH", "count": 45 }
    ],
    "volumeTrend": [
      { "month": "Jan", "created": 45, "resolved": 40 }
    ]
  }
}
```

---

## GET /analytics/finance

**Query Params:** `from=2025-01-01&to=2025-12-31`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000000,
    "totalExpenses": 8000000,
    "netProfit": 7000000,
    "profitMargin": 46.7,
    "outstandingAR": 3000000,
    "outstandingAP": 800000,
    "cashBalance": 3500000,
    "revenueByMonth": [
      { "month": "Jan", "revenue": 1200000, "expenses": 700000 }
    ],
    "topExpenseCategories": [
      { "category": "Salaries", "amount": 5000000, "percentage": 62.5 }
    ]
  }
}
```

---

## POST /analytics/ai-insights

**Request Body:**
```json
{
  "module": "crm",
  "data": {
    "winRate": 32.5,
    "avgDealValue": 850000,
    "pipelineValue": 25000000
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "insights": [
      "Win rate of 32.5% is below industry average of 45%. Focus on improving demo-to-proposal conversion.",
      "Pipeline value has grown 15% MoM. Accelerate qualification to maintain momentum.",
      "Top 3 deals account for 40% of pipeline. Diversify to reduce risk."
    ],
    "generatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## POST /analytics/schedule-report

**Request Body:**
```json
{
  "reportType": "business-overview",
  "frequency": "WEEKLY",
  "dayOfWeek": "MONDAY",
  "time": "08:00",
  "recipients": ["ceo@acme.com"],
  "format": "pdf",
  "modules": ["hrms", "crm", "finance"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nextRunAt": "2025-01-06T08:00:00.000Z",
    "message": "Report scheduled successfully"
  }
}
```

---

# 13. Settings Module

## 13.1 Roles & Permissions

### GET /settings/roles

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Admin",
      "description": "Full system access",
      "isSystem": true,
      "userCount": 3,
      "permissions": [
        { "module": "hrms", "action": "create", "scope": "company" }
      ],
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST /settings/roles

**Request Body:**
```json
{
  "name": "HR Manager",
  "description": "HR module full access",
  "permissions": [
    { "module": "hrms", "action": "create", "scope": "company" },
    { "module": "hrms", "action": "read", "scope": "company" },
    { "module": "hrms", "action": "update", "scope": "company" },
    { "module": "hrms", "action": "delete", "scope": "company" },
    { "module": "hrms", "action": "export", "scope": "company" }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "HR Manager",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET /settings/roles/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "HR Manager",
    "description": "HR module full access",
    "isSystem": false,
    "userCount": 2,
    "permissions": [
      { "id": "uuid", "module": "hrms", "action": "create", "scope": "company" }
    ]
  }
}
```

---

### PATCH /settings/roles/:id

**Request Body:**
```json
{
  "description": "HR and Payroll full access",
  "permissions": [
    { "module": "hrms", "action": "create", "scope": "company" },
    { "module": "hrms", "action": "approve", "scope": "company" }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "HR Manager", "updatedAt": "2025-01-01T00:00:00.000Z" }
}
```

---

### DELETE /settings/roles/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Role deleted successfully" }
}
```

**Error 422:**
```json
{
  "success": false,
  "message": "Cannot delete role with active users"
}
```

---

### GET /settings/permissions

All available permissions.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "module": "hrms",
      "actions": [
        { "id": "uuid", "action": "create", "scope": "company", "description": "Create employees" },
        { "id": "uuid", "action": "read", "scope": "company", "description": "View employees" },
        { "id": "uuid", "action": "update", "scope": "company", "description": "Update employees" },
        { "id": "uuid", "action": "delete", "scope": "company", "description": "Delete employees" },
        { "id": "uuid", "action": "export", "scope": "company", "description": "Export employee data" },
        { "id": "uuid", "action": "approve", "scope": "company", "description": "Approve leave requests" }
      ]
    },
    {
      "module": "crm",
      "actions": [
        { "id": "uuid", "action": "create", "scope": "company" },
        { "id": "uuid", "action": "read", "scope": "own" }
      ]
    }
  ]
}
```

---

## 13.2 Email Settings

### GET /settings/email

**Response 200:**
```json
{
  "success": true,
  "data": {
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": true,
      "user": "noreply@acme.com",
      "from": "AI Business OS <noreply@acme.com>"
    },
    "isConfigured": true,
    "lastTestedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /settings/email

**Request Body:**
```json
{
  "host": "smtp.sendgrid.net",
  "port": 587,
  "secure": true,
  "user": "apikey",
  "pass": "SG.xxxxx",
  "from": "AI Business OS <noreply@acme.com>"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Email settings updated successfully" }
}
```

---

### POST /settings/email/test

Send test email.

**Request Body:**
```json
{
  "to": "admin@acme.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Test email sent successfully" }
}
```

---

### GET /settings/email/templates

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "type": "welcome",
      "name": "Welcome Email",
      "subject": "Welcome to AI Business OS",
      "isCustomized": false
    },
    {
      "type": "leave_approved",
      "name": "Leave Approval",
      "subject": "Your leave request has been approved",
      "isCustomized": true
    }
  ]
}
```

---

### PATCH /settings/email/templates/:type

**Request Body:**
```json
{
  "subject": "Welcome to {{companyName}}!",
  "body": "<h1>Hi {{firstName}},</h1><p>Welcome to our platform.</p>"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "type": "welcome", "message": "Template updated successfully" }
}
```

---

## 13.3 Integrations

### GET /settings/integrations

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "type": "slack",
      "name": "Slack",
      "description": "Send notifications to Slack",
      "isConnected": true,
      "connectedAt": "2025-01-01T00:00:00.000Z",
      "config": { "channel": "#notifications" }
    },
    {
      "type": "google",
      "name": "Google Workspace",
      "isConnected": false
    },
    {
      "type": "zapier",
      "name": "Zapier",
      "isConnected": false
    }
  ]
}
```

---

### POST /settings/integrations/:type/connect

**Request Body (Slack example):**
```json
{
  "webhookUrl": "https://hooks.slack.com/services/xxx/yyy/zzz",
  "channel": "#notifications"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "type": "slack", "isConnected": true, "message": "Slack connected successfully" }
}
```

---

### DELETE /settings/integrations/:type/disconnect

**Response 200:**
```json
{
  "success": true,
  "data": { "type": "slack", "message": "Slack disconnected successfully" }
}
```

---

## 13.4 API Keys

### GET /settings/api-keys

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Production API Key",
      "keyPreview": "sk-...abc123",
      "lastUsedAt": "2025-01-01T00:00:00.000Z",
      "createdAt": "2024-06-01T00:00:00.000Z",
      "expiresAt": null
    }
  ]
}
```

---

### POST /settings/api-keys

**Request Body:**
```json
{
  "name": "Mobile App Key",
  "expiresAt": null,
  "permissions": ["hrms:read", "crm:read"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mobile App Key",
    "key": "sk-live-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "message": "Save this key now. It will not be shown again."
  }
}
```

---

### DELETE /settings/api-keys/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "API key revoked successfully" }
}
```

---

## 13.5 Audit Logs

### GET /settings/audit-logs

**Query Params:**
```
page=1&limit=20&userId=uuid&module=hrms&action=DELETE
&from=2025-01-01&to=2025-01-31&entityType=employee
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "action": "UPDATE",
        "module": "hrms",
        "entityType": "employee",
        "entityId": "uuid",
        "oldValues": { "status": "ACTIVE" },
        "newValues": { "status": "INACTIVE" },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "user": { "firstName": "Admin", "email": "admin@acme.com" },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "total": 1200, "page": 1, "limit": 20 }
  }
}
```

---

### GET /settings/audit-logs/export

**Query Params:** `format=xlsx&from=2025-01-01&to=2025-01-31`

**Response:** Binary file download

---

## 13.6 Billing

### GET /settings/billing/plan

**Response 200:**
```json
{
  "success": true,
  "data": {
    "currentPlan": "PROFESSIONAL",
    "status": "ACTIVE",
    "billingCycle": "MONTHLY",
    "amount": 9999,
    "currency": "INR",
    "nextBillingDate": "2025-02-01",
    "features": {
      "maxUsers": 50,
      "modules": ["hrms", "crm", "finance", "inventory", "projects"],
      "storage": "50GB",
      "aiCredits": 10000
    }
  }
}
```

---

### GET /settings/billing/usage

**Response 200:**
```json
{
  "success": true,
  "data": {
    "users": { "used": 32, "limit": 50 },
    "storage": { "used": 12.5, "limit": 50, "unit": "GB" },
    "aiCredits": { "used": 3500, "limit": 10000 },
    "apiCalls": { "used": 45000, "limit": 100000 }
  }
}
```

---

### GET /settings/billing/invoices

**Query Params:** `page=1&limit=12`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "invoiceNumber": "BILL-2025-001",
        "amount": 9999,
        "currency": "INR",
        "status": "PAID",
        "period": "January 2025",
        "paidAt": "2025-01-01T00:00:00.000Z",
        "downloadUrl": "https://billing.../invoice.pdf"
      }
    ],
    "meta": { "total": 12, "page": 1, "limit": 12 }
  }
}
```

---

### POST /settings/billing/upgrade

**Request Body:**
```json
{
  "plan": "ENTERPRISE",
  "billingCycle": "ANNUAL"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://payment.../checkout/session_xxx",
    "message": "Redirecting to payment page"
  }
}
```

---

# 14. Notifications Module

## GET /notifications

**Query Params:** `page=1&limit=20&isRead=false&type=leave_request_approved`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "type": "leave_request_approved",
        "title": "Leave Approved",
        "message": "Your leave request for Jan 10-12 has been approved.",
        "link": "/hrms/leave/uuid",
        "isRead": false,
        "metadata": { "leaveId": "uuid", "approvedBy": "Manager Name" },
        "createdAt": "2025-01-05T00:00:00.000Z"
      }
    ],
    "meta": { "total": 25, "page": 1, "limit": 20 },
    "unreadCount": 8
  }
}
```

---

## PATCH /notifications/:id/read

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", "isRead": true, "readAt": "2025-01-05T10:00:00.000Z" }
}
```

---

## PATCH /notifications/read-all

**Response 200:**
```json
{
  "success": true,
  "data": { "updatedCount": 8, "message": "All notifications marked as read" }
}
```

---

## DELETE /notifications/:id

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Notification deleted" }
}
```

---

## GET /notifications/unread-count

**Response 200:**
```json
{
  "success": true,
  "data": { "unreadCount": 8 }
}
```

---

# 15. AI Module

## POST /ai/chat

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Show me employees who have pending leave requests" }
  ],
  "context": "hrms",
  "stream": false
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "response": "There are currently 8 employees with pending leave requests: John Doe (EMP001, 3 days), Jane Smith (EMP002, 1 day)...",
    "tokens": 245
  }
}
```

---

## POST /ai/insights

**Request Body:**
```json
{
  "module": "finance",
  "data": {
    "revenue": 15000000,
    "expenses": 8000000,
    "byMonth": [
      { "month": "Jan", "revenue": 1200000 }
    ]
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "insights": [
      "Revenue grew 12% YoY. Q4 shows strongest performance.",
      "Expense ratio at 53% — 5% above target. Review operational costs.",
      "Profit margin improved to 46.7% from 38.2% last year."
    ]
  }
}
```

---

## POST /ai/summarize

**Request Body:**
```json
{
  "entityType": "ticket",
  "entityId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": "Login failure reported Jan 1 due to JWT expiry. Support resolved in 4.5hrs by restarting auth service.",
    "keyPoints": ["Auth failure", "4.5hr resolution", "No data loss"]
  }
}
```

---

## POST /ai/generate-email

**Request Body:**
```json
{
  "type": "follow_up",
  "recipient": "Raj Kumar, CTO at TechStartup",
  "subject": "Proposal Follow-up",
  "keyPoints": ["Demo was well-received", "Custom pricing available", "Limited time offer"],
  "tone": "professional"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "email": "Dear Raj,\n\nThank you for your time during our product demo last week. I'm glad the team found it valuable...\n\nBest regards"
  }
}
```

---

## POST /ai/extract-document

Extract data from document (OCR).

**Request:** `multipart/form-data` — field: `file` (image/jpeg or application/pdf)

Also accepts: `documentType` (invoice | receipt | resume | contract)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "extracted": {
      "vendor": "Office Mart",
      "invoiceNumber": "OM-2025-1234",
      "date": "2025-01-10",
      "amount": 15000,
      "taxAmount": 2700,
      "items": [
        { "description": "A4 Paper", "quantity": 50, "unitPrice": 300 }
      ]
    },
    "confidence": 0.95
  }
}
```

---

## POST /ai/forecast

**Request Body:**
```json
{
  "label": "monthly_revenue",
  "historicalData": [1200000, 1350000, 1100000, 1450000, 1300000, 1500000],
  "periods": 3
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "forecast": [1520000, 1580000, 1650000],
    "confidence": 0.82,
    "trend": "UPWARD"
  }
}
```

---

## POST /ai/parse-resume

**Request:** `multipart/form-data` — field: `file` (application/pdf)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999",
    "skills": ["JavaScript", "TypeScript", "NestJS", "React"],
    "experience": [
      {
        "company": "TechCorp",
        "role": "Senior Developer",
        "from": "2021-01",
        "to": "2024-12",
        "years": 4
      }
    ],
    "education": [
      {
        "institution": "IIT Bombay",
        "degree": "B.Tech Computer Science",
        "year": 2021
      }
    ],
    "totalExperience": 4
  }
}
```

---

*AI Business OS — Full API Documentation v1.0.0*
*Total APIs: ~500+ | All modules covered with Request Body and Response examples*
