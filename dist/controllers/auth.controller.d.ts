import { Request, Response, NextFunction } from 'express';
export declare const register: (req: Request, res: Response, next: NextFunction) => void;
export declare const login: (req: Request, res: Response, next: NextFunction) => void;
export declare const refreshToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const logout: (req: Request, res: Response, next: NextFunction) => void;
export declare const forgotPassword: (req: Request, res: Response, next: NextFunction) => void;
export declare const resetPassword: (req: Request, res: Response, next: NextFunction) => void;
export declare const getMe: (req: Request, res: Response, next: NextFunction) => void;
export declare const changePassword: (req: Request, res: Response, next: NextFunction) => void;
export declare const enable2FA: (req: Request, res: Response, next: NextFunction) => void;
export declare const verify2FA: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map