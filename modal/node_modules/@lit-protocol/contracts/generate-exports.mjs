const fs = require("fs");
const path = require("path");

const addFilesToExports = (dir, exports, extension) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFilesToExports(fullPath, exports);
    } else if (file.endsWith(extension)) {
      const relativePath = `./${path
        .relative(__dirname, fullPath)
        .replace(/\\/g, "/")}`;
      const exportPath = `./${path
        .relative("dist", fullPath)
        .replace(/\\/g, "/")}`;
      exports[exportPath] = {
        require: relativePath,
        import: relativePath,
        ...(extension === ".js"
          ? { types: relativePath.replace(extension, ".ts") }
          : { types: "./json.d.ts" }),
      };
    }
  });
};

const jsonFiles = {};
addFilesToExports(path.join(__dirname, "dist/prod"), jsonFiles, ".json");
addFilesToExports(path.join(__dirname, "dist/dev"), jsonFiles, ".json");
addFilesToExports(path.join(__dirname, "dist/prod"), jsonFiles, ".js");
addFilesToExports(path.join(__dirname, "dist/dev"), jsonFiles, ".js");

const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

packageJson.exports = {
  ...packageJson.exports,
  ...jsonFiles,
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
