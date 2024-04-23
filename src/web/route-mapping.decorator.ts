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
const totalOriginalMethodParams = {};

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

function reqHeaders(headerKey?: string) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const key = [target.constructor.name, propertyKey, parameterIndex].join(".");
    routerParams[key] = (req, res, next) => (headerKey ? req.headers[headerKey] : req.headers);
  };
}

function loadRouter(app: Application) {
  for (const methodKey in methodArr) {
    const method = methodArr[methodKey];
    const routerMapFunc = routerMapper[method];
    for (const route in routerMapFunc) {
      const controller = getController(routerMapFunc[route].constructor);
      const prefix = controller.prefix;
      const realRoute = prefix === "/" ? route : prefix + route;
      console.log("realRoute", realRoute);
      app[method](realRoute, (req: Request, res: Response, next: NextFunction) =>
        routerMapFunc[route].invoker(req, res, next),
      );
    }
  }
}

function mapperFunction(method: EMethod, path: string) {
  return (target: any, propertyKey: string) => {
    routerMapper[method][path] = {
      path: path,
      constructor: target.constructor,
      invoker: async (req, res, next) => {
        const originalController = getController(target.constructor);
        const component = originalController.constructor;
        try {
          let totalParams = component[propertyKey].length;
          totalParams = Math.max(
            totalParams,
            totalOriginalMethodParams[[target.constructor.name, propertyKey].join(".")] || 0,
          );
          console.log("totalParams", totalParams, component[propertyKey]);
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

function before(controller: any, method?: string) {
  return (aopTarget: any, propertyKey: string) => {
    const constructor = getController(controller).constructor;
    const beforeAction = aopTarget[propertyKey];
    const targetMethod = constructor[method];
    const uniqueKey = [controller.name, method].join(".");
    totalOriginalMethodParams[uniqueKey] = targetMethod.length;
    Object.assign(constructor, {
      [method]: (...args) => {
        beforeAction.apply(aopTarget, args);
        return targetMethod.apply(constructor, args);
      },
    });
  };
}

function after(controller: any, method?: string) {
  return (aopTarget: any, propertyKey: string) => {
    const constructor = getController(controller).constructor;
    const afterAction = aopTarget[propertyKey];
    const targetMethod = constructor[method];
    const uniqueKey = [controller.name, method].join(".");
    totalOriginalMethodParams[uniqueKey] = targetMethod.length;
    Object.assign(constructor, {
      [method]: (...args) => {
        const res = targetMethod.apply(constructor, args);
        afterAction.apply(aopTarget, args);
        return res;
      },
    });
  };
}

export {
  loadRouter,
  Get,
  Post,
  Put,
  Del,
  All,
  reqBody,
  reqQuery,
  reqParam,
  reqHeaders,
  before,
  after,
};
