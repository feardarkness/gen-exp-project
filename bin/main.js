#!/usr/bin/env node

const fs = require("fs");
const minimatch = require("minimatch");
const mkdirp = require("mkdirp");
const path = require("path");

const MODE_0666 = parseInt("0666", 8);
const MODE_0755 = parseInt("0755", 8);
const TEMPLATE_DIR = path.join(__dirname, "..", "templates");

const _exit = process.exit;

function copyFile(from, to) {
  writeFile(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), "utf-8"));
}

/**
 * Copy multiple files from template directory.
 */

function copyTemplateMulti(fromDir, toDir, nameGlob) {
  fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
    .filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach(function (name) {
      copyFile(path.join(fromDir, name), path.join(toDir, name));
    });
}

/**
 * Create application at the given directory.
 *
 * @param {string} name
 * @param {string} dir
 */

function createApplication(name = "app", dir) {
  // Package
  const pkg = {
    name: name,
    version: "0.0.0",
    private: true,
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
      start: "node index.js",
      dev: "nodemon index.js",
    },
    dependencies: {
      axios: "^0.21.1",
      bunyan: "^1.8.15",
      dotenv: "^10.0.0",
      express: "^4.17.1",
      morgan: "^1.10.0",
    },
    devDependencies: {
      nodemon: "^2.0.12",
    },
  };

  mkdir(dir, "errors");
  mkdir(dir, "logs");
  mkdir(dir, "lib");
  mkdir(dir, "services");
  mkdir(dir, "routes");

  copyTemplateMulti("routes", dir + "/routes", "*.js");
  copyTemplateMulti("errors", dir + "/errors", "*.js");
  copyTemplateMulti("lib", dir + "/lib", "*.js");
  copyTemplateMulti("services", dir + "/services", "*.js");

  copyFile("gitignore", path.join(dir, ".gitignore"));
  copyFile("index.js", path.join(dir, "index.js"));
  copyFile("app.js", path.join(dir, "app.js"));
  write(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
  console.log();
  exit(1);
}

/**
 * Graceful exit for async STDIO
 */

function exit(code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done() {
    if (!draining--) _exit(code);
  }

  const draining = 0;
  const streams = [process.stdout, process.stderr];

  exit.exited = true;

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1;
    stream.write("", done);
  });

  done();
}

const destinationPath = ".";

// Generate application
createApplication("app", destinationPath);

function mkdir(base, dir) {
  const loc = path.join(base, dir);

  console.log("   -> Creating directory : " + loc + path.sep);
  mkdirp.sync(loc, MODE_0755);
}

function writeFile(file, content, mode) {
  fs.writeFileSync(file, content, { mode: mode || MODE_0666 });
  console.log("Generating: " + file);
}

function write(file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 });
  console.log("Creating : " + file);
}
