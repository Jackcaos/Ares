import * as winston from "winston";
import { Provide } from "../index";
import LogFactory from "../factory/log-factory.class";

export default class LogDefault implements LogFactory {
  private logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.splat(),
      winston.format.printf(
        (info) => `[${info.timestamp}] ${`[${info.level}]`.padEnd(7)} ${info.message}`,
      ),
    ),
    transports: [
      // 添加一个控制台输出的传输器
      new winston.transports.Console(),
    ],
  });

  @Provide
  createLogger(): LogFactory {
    return new LogDefault();
  }

  info(...optionalParams: any[]): any {
    this.logger.info(this.combineArgs(optionalParams));
  }

  private combineArgs(args: Array<any>) {
    return args.reduce((str, arg) => {
      if (arg === null) {
        str += "null ";
      } else if (arg === undefined) {
        str += "undefined ";
      } else if (typeof arg === "object") {
        str += JSON.stringify(arg) + " ";
      } else {
        str += arg.toString() + " ";
      }
      return str;
    }, "");
  }
}
