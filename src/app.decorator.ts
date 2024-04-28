import * as walkSync from "walk-sync";
import * as fs from "fs";
import MetaManager from "./meta-manager.class";
import { CONFIG } from "./common/constants";

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
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv) {
      const envConfigFile = process.cwd() + "/test/config/config-" + nodeEnv + ".json";
      if (fs.existsSync(envConfigFile)) {
        Object.assign(config, JSON.parse(fs.readFileSync(envConfigFile, "utf-8")));
      }
    }
    MetaManager.putMetaData(CONFIG, "project", config);
  }
}

export { App };
