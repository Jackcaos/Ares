import { Application, Request, Response, NextFunction } from "express";
import { getController } from "../app.decorator";

const routerMapper = {
  get: {},
  post: {},
  put: {},
  del: {},
  all: {},
};

const methodArr = ["get", "post", "put", "del", "all"];

enum EMethod {
  "GET" = "get",
  "POST" = "post",
  "PUT" = "put",
  "DEL" = "del",
  "ALL" = "all",
}

const routerParams = {};

function Get(path: string) {
  return mapperFunction(EMethod.GET, path);
}

function Post(path: string) {
  return mapperFunction(EMethod.POST, path);
}

function Put(path: string) {
  return mapperFunction(EMethod.PUT, path);
}

function Del(path: string) {
  return mapperFunction(EMethod.DEL, path);
}

function All(path: string) {
  return mapperFunction(EMethod.ALL, path);
}

function reqBody(target: any, propertyKey: string, parameterIndex: number) {
  const key = [target.constructor.name, propertyKey, parameterIndex].join(".");
  routerParams[key] = (req, res, next) => req.body;
}

function reqQuery(queryName?: string) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const key = [target.constructor.name, propertyKey, parameterIndex].join(".");
    routerParams[key] = (req, res, next) => (queryName ? req.query[queryName] : req.query);
  };
}

function reqParam(paramsName?: string) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const key = [target.constructor.name, propertyKey, parameterIndex].join(".");
    routerParams[key] = (req, res, next) => (paramsName ? req.params[paramsName] : req.params);
  };
}

function loadRouter(app: Application) {
  for (const methodKey in methodArr) {
    const method = methodArr[methodKey];
    const routerMapFunc = routerMapper[method];
    for (const router in routerMapFunc) {
      app[method](router, (req: Request, res: Response, next: NextFunction) =>
        routerMapFunc[router].invoker(req, res, next),
      );
    }
  }
}

function mapperFunction(method: EMethod, path: string) {
  return (target: any, propertyKey: string) => {
    console.log(target.constructor);
    // const prefix = originalController.prefix === "/" ? "" : originalController.prefix;
    // const realPath = prefix + path;
    routerMapper[method][path] = {
      path: path,
      invoker: async (req, res, next) => {
        const originalController = getController(target.constructor);
        const component = originalController.constructor;
        try {
          const totalParams = component[propertyKey].length;
          // express 回调函数的常规参数
          const args = [req, res, next];
          if (totalParams > 0) {
            for (let index = 0; index < totalParams; index++) {
              const routerParamsKey = [target.constructor.name, propertyKey, index].join(".");
              if (routerParams[routerParamsKey]) {
                args[index] = routerParams[routerParamsKey](req, res, next);
              }
            }
          }
          const result = component[propertyKey].apply(component, [...args]);
          if (typeof result === "object") {
            return res.json(result);
          } else {
            return res.send(result);
          }
        } catch (err) {
          next(err);
        }
      },
    };
  };
}

export { loadRouter, Get, Post, Put, Del, All, reqBody, reqQuery, reqParam };
