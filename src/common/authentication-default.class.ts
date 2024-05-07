import { Provide } from "../index";
import AuthenticationFactory from "../factory/authentication-factory.class";

export default class DefaultAuthentication extends AuthenticationFactory {
  @Provide
  public createAuthentication(): AuthenticationFactory {
    return new DefaultAuthentication();
  }
}
