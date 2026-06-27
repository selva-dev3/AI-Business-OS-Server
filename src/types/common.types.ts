export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';

export type AttendanceSource = 'APP' | 'MANUAL' | 'BIOMETRIC';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type HolidayType = 'PUBLIC' | 'RESTRICTED' | 'OPTIONAL';

export type PayrollStatus = 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'DISQUALIFIED';

export type LeadSource = 'WEBSITE' | 'REFERRAL' | 'SOCIAL' | 'EMAIL' | 'CALL' | 'OTHER';

export type DealStage = 'QUALIFICATION' | 'DEMO' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export type DealStatus = 'OPEN' | 'WON' | 'LOST';

export type CompanyPlan = 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';

export type PermissionScope = 'ALL' | 'DEPARTMENT' | 'OWN';
