import { Application, Request, Response } from "express";

const routerMapper = {
  GET: {},
  POST: {},
  PUT: {},
  DEL: {},
  ALL: {},
};

const methodMapper = {
  get: "GET",
  post: "POST",
  put: "PUT",
  del: "DEL",
  all: "ALL",
};

function Get(path: string) {
  return (target: any, propertyKey: string) => {
    routerMapper["GET"][path] = target[propertyKey].bind(target);
    console.log(`method: GET path: ${path} Function ${propertyKey}`);
  };
}

function Post(path: string) {
  return (target: any, propertyKey: string) => {
    routerMapper["POST"][path] = target[propertyKey].bind(target);
  };
}

function Put(path: string) {
  return (target: any, propertyKey: string) => {
    routerMapper["PUT"][path] = target[propertyKey].bind(target);
  };
}

function Del(path: string) {
  return (target: any, propertyKey: string) => {
    routerMapper["DEL"][path] = target[propertyKey].bind(target);
  };
}

function All(value: string) {
  return function(target, propertyKey: string) {
    routerMapper["ALL"][value] = target[propertyKey].bind(target);
  };
}

function loadRouter(app: Application) {
  for (const methodKey in methodMapper) {
    const method = methodMapper[methodKey];
    const routerMappers = routerMapper[method];
    for (const router in routerMappers) {
      app[methodKey](router, (req: Request, res: Response) => routerMappers[router](req, res));
    }
  }
}

export { Get, Post, Put, Del, All, loadRouter };
