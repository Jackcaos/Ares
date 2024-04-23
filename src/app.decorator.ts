import * as walkSync from "walk-sync";
import * as fs from "fs";

const objectMapper: Map<string, any> = new Map<string, any>();
let globalConfig = {};

function App<T extends { new (...args: any[]): {} }>(constructor: T) {
  const srcDir = process.cwd() + "/src";
  const testDir = process.cwd() + "/test";
  const srcPaths = walkSync(srcDir, { globs: ["**/*.ts"] });
  const testPaths = walkSync(testDir, { globs: ["*.ts"] });

  (async function() {
    // 获取配置
    await importConfig();

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

function importConfig() {
  const configPath = process.cwd() + "/test/config/config.default.json";
  if (fs.existsSync(configPath)) {
    globalConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv) {
      const envConfigFile = process.cwd() + "/test/config/config-" + nodeEnv + ".json";
      if (fs.existsSync(envConfigFile)) {
        globalConfig = Object.assign(
          globalConfig,
          JSON.parse(fs.readFileSync(envConfigFile, "utf-8")),
        );
      }
    }
  }
  console.log("globalConfig", globalConfig);
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

function getGlobalConfig() {
  return globalConfig;
}

export { App, Controller, getController, getGlobalConfig };
