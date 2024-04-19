export default class ClassFactory {
  private static classMapper: Map<string, any> = new Map<string, any>();
  private static functionMapper: Map<string, any> = new Map<string, any>();

  public static putClass(mappingClass: Function, originalClass: any): any {
    return this.classMapper.set(mappingClass.name, originalClass);
  }
  public static putClassFunction(mappingFunction: Function, originalFunction: Function) {
    return this.functionMapper.set(mappingFunction.name, originalFunction);
  }
  public static getClass(mappingClass: Function): Function {
    return this.classMapper.get(mappingClass.name);
  }
  public static getClassFunction(mappingFunction: Function): Function {
    return this.functionMapper.get(mappingFunction.name);
  }
}
