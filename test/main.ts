import { App, Inject } from "../src";
import Logger from "../src/log-factory.class";

@App
class Main {
  @Inject public logger: Logger;

  public main() {
    this.logger.log("this is start");
  }
}
