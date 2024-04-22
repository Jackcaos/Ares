import "reflect-metadata";
import { App } from "./app.decorator";
import LogFactory from "./factory/log-factory.class";
import ClassFactory from "./factory/class-factory.class";

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
      const originalClass = ClassFactory.getClass(type);
      return originalClass();
    },
  });
}

function Provide(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  const returnType = Reflect.getMetadata("design:returntype", target, propertyName);
  console.log(ClassFactory);
  ClassFactory.putClass(returnType, target[propertyName]);
}

function Logger(message?: any, ...optionalParams: any[]) {
  const logBean = ClassFactory.getClass(LogFactory);
  const logBeanInstance = logBean();
  logBeanInstance.log(message, ...optionalParams);
}

export { App, Provide, Inject, onClass, Logger };
