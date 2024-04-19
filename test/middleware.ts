import { NextFunction, Request, Response } from "express";
import MiddlewareFactory from "../src/middleware-factory.class";
import { Middleware } from "../src/middleware.decorator";

@Middleware
export default class timeMiddleware extends MiddlewareFactory {
  run() {
    console.log("run middleware");
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      console.log("timeMiddleware in", start);
      next();
      console.log("timeMiddleware count", Date.now() - start);
    };
  }
}
