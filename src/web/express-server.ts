import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as expressSession from "express-session";
import { ICookie, ISession } from "../interface/config";
import { Config, Provide, Inject } from "../index";
import { loadRouter } from "./route-mapping.decorator";
import { ServerFactory } from "../factory/server-factory.class";
import AuthenticationFactory from "../factory/authentication-factory.class";

export default class ExpressServer extends ServerFactory {
  public static customMiddleware = [];

  @Config("cookie") private cookie: ICookie | undefined;

  @Config("session") private session: ISession | undefined;

  @Inject public authentication: AuthenticationFactory;

  @Provide
  public getServer(): ServerFactory {
    return new ExpressServer();
  }

  public static setCustomMiddleware(middleware: any): void {
    ExpressServer.customMiddleware.push(middleware);
  }

  private setDefaultMiddleware(): void {
    if (this.cookie) {
      console.log(this.cookie.secrets);
      this.defaultMiddleware.push(
        cookieParser(this.cookie.secrets || "", this.cookie.options || {}),
      );
    }

    if (this.session) {
      console.log("session", this.session);
      this.defaultMiddleware.push(expressSession(this.session));
    }
  }

  public start(port: number) {
    const app: express.Application = express();

    this.setDefaultMiddleware();
    const middlewareLists = this.defaultMiddleware.concat(ExpressServer.customMiddleware);

    // 前置拦截器
    app.use(async (req, res, next) => {
      this.authentication.preHandle.apply(this.authentication, [req, res, next]);
    });

    middlewareLists.forEach((middleware) => {
      app.use(middleware);
    });

    loadRouter(app);

    // 后置拦截器
    app.use((req, res, next) => {
      this.authentication.afterCompletion.apply(this.authentication, [req, res, next]);
    });

    app.listen(port, () => {
      console.log("server start at port " + port);
    });
  }
}
