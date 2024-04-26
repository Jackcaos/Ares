import { before } from "../src/web/route-mapping.decorator";
import User from "./user";

class Aop {
  @before(User, "getUser")
  public getAop(aaa: string) {
    console.log("get aop after");
  }
}
