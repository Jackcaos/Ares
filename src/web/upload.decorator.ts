import * as multiparty from "multiparty";
import { createParamMapping } from "./route-mapping.decorator";

interface IFileUploadCallback {
  fields: any;
  files: any;
}

function Files() {
  return (targetFunction: any, propertyKey: string, parameterIndex: number) => {
    const form = new multiparty.Form();
    const callback = async (req, res, next) => {
      const result = await parseFormData(req, res, form);
      return result;
    };

    createParamMapping(targetFunction, propertyKey, parameterIndex, callback);
  };
}

async function parseFormData(req, res, form): Promise<IFileUploadCallback> {
  return new Promise((resolve, reject) => {
    form.parse(req, (err: Error, fields: any, files: any) => {
      if (err) {
        return reject(err);
      }
      return resolve({ fields: fields, files: files });
    });
  });
}

export { Files };
