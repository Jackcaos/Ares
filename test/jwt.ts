import { Request, Response, NextFunction } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt";
import * as jwt from "jsonwebtoken";
import { Provide, Config } from "../src/index";
import AuthenticationFactory from "../src/factory/authentication-factory.class";

class jwtAuthentication extends AuthenticationFactory {
  @Config("jwt")
  public jwtConfig:
    | {
        secret: jwt.Secret;
        algorithms: jwt.Algorithm[];
        ignore: string[];
      }
    | undefined;

  @Provide
  public createJwtAuthentication(): AuthenticationFactory {
    return new jwtAuthentication();
  }

  public async preHandle(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("this.jwtConfig", this.jwtConfig);
    if (!this.jwtConfig.ignore.includes(req.path)) {
      const jwtMiddleware = expressjwt(this.jwtConfig);
      jwtMiddleware(req, res, (err) => {
        if (err) {
          next(err);
          return res.send({
            code: 401,
            err: "权限未认证",
          });
        }
        // checkUser TODO
      });
    }
    next();
  }
}
