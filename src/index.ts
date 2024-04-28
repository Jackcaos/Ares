import "reflect-metadata";
import { App, getGlobalConfig } from "./app.decorator";
import LogFactory from "./factory/log-factory.class";
import ControllerFactory from "./factory/controller-factory.class";
import { COMMON_METHOD, CONTROLLER_KEY } from "./common/constants";

function onClass<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

function Inject(target: any, propertyName: string) {
  const type = Reflect.getMetadata("design:type", target, propertyName);
  const uniqueKey = type.name;

  Reflect.defineProperty(target, propertyName, {
    get: function injectClass() {
      const originalClass = ControllerFactory.getMetaDataByKey(COMMON_METHOD, uniqueKey).target;
      return originalClass();
    },
  });
}

function Provide(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  const returnType = Reflect.getMetadata("design:returntype", target, propertyName);
  const uniqueKey = returnType.name;

  ControllerFactory.putMetaMethodData(COMMON_METHOD, uniqueKey, {
    target: target[propertyName],
  });
}

function Controller(prefix = "/", middlewares?: any[]) {
  return (target: any) => {
    ControllerFactory.putMetaClassData(CONTROLLER_KEY, target.name, {
      name: target.name,
      target,
      prefix,
      middlewares: middlewares ? middlewares : [],
    });
  };
}

function Logger(message?: any, ...optionalParams: any[]) {
  const logBean = ControllerFactory.getMetaDataByKey(COMMON_METHOD, LogFactory.name);
  const logBeanInstance = logBean();
  logBeanInstance.log(message, ...optionalParams);
}

function Config(configKey?: string) {
  return (target: any, propertyKey: string) => {
    const configVal = getGlobalConfig()[configKey];
    Object.assign(target, {
      [propertyKey]: configVal,
    });
  };
}

export { App, Controller, Provide, Inject, onClass, Logger, Config };
