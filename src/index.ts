import "reflect-metadata";
import { App, getGlobalConfig } from "./app.decorator";
import LogFactory from "./factory/log-factory.class";
import ClassFactory from "./factory/class-factory.class";
import ControllerFactory from "./factory/controller-factory.class";

function onClass<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

function Inject(target: any, propertyName: string) {
  const type = Reflect.getMetadata("design:type", target, propertyName);
  Object.defineProperty(target, propertyName, {
    get: function injectClass() {
      const originalClass = ClassFactory.getMetaFunctionData(type);
      return originalClass();
    },
  });
}

function Provide(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  const returnType = Reflect.getMetadata("design:returntype", target, propertyName);
  ClassFactory.putMetaFunctionData(returnType, target[propertyName]);
}

function Controller(prefix = "/", middlewares?: any[]) {
  return (target: any) => {
    ControllerFactory.putMetaClassData(target, {
      constructor: new target(),
      prefix,
      middlewares: middlewares ? middlewares : [],
    });
  };
}

function Logger(message?: any, ...optionalParams: any[]) {
  const logBean = ControllerFactory.getMetaClassData(LogFactory);
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
