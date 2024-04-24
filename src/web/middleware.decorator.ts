import ExpressServer from "./express-server";

function Middleware() {
  return (target: any) => {
    const middleware = new target();
    const middlewareHandler = middleware.use();
    ExpressServer.setCustomMiddleware(middlewareHandler);
  };
}

export { Middleware };
