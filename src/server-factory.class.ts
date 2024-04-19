export default abstract class ServerFactory {
  protected defaultMiddleware: Array<any> = [];

  public abstract start(port: number);
}
