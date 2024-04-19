import { Provide } from "./index";
import LogFactory from "./log-factory.class";

export default class LogDefault implements LogFactory {
  @Provide
  createLogger(): LogFactory {
    return new LogDefault();
  }

  log(message: any, ...optionalParams: any[]): any {
    console.log("message: " + message, ...optionalParams);
  }
}
