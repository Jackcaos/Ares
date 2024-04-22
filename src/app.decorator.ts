import * as walkSync from "walk-sync";

const objectMapper: Map<string, any> = new Map<string, any>();

function App<T extends { new (...args: any[]): {} }>(constructor: T) {
  const srcDir = process.cwd() + "/src";
  const testDir = process.cwd() + "/test";
  const srcPaths = walkSync(srcDir, { globs: ["**/*.ts"] });
  const testPaths = walkSync(testDir, { globs: ["*.ts"] });

  (async function() {
    for (const file of srcPaths) {
      await import(`${srcDir}/${file}`);
    }
    for (const file of testPaths) {
      await import(`${testDir}/${file}`);
    }
    const main = new constructor();
    main["main"]();
  })();
}

function Controller(prefix = "/", middlewares?: any[]) {
  return (target) => {
    objectMapper.set(target.name, {
      constructor: new target(),
      prefix,
      middlewares: middlewares ? middlewares : [],
    });
  };
}

function getController(constructorFunction: any) {
  return objectMapper.get(constructorFunction.name);
}

export { App, Controller, getController };
