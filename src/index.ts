import "reflect-metadata";
import LogFactory from "./log-factory.class";
import LogDefault from "./log-default.class";
import BeanFactory from "./bean-factory.class";

function onClass<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log("decorator onClass: " + constructor.name);
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

function bean(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  console.log("bean", target[propertyName]);
  const returnType = Reflect.getMetadata("design:returntype", target, propertyName);
  BeanFactory.putBean(returnType, target[propertyName]);
}

function log(message?: any, ...optionalParams: any[]) {
  const logBean = BeanFactory.getBean(LogFactory);
  const logBeanInstance = logBean();
  logBeanInstance.log(message, ...optionalParams);
}

export { bean, onClass, log };
