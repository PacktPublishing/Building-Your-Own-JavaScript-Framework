import chokidar from "chokidar";
import { spawn } from "node:child_process";
import input from "@inquirer/input";
import select from "@inquirer/select";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path, { dirname } from "path";
import { exec } from "child_process";

// `makeDebug` is a function from the "debug" package for creating a debugger instance.
import makeDebug from "debug";

// Creating a debug instance specifically for "componium:frontend-client-view".
const debug = makeDebug("componium:commands");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variable to store the server process instance
let server;

/**
 * Kills the current server process (if running) and starts a new one.
 */
function restartServer() {
  // Check if a server process is currently running
  if (server) {
    // Kill the server process
    server.kill("SIGTERM");
  }

  // Start a new server process
  server = spawn("node", ["--no-deprecation", "app.js"], { stdio: "inherit" });

  // Event listener for when the server process closes
  server.on("close", function (code, signal) {
    if (signal) {
      debug(`Server process was killed with signal ${signal}`);
    } else if (code !== null) {
      console.log(`Server process exited with code ${code}`);
    } else {
      console.log("Server process exited");
    }
  });
}

/**
 * Watches for changes in the current directory and restarts the server
 * whenever a change is detected. Ignores changes in the 'node_modules' directory
 * and hidden files/folders.
 */
function restartDev() {
  const ignores = ["node_modules", /(^|[\/\\])\../];

  chokidar
    .watch(".", {
      ignored: ignores,
    })
    .on("all", (event, path) => {
      restartServer();
    });
}

/**
 * Initialize app directory from template
 */
async function initDev() {
  const templateDir = path.join(__dirname, "..", "template", "_app");
  const currentDir = process.cwd();

  try {
    const currentDirContents = await fs.readdir(currentDir);
    if (currentDirContents.length > 0) {
      console.log(
        "Warning: New application directory not empty. New files will be added to existing ones."
      );
    }

    await copyDirectoryRecursive(templateDir, currentDir);
    // Install npm dependencies
    await installDependencies();

    console.log(
      "New Componium application initialized. Run `componium dev` to start the new app or `componium create` to scaffold!"
    );
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

async function copyDirectoryRecursive(source, target) {
  const files = await fs.readdir(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(target, file);

    const stat = await fs.stat(sourcePath);
    console.log(`Creating ${destPath}...`);

    if (stat.isDirectory()) {
      try {
        await fs.mkdir(destPath, { recursive: true });
      } catch (e) {}
      await copyDirectoryRecursive(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log("Installing dependencies...");

    exec("npm install", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }

      resolve();
    });
  });
}

/**
 * Interactively allows the user to choose a scaffold type and
 * then performs corresponding actions.
 */
async function create() {
  const componentTemplate = await select({
    message: "What would you like to scaffold?",
    choices: [
      {
        name: "Model",
        value: "model",
        description: "Create a new database model",
      },
      {
        name: "Route",
        value: "route",
        description: "Create a new route file",
      },
      {
        name: "GraphQL Schema",
        value: "gql",
      },
      {
        name: "Client View",
        value: "clientview",
      },
    ],
  });

  const name = await input({
    message: `Enter a name for your ${componentTemplate.toUpperCase()}`,
  });

  const templateDir = path.join(
    __dirname,
    "..",
    "template",
    "_create",
    `${componentTemplate}.js`
  );
  const sourcePath = path.resolve(templateDir);
  const currentDir = process.cwd();

  let destDir = path.join(currentDir, "models");
  switch (componentTemplate) {
    case "gql":
      destDir = path.join(currentDir, "routes", "gql");
      break;
    case "route":
      destDir = path.join(currentDir, "routes", "api");
      break;
    case "clientview":
      destDir = path.join(currentDir, "views");
      break;
  }

  try {
    await fs.mkdir(destDir, { recursive: true });
  } catch (e) {
    throw new Error(e);
  }

  const destPath = path.resolve(path.join(destDir, `${toSnakeCase(name)}.js`));
  await fs.copyFile(sourcePath, destPath);
}

function toSnakeCase(str) {
  return str
    .replace(/[\s_]+/g, "_")
    .replace(/([a-z\d_])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

// Export the functions for external use
export { restartDev, create, initDev };
