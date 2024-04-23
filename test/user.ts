import { Request, Response } from "express";
import { Inject } from "../src";
import Logger from "../src/factory/log-factory.class";
import { Get, reqQuery } from "../src/web/route-mapping.decorator";
import { Controller } from "../src/app.decorator";

@Controller("/aaa")
export default class User {
  @Inject private logger: Logger;

  @Get("/user")
  public getUser(req: Request, res: Response, @reqQuery("aaa") aaa: number) {
    this.logger.info("req", ["123123"], req.query, aaa);
    return "hello world";
  }

  @Get("/login")
  public postUser(req: Request, res: Response) {
    return "login!";
  }
}
