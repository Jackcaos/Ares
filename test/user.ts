import { Request, Response } from "express";
import { Inject, Config } from "../src";
import Logger from "../src/factory/log-factory.class";
import { Get, reqQuery } from "../src/web/route-mapping.decorator";
import { Controller } from "../src";
import { IServerConfig } from "../src/interface/config";

@Controller("/user")
export default class User {
  @Inject private logger: Logger;

  // @Config("server") private serverConfig: IServerConfig;

  @Get("/")
  public getUser(req: Request, res: Response, @reqQuery("aaa") aaa: number) {
    // console.log("this.serverConfig", this.serverConfig);
    this.logger.info("req", ["123123"], req.query, aaa);
    // this.logger.info("serverConfig", this.serverConfig.port);
    res.cookie("name", "zzz");
    return "hello world";
  }

  @Get("/login")
  public postUser(req: Request, res: Response) {
    console.log("req.cookies", req.cookies);
    const cookieName = req.cookies;
    return {
      cookieName,
    };
  }
}
