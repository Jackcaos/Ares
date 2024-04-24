import { Application, Request, Response, NextFunction } from "express";
import ClassFactory from "../factory/class-factory.class";
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
  return (metadata: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.body[property] : req.body);
    createParamMapping(metadata, propertyKey, parameterIndex, callback);
  };
}

function reqQuery(property?: string) {
  return (metadata: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.query[property] : req.query);
    createParamMapping(metadata, propertyKey, parameterIndex, callback);
  };
}

function reqParam(property?: string) {
  return (metadata: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.params[property] : req.params);
    createParamMapping(metadata, propertyKey, parameterIndex, callback);
  };
}

function reqHeaders(property?: string) {
  return (metadata: any, propertyKey: string, parameterIndex: number) => {
    const callback = (req, res, next) => (property ? req.headers[property] : req.headers);
    createParamMapping(metadata, propertyKey, parameterIndex, callback);
  };
}

function createParamMapping(metadata, propertyKey: string, parameterIndex: number, callback: any) {
  const metaClass = ClassFactory.getMetaClassData(metadata.constructor) as IController;
  const uniqueKey = `${metaClass.name}.${propertyKey}.${parameterIndex}`;
  Object.assign(metaClass, {
    params: {
      [uniqueKey]: callback,
    },
  });
}

function loadRouter(app: Application) {
  const allMetaClassData = ClassFactory.getAllMetaClassData();
  for (const [, val] of allMetaClassData) {
    const prefix = val.prefix === "/" ? "" : val.prefix;
    const routers = val.router;
    for (const key in routers) {
      const { method, path, callback } = routers[key];
      const realPath = prefix + path;
      app[method](realPath, (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next);
      });
    }
  }
}

function createFunctionMapping(method: EMethod, path: string, middlewares?: IMiddleware[]) {
  return (metadata, propertyKey: string) => {
    // metadata
    const metaClass: IController = ClassFactory.getMetaClassData(metadata.constructor);

    const uniqueKey = `${metaClass.name}.${propertyKey}`;

    const callback = createCallback(metadata, propertyKey, uniqueKey);

    const routeOptions: IRouteOptions = Object.assign(defaultRouteOptions, {
      uniqueKey,
      method,
      path,
      callback,
      middlewares,
    });

    Object.assign(metaClass, {
      router: {
        ...metaClass.router,
        [uniqueKey]: { ...routeOptions },
      },
    });
  };
}

function createCallback(metadata, propertyKey: string, uniqueKey: string) {
  return (req, res, next) => {
    const metaClass = ClassFactory.getMetaClassData(metadata.constructor) as IController;
    const metaFunc = metadata[propertyKey];

    const args = requestHandleParams(metadata, propertyKey, uniqueKey, req, res, next);
    const result = metaFunc.apply(metaClass.constructor, [...args]);
    responseHandle(res, result);
  };
}

function requestHandleParams(
  metadata: any,
  propertyKey: string,
  uniqueKey: string,
  req: Request,
  res: Response,
  next: NextFunction,
): any[] {
  const args = [req, res, next];
  const metaClass = ClassFactory.getMetaClassData(metadata.constructor) as IController;
  const metaFunc = metadata[propertyKey];
  const paramsCount = metaFunc.length;

  for (let i = 0; i < paramsCount; i++) {
    const key = `${uniqueKey}.${i}`;
    if (metaClass.params[key]) {
      args[i] = metaClass.params[key](req, res, next);
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

function before(decoratorClass: any, method?: string) {
  return (metadata: any, propertyKey: string) => {
    const { constructor: metaClass, name, router } = ClassFactory.getMetaClassData(decoratorClass);
    const uniqueKey = `${name}.${method}`;

    const beforeAction = metadata[propertyKey];
    const originMethod = metaClass[method];

    const decoratorMethod = (req: Request, res: Response, next: NextFunction) => {
      const args = requestHandleParams(metaClass, method, uniqueKey, req, res, next);
      beforeAction.apply(metadata, args);
      const result = originMethod.apply(metaClass, args);
      responseHandle(res, result);
    };

    router[uniqueKey].callback = decoratorMethod;

    Object.assign(metaClass, {
      router: {
        ...metaClass.router,
        // fixme 改成递归的方式
        ...router[uniqueKey],
      },
    });
  };
}

function after(decoratorClass: any, method?: string) {
  return (metadata: any, propertyKey: string) => {
    const { constructor: metaClass, name, router } = ClassFactory.getMetaClassData(decoratorClass);
    const uniqueKey = `${name}.${method}`;

    const afterAction = metadata[propertyKey];
    const originMethod = metaClass[method];

    const decoratorMethod = (req: Request, res: Response, next: NextFunction) => {
      const args = requestHandleParams(metaClass, method, uniqueKey, req, res, next);
      const result = originMethod.apply(metaClass, args);
      afterAction.apply(metadata, args);
      responseHandle(res, result);
    };

    router[uniqueKey].callback = decoratorMethod;

    Object.assign(metaClass, {
      router: {
        ...metaClass.router,
        // fixme 改成递归的方式
        ...router[uniqueKey],
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
