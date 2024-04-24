export default class ClassFactory {
  private static controllerMapper: Map<string, any> = new Map<string, any>();
  private static functionMapper: Map<string, any> = new Map<string, any>();

  public static putMetaClassData(mappingClass: Function, data: { [key: string]: any }) {
    const metaClassData = this.controllerMapper.get(mappingClass.name);
    if (metaClassData) {
      console.log(Object.assign(metaClassData, data));
      this.controllerMapper.set(mappingClass.name, Object.assign(metaClassData, data));
    } else {
      this.controllerMapper.set(mappingClass.name, data);
    }
  }

  public static putMetaFunctionData(mappingFunction: Function, originalFunction: Function) {
    this.functionMapper.set(mappingFunction.name, originalFunction);
  }

  public static getMetaClassData(mappingClass: Function) {
    const metaClassData = this.controllerMapper.get(mappingClass.name);
    if (metaClassData === undefined) {
      this.controllerMapper.set(mappingClass.name, {
        name: mappingClass.name,
      });
    }
    return this.controllerMapper.get(mappingClass.name);
  }

  public static getAllMetaClassData() {
    return this.controllerMapper;
  }

  public static getMetaFunctionData(mappingFunction: Function) {
    return this.functionMapper.get(mappingFunction.name);
  }
}
