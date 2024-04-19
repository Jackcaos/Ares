import * as winston from "winston";
// import { combine, timestamp, json } from "winston";
import { Provide } from "./index";
import LogFactory from "./log-factory.class";

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

  info(message: any, ...optionalParams: any[]): any {
    this.logger.info(message);
  }
}
