import { Request, Response } from "express";
import { Inject } from "../src";
import Logger from "../src/log-factory.class";
import { Get } from "../src/route-mapping.decorator";

export default class User {
  @Inject private logger: Logger;

  @Get("/user")
  public getUser(req: Request, res: Response) {
    // console.log("this", this);
    this.logger.info("path is " + req.url);
    return res.end("hello world");
  }

  @Get("/login")
  public postUser(req: Request, res: Response) {
    return res.end("login!");
  }
}
