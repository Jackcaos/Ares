import { Request, Response, NextFunction } from "express";

type IMiddleware = (req: Request, res: Response, next: NextFunction) => any;

// 请求方式
enum EMethod {
  "GET" = "get",
  "POST" = "post",
  "PUT" = "put",
  "DEL" = "del",
  "ALL" = "all",
}

interface IController {
  // 控制类器
  name: string;
  // 构造函数
  constructor: Function;
  // 路由统一前缀
  prefix: string;
  // 控制器层面的中间件
  middleware?: IMiddleware[];
  // aop回调
  lifecycle?: {
    before: (...args) => any;
    after: (...args) => any;
  };
  // 路由回调函数映射
  router?: {
    [key: string]: IRouteOptions;
  };
  // 参数映射
  params?: {
    [key: string]: any;
  };
}

interface IRouteOptions {
  // 唯一key
  uniqueKey: string;
  // 请求方式
  method: EMethod;
  // 请求路径
  path: string;
  // 路由回调
  callback?: (req: Request, res: Response, next: NextFunction) => any;
  // 参数数量
  paramsCount?: number;
  // 路由级别的中间件
  middlewares?: IMiddleware[];
}

export { IMiddleware, IController, IRouteOptions, EMethod };
