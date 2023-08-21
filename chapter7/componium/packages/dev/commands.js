import chokidar from "chokidar";
import { spawn } from "node:child_process";
import select from "@inquirer/select";

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
  server = spawn("node", ["app.js"], { stdio: "inherit" });

  // Event listener for when the server process closes
  server.on("close", function (code, signal) {
    if (signal) {
      console.log(`Server process was killed with signal ${signal}`);
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
 * Interactively allows the user to choose a scaffold type and
 * then performs corresponding actions.
 */
async function create() {
  const answer = await select({
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
    ],
  });

  // Further implementation can be added here
}

// Export the functions for external use
export { restartDev, create };
