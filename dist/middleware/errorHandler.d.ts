import { Request, Response, NextFunction } from 'express';
declare const errorHandler: (err: Error, req: Request, res: Response, _next: NextFunction) => void;
declare const notFoundHandler: (req: Request, res: Response) => void;
export { errorHandler, notFoundHandler };
//# sourceMappingURL=errorHandler.d.ts.map