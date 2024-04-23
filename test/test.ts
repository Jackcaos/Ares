import { Request, Response } from "express";
import { Inject } from "../src";
import Logger from "../src/factory/log-factory.class";
import { Get, reqQuery } from "../src/web/route-mapping.decorator";
import { Controller } from "../src/app.decorator";

@Controller("/tttt")
export default class Test {
  @Inject private logger: Logger;

  @Get("/test")
  public getUser(req: Request, res: Response) {
    return "test";
  }
}
