import { onClass, log } from "../src";

@onClass
export default class TestLog {
  constructor() {
    log("TestLog constructor");
  }
}

new TestLog();
