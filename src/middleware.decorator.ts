import ExpressServer from "./express-server.class";

function Middleware(target: any) {
  const middleware = new target();
  const middlewareCallback = middleware.run();
  ExpressServer.setCustomMiddleware(middlewareCallback);
}

export { Middleware };
