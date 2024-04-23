import { NextFunction, Request, Response } from "express";

type IMiddlewareResponse = (req: Request, res: Response, next: NextFunction) => any;

export default abstract class MiddlewareFactory {
  public abstract use(): IMiddlewareResponse;
}
