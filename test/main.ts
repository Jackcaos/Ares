import { App, Inject } from "../src";
import { ServerFactory } from "../src/factory/server-factory.class";
import Logger from "../src/factory/log-factory.class";

@App
class Main {
  @Inject private server: ServerFactory;

  @Inject public logger: Logger;
  public main() {
    this.server.start(8080);
    this.logger.info("server start");
  }
}
