export default class BeanFactory {
  private static beanMapper: Map<string, any> = new Map<string, any>();
  private static beanFunctionMapper: Map<string, any> = new Map<string, any>();

  public static putBean(mappingClass: Function, beanClass: any): any {
    this.beanMapper.set(mappingClass.name, beanClass);
  }
  public static putBeanFunction(mappingFunction: Function, beanFunction: Function) {
    return this.beanFunctionMapper.set(mappingFunction.name, beanFunction);
  }
  public static getBean(mappingFunction: Function): Function {
    return this.beanMapper.get(mappingFunction.name);
  }
  public static getBeanFunction(mappingFunction: Function): Function {
    return this.beanFunctionMapper.get(mappingFunction.name);
  }
}
