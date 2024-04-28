import { IController } from "../interface/server";

type ctrKeys = keyof IController;

export default class ControllerFactory {
  private static controllerMapper: Map<string, any> = new Map<string, any>();
  private static metaDataMap: Map<string, Map<string, any>> = new Map<string, any>();

  public static putMetaClassData(
    namespace: string,
    key: string,
    data: { [key: string]: any },
    singleton = false,
  ) {
    if (typeof data.target !== "function") {
      throw new Error(`target must be function!, but now target is ${typeof data.target}`);
    }

    const { target } = data;
    if (singleton) {
      // eslint-disable-next-line prettier/prettier
      const { instance } = this.metaDataMap.get(namespace)?.get(key);
      if (instance) return;
    }
    const instance = new target();
    Reflect.set(data, "target", instance);
    if (!this.metaDataMap.get(namespace)) {
      this.metaDataMap.set(namespace, new Map());
    }
    this.metaDataMap.get(namespace).set(key, data);
  }

  public static putMetaMethodData(
    namespace: string,
    key: string,
    data: { [key: string]: any },
    merge = false,
  ) {
    if (!this.metaDataMap.get(namespace)) {
      this.metaDataMap.set(namespace, new Map());
    }
    const preData = this.metaDataMap.get(namespace).get(key) || {};

    this.metaDataMap.get(namespace).set(key, Object.assign(merge ? preData : {}, data));
  }

  public static getMetaDataByKey(namespace: string, key: string) {
    return this.metaDataMap.get(namespace)?.get(key);
  }

  public static getMetaDataByNameSpace(namespace: string) {
    return this.metaDataMap.get(namespace);
  }

  public static getMetaClassData(mappingClass) {
    const previousData = this.controllerMapper.get(mappingClass.name);
    if (previousData === undefined) {
      this.controllerMapper.set(mappingClass.name, {
        name: mappingClass.name,
      });
    }
    return this.controllerMapper.get(mappingClass.name);
  }
}
