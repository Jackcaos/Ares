import { Inject } from "../src";
import Logger from "../src/factory/log-factory.class";
import { Post } from "../src/web/route-mapping.decorator";
import { Files } from "../src/web/upload.decorator";
import { Controller } from "../src";
import { IServerConfig } from "../src/interface/config";

@Controller("/")
export default class Upload {
  @Inject private logger: Logger;

  @Post("/upload")
  public async upload(@Files() files) {
    // const form = new multiparty.Form();
    console.log("files", files);
    return files;
  }
}
