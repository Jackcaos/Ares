import * as express from "express";
import { Provide } from "../index";
import { loadRouter } from "./route-mapping.decorator";
import ServerFactory from "../factory/server-factory.class";

export default class ExpressServer extends ServerFactory {
  public static customMiddleware = [];

  @Provide
  public getServer(): ServerFactory {
    return new ExpressServer();
  }

  public static setCustomMiddleware(middleware: any): void {
    ExpressServer.customMiddleware.push(middleware);
  }

  private setDefaultMiddleware(middleware: any): void {
    this.defaultMiddleware.push(middleware);
  }

  public start(port: number) {
    const app: express.Application = express();

    const middlewareLists = this.defaultMiddleware.concat(ExpressServer.customMiddleware);

    middlewareLists.forEach((middleware) => {
      app.use(middleware);
    });

    loadRouter(app);

    app.listen(port, () => {
      console.log("server start at port " + port);
    });
  }
}
