import { Application, Request, Response, NextFunction } from "express";
import ClassFactory from "../factory/class-factory.class";
import { EMethod, IRouteOptions, IController, IMiddleware } from "../interface/server";

const routerMapper = {
  get: {},
  post: {},
  put: {},
  del: {},
  all: {},
};

const defaultRouteOptions: Partial<IRouteOptions> = {
  method: EMethod["GET"],
  paramsCount: 0,
  middlewares: [],
};

const routerParams = {};
const totalOriginalMethodParams = {};

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
    const args = [req, res, next];
    const metaClass = ClassFactory.getMetaClassData(metadata.constructor) as IController;
    const metaFunc = metadata[propertyKey];
    const paramsCount = metaClass.router[uniqueKey].paramsCount || metaFunc.length;

    for (let i = 0; i < paramsCount; i++) {
      const key = `${uniqueKey}.${i}`;
      if (metaClass.params[key]) {
        args[i] = metaClass.params[key](req, res, next);
      }
    }
    const result = metaFunc.apply(metadata, [...args]);

    if (typeof result === "object") {
      return res.json(result);
    } else {
      return res.send(result);
    }
  };
}

// function requestMapping(method: EMethod, path: string) {
//   return (target: any, propertyKey: string) => {
//     routerMapper[method][path] = {
//       path: path,
//       constructor: target.constructor,
//       invoker: async (req, res, next) => {
//         const originalController = ClassFactory.getMetaClassData(target.constructor);
//         const component = originalController.constructor;
//         try {
//           let totalParams = component[propertyKey].length;
//           totalParams = Math.max(
//             totalParams,
//             totalOriginalMethodParams[[target.constructor.name, propertyKey].join(".")] || 0,
//           );
//           console.log("totalParams", totalParams, component[propertyKey]);
//           // express 回调函数的常规参数
//           const args = [req, res, next];
//           if (totalParams > 0) {
//             for (let index = 0; index < totalParams; index++) {
//               const routerParamsKey = [target.constructor.name, propertyKey, index].join(".");
//               if (routerParams[routerParamsKey]) {
//                 args[index] = routerParams[routerParamsKey](req, res, next);
//               }
//             }
//           }
//           const result = component[propertyKey].apply(component, [...args]);
//           if (typeof result === "object") {
//             return res.json(result);
//           } else {
//             return res.send(result);
//           }
//         } catch (err) {
//           next(err);
//         }
//       },
//     };
//   };
// }

function before(decoratorClass: any, method?: string) {
  return (metadata: any, propertyKey: string) => {
    const { constructor: metaClass, name } = ClassFactory.getMetaClassData(decoratorClass);
    const uniqueKey = `${name}.${method}`;

    console.log("metaClass", metaClass);
    const beforeAction = metadata[propertyKey];
    const originMethod = metaClass[method];
    // console.log(decoratorClass, method);
    const paramsCount = originMethod.length;
    const decoratorMethod = (...args) => {
      console.log("12123123");
      beforeAction.apply(metadata, args);
      return originMethod.apply(metaClass, args);
    };

    Object.assign(metaClass, {
      router: {
        ...metaClass.router,
        // fixme 改成递归的方式
        [uniqueKey]: {
          paramsCount,
          callback: decoratorMethod,
        },
      },
    });
    console.log("metaClass", metaClass);
  };
}

function after(controller: any, method?: string) {
  return (aopTarget: any, propertyKey: string) => {
    const constructor = ClassFactory.getMetaClassData(controller).constructor;
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
