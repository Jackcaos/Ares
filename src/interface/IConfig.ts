import cookieParser from "cookie-parser";
import session from "express-session";

interface IServerConfig {
  host: string;
  port: number;
}

interface ICookie {
  secrets?: string | string[];
  options?: cookieParser.CookieParseOptions;
}

type ISession = session.SessionOptions;

export { IServerConfig, ICookie, ISession };
