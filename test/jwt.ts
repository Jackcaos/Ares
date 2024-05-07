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

  public preHandle(req: Request, res: Response, next: NextFunction): void {
    console.log("this.jwtConfig", this.jwtConfig);
    if (!this.jwtConfig.ignore.includes(req.path)) {
      const jwtMiddleware = expressjwt(this.jwtConfig);
      jwtMiddleware(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // checkUser TODO
      });
    }
    next();
  }
}
