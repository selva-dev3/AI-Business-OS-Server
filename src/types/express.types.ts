import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  companyId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
  companyId: string;
}

export interface PaginatedQuery {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  [key: string]: unknown;
}

export interface SearchQuery {
  search?: string;
  fields?: string[];
}

export interface IdParam {
  id: string;
}

export interface CompanyIdParam {
  companyId: string;
}

export interface RunIdParam {
  runId: string;
}

export interface EmployeeIdParam {
  employeeId: string;
}
