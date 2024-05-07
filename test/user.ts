import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Inject, Config } from "../src";
import Logger from "../src/factory/log-factory.class";
import { Get, reqQuery } from "../src/web/route-mapping.decorator";
import { Controller } from "../src";
import { IServerConfig } from "../src/interface/config";

@Controller("/user")
export default class User {
  @Inject private logger: Logger;

  @Config("jwt")
  private jwtConfig: {
    secret: jwt.Secret;
    algorithms: jwt.Algorithm;
    ignore: string[];
  };

  @Get("/")
  public async getUser(req: Request, res: Response, @reqQuery("aaa") aaa: number) {
    // console.log("this.serverConfig", this.serverConfig);
    this.logger.info("req", ["123123"], req.query, aaa);
    // this.logger.info("serverConfig", this.serverConfig.port);
    // res.cookie("name", "zzz");
    // console.log("res", res);
    return "hello world";
  }

  @Get("/login")
  public postUser(req: Request, res: Response) {
    const payload = {
      username: "user123",
      role: "admin",
    };
    const token = jwt.sign(payload, this.jwtConfig.secret, {
      algorithm: "HS256",
    });
    console.log("token", token);
    return token;
  }
}
