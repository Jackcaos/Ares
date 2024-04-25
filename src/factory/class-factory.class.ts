export default class ClassFactory {
  private static functionMapper: Map<string, any> = new Map<string, any>();

  public static putMetaFunctionData(mappingFunction: Function, originalFunction: Function) {
    this.functionMapper.set(mappingFunction.name, originalFunction);
  }

  public static getMetaFunctionData(mappingFunction: Function) {
    return this.functionMapper.get(mappingFunction.name);
  }
}
