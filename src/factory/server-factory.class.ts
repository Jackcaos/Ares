import { IMiddleware } from "../interface/server";

abstract class ServerFactory {
  protected defaultMiddleware: Array<any> = [];

  public abstract start(port: number);
}

abstract class MiddlewareFactory {
  public abstract use(): IMiddleware;
}

export { ServerFactory, MiddlewareFactory };
