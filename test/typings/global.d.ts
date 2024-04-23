import "express-session";

declare module "express-session" {
  export interface SessionData {
    view: any;
    [key: string]: any;
  }
}
