import * as walkSync from "walk-sync";
export default function App<T extends { new (...args: any[]): {} }>(constructor: T) {
  const srcDir = process.cwd() + "/src";
  const testDir = process.cwd() + "/test";
  const srcPaths = walkSync(srcDir, { globs: ["**/*.ts"] });
  const testPaths = walkSync(testDir, { globs: ["**/*.ts"] });

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
