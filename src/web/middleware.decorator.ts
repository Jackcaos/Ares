import ExpressServer from "./express-server.class";

function Middleware() {
  return (target: any) => {
    const middleware = new target();
    const middlewareCallback = middleware.use();
    ExpressServer.setCustomMiddleware(middlewareCallback);
  };
}

export { Middleware };
