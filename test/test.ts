import { after } from "../src/web/route-mapping.decorator";
import User from "./user";

class Aop {
  @after(User, "getUser")
  public getAop(...args) {
    // console.log(args);
    console.log("get aop after11111111111111");
    console.log("get aop after");
  }
}
