export default class ControllerFactory {
  private static controllerMapper: Map<string, any> = new Map<string, any>();

  public static putMetaClassData(mappingClass: Function, data: { [key: string]: any }) {
    const previousData = this.controllerMapper.get(mappingClass.name);
    data = previousData ? Object.assign(previousData, data) : data;
    this.controllerMapper.set(mappingClass.name, data);
  }

  public static getMetaClassData(mappingClass: Function) {
    const previousData = this.controllerMapper.get(mappingClass.name);
    if (previousData === undefined) {
      this.controllerMapper.set(mappingClass.name, {
        name: mappingClass.name,
      });
    }
    return this.controllerMapper.get(mappingClass.name);
  }

  public static getAllMetaClassData() {
    return this.controllerMapper;
  }
}