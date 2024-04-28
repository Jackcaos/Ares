import { Application, Request, Response, NextFunction } from "express";
import { AOP_METHOD, CONTROLLER_KEY, ROUTER_KEY, ROUTER_PARAMS_KEY } from "../common/constants";
import ControllerFactory from "../factory/controller-factory.class";
import { EMethod, IRouteOptions, IController, IMiddleware } from "../interface/server";

const defaultRouteOptions: Partial<IRouteOptions> = {
  path: "/",
  method: EMethod["GET"],
  middlewares: [],
};

function Get(path: string) {
  return createFunctionMapping(EMethod.GET, path);
}

function Post(path: string) {
  return createFunctionMapping(EMethod.POST, path);
}

function Put(path: string) {
  return createFunctionMapping(EMethod.PUT, path);
}

function Del(path: string) {
  return createFunctionMapping(EMethod.DEL, path);
}

function All(path: string) {
  return createFunctionMapping(EMethod.ALL, path);
}

function reqBody(property?: string) {
  return (targetFunction: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.body[property] : req.body);
    createParamMapping(targetFunction, propertyKey, parameterIndex, callback);
  };
}

function reqQuery(property?: string) {
  return (targetFunction: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.query[property] : req.query);
    createParamMapping(targetFunction, propertyKey, parameterIndex, callback);
  };
}

function reqParam(property?: string) {
  return (targetFunction: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.params[property] : req.params);
    createParamMapping(targetFunction, propertyKey, parameterIndex, callback);
  };
}

function reqHeaders(property?: string) {
  return (targetFunction: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.headers[property] : req.headers);
    createParamMapping(targetFunction, propertyKey, parameterIndex, callback);
  };
}

function createParamMapping(
  targetFunction,
  propertyKey: string,
  parameterIndex: number,
  callback: any,
) {
  const instance = targetFunction.constructor;
  const uniqueKey = `${instance.name}_${propertyKey}_${parameterIndex}`;
  ControllerFactory.putMetaMethodData(ROUTER_PARAMS_KEY, uniqueKey, { callback });
}

function loadRouter(app: Application) {
  // const allController = ControllerFactory.getMetaDataByNameSpace(CONTROLLER_KEY);
  const allRouter = ControllerFactory.getMetaDataByNameSpace(ROUTER_KEY);
  for (const [uniqueKey, data] of allRouter) {
    const [className, methodName] = uniqueKey.split("_");
    let { prefix } = ControllerFactory.getMetaDataByKey(CONTROLLER_KEY, className);
    prefix = prefix === "/" ? "" : prefix;
    const { method, path, callback } = data;
    const realPath = prefix + path;
    app[method](realPath, (req: Request, res: Response, next: NextFunction) => {
      callback(req, res, next);
    });
  }
}

function createFunctionMapping(method: EMethod, path: string, middlewares?: IMiddleware[]) {
  return (targetFunction, propertyKey: string) => {
    const className = targetFunction.constructor.name;

    const uniqueKey = `${className}_${propertyKey}`;

    const callback = createCallback(targetFunction, propertyKey, uniqueKey);

    const routerData: IRouteOptions = Object.assign(defaultRouteOptions, {
      method,
      path,
      callback,
      middlewares,
    });

    ControllerFactory.putMetaMethodData(ROUTER_KEY, uniqueKey, routerData);
  };
}

function createCallback(targetFunction, propertyKey: string, uniqueKey: string) {
  return (req, res, next) => {
    const targetClass = ControllerFactory.getMetaDataByKey(CONTROLLER_KEY, targetFunction.constructor.name);
    const metaFunc = targetFunction[propertyKey];

    const args = requestHandleParams(targetFunction, propertyKey, uniqueKey, req, res, next);
    const result = metaFunc.apply(targetClass.target, [...args]);
    responseHandle(res, result);
  };
}

function requestHandleParams(
  targetFunction: any,
  propertyKey: string,
  uniqueKey: string,
  req: Request,
  res: Response,
  next: NextFunction,
): any[] {
  console.log('targetFunction', targetFunction.constructor);
  const args = [req, res, next];
  const metaFunc = targetFunction[propertyKey];
  const paramsCount = metaFunc.length;

  for (let i = 0; i < paramsCount; i++) {
    const key = `${uniqueKey}_${i}`;
    const metaData = ControllerFactory.getMetaDataByKey(ROUTER_PARAMS_KEY, key);
    // eslint-disable-next-line prettier/prettier
    if (metaData?.callback) {
      console.log('metaData.callback(req, res, next)', metaData.callback);
      args[i] = metaData.callback(req, res, next);
    }
  }
  return args;
}

function responseHandle(res: Response, result: any) {
  if (typeof result === "object") {
    return res.json(result);
  } else {
    return res.send(result);
  }
}

function before(decoratedClass: any, method?: string) {
  return (targetClass: any, propertyKey: string) => {
    const originalClass = ControllerFactory.getMetaDataByKey(CONTROLLER_KEY, decoratedClass.name);

    const uniqueKey = `${decoratedClass.name}_${method}`;
    const originalMethod = ControllerFactory.getMetaDataByKey(ROUTER_KEY, uniqueKey).callback;

    const beforeAction = targetClass[propertyKey];

    ControllerFactory.putMetaMethodData(ROUTER_KEY, uniqueKey, {
      callback: (req: Request, res: Response, next: NextFunction) => {
        const args = requestHandleParams(originalClass.target, method, uniqueKey, req, res, next);
        beforeAction.apply(targetClass, args);
        const result = originalMethod.apply(originalClass.target, args);
        responseHandle(res, result);
      }
    }, true);

  };
}

function after(decoratedClass: any, method?: string) {
  return (targetClass: any, propertyKey: string) => {
    const originalClass = ControllerFactory.getMetaDataByKey(CONTROLLER_KEY, decoratedClass.name);

    const uniqueKey = `${decoratedClass.name}_${method}`;
    const originalMethod = ControllerFactory.getMetaDataByKey(ROUTER_KEY, uniqueKey).callback;

    const afterAction = targetClass[propertyKey];

    ControllerFactory.putMetaMethodData(ROUTER_KEY, uniqueKey, {
      callback: (req: Request, res: Response, next: NextFunction) => {
        const args = requestHandleParams(originalClass.target, method, uniqueKey, req, res, next);
        const result = originalMethod.apply(originalClass.target, args);
        afterAction.apply(targetClass, args);
        responseHandle(res, result);
      }
    }, true);
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
