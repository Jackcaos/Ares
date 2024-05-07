import { Request, Response, NextFunction } from "express";

export default abstract class AuthenticationFactory {
  public preHandle(req: Request, res: Response, next: NextFunction): void {
    next();
  }

  public afterCompletion(req: Request, res: Response, next: NextFunction): void {
    next();
  }
}
