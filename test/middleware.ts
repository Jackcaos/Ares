import { NextFunction, Request, Response } from "express";
import MiddlewareFactory from "../src/factory/middleware-factory.class";
import { Middleware } from "../src/web/middleware.decorator";

@Middleware()
export default class timeMiddleware extends MiddlewareFactory {
  use() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      console.log("timeMiddleware in", start);
      next();
      console.log("timeMiddleware count", Date.now() - start);
    };
  }
}
