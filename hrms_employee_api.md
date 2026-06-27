# HRMS — Employee API Endpoints

## Employee master

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/{id}` | Get employee by ID |
| PUT | `/api/employees/{id}` | Update full profile |
| PATCH | `/api/employees/{id}` | Partial update |
| DELETE | `/api/employees/{id}` | Deactivate employee |
| GET | `/api/employees/{id}/profile` | Get personal info |
| PATCH | `/api/employees/{id}/profile` | Update personal info |

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/checkin` | Mark check-in |
| POST | `/api/attendance/checkout` | Mark check-out |
| GET | `/api/attendance/{employee_id}` | Get attendance log |
| POST | `/api/attendance/regularize` | Regularization request |
| PATCH | `/api/attendance/regularize/{id}` | Approve / reject regularization |
| GET | `/api/attendance/report` | Monthly attendance report |

---

## Leave management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves/types` | Leave type list |
| GET | `/api/leaves/balance/{employee_id}` | Leave balance |
| POST | `/api/leaves/apply` | Apply for leave |
| GET | `/api/leaves/{id}` | Leave request detail |
| PATCH | `/api/leaves/{id}/approve` | Approve leave |
| PATCH | `/api/leaves/{id}/reject` | Reject leave |
| DELETE | `/api/leaves/{id}` | Cancel leave |

---

## Payroll

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payroll/{employee_id}` | Salary details |
| GET | `/api/payroll/{employee_id}/payslips` | All payslips |
| GET | `/api/payroll/payslip/{month}/{year}` | Specific month payslip |
| POST | `/api/payroll/run` | Run payroll |
| GET | `/api/payroll/{employee_id}/tax` | Tax details |
| GET | `/api/payroll/{employee_id}/deductions` | Deductions list |

---

## Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/{employee_id}` | List documents |
| POST | `/api/documents/upload` | Upload document |
| GET | `/api/documents/{doc_id}/download` | Download file |
| POST | `/api/documents/request-letter` | Request letter (experience, salary, etc.) |
| DELETE | `/api/documents/{doc_id}` | Delete document |

---

## Performance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/performance/{employee_id}/goals` | List goals |
| POST | `/api/performance/goals` | Create goal |
| PATCH | `/api/performance/goals/{id}` | Update goal |
| POST | `/api/performance/appraisal` | Submit appraisal |
| GET | `/api/performance/appraisal/{employee_id}` | Get appraisal history |
| POST | `/api/performance/feedback` | Submit feedback |

---

## Training

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/training/courses` | Available courses |
| POST | `/api/training/enroll` | Enroll in course |
| PATCH | `/api/training/{enrollment_id}/complete` | Mark course complete |
| GET | `/api/training/{employee_id}/history` | Training history |
| GET | `/api/training/{employee_id}/certifications` | Certifications |

---

## Transfer & promotion

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transfers` | Raise transfer request |
| PATCH | `/api/transfers/{id}/approve` | Approve transfer |
| POST | `/api/promotions` | Create promotion |
| GET | `/api/employees/{id}/history` | Role / department history |

---

## Exit / offboarding

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/exit/resign` | Submit resignation |
| GET | `/api/exit/{employee_id}/checklist` | Exit checklist |
| PATCH | `/api/exit/{employee_id}/clearance` | Department clearance update |
| GET | `/api/exit/{employee_id}/fnf` | Full & final settlement |
| PATCH | `/api/employees/{id}/status` | Activate / deactivate employee |

---

## HTTP method legend

| Method | Purpose |
|--------|---------|
| GET | Fetch / read data |
| POST | Create new record |
| PUT | Full update |
| PATCH | Partial update |
| DELETE | Remove / deactivate |
