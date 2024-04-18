import * as walkSync from "walk-sync";

(async () => {
  const srcDir = process.cwd() + "/src";
  const srcPaths = walkSync(srcDir, { globs: ["**/*.ts"] });
  for (const p of srcPaths) {
    await import(srcDir + "/" + p);
  }

  const testDir = process.cwd() + "/test";
  const testPaths = walkSync(testDir, { globs: ["**/*.ts"] });
  for (const p of testPaths) {
    await import(testDir + "/" + p);
  }
  console.log("Main file running...");
})();
