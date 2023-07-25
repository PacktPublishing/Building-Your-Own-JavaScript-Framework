import { Worker } from "node:worker_threads";
import { ComponiumStatus } from "../util/env.js";
import makeDebug from "debug";
const debug = makeDebug("NodeExecutor");

class NodeExecutor {
  constructor(targets) {
    this.targets = targets;
    debug("NodeExecutor targets:", targets);
  }
  async execute() {
    let testSuites = this.targets.length;
    let failed = false;
    console.log("Testing in Node.js", process.version);
    return new Promise(async (resolve) => {
      const workers = [];
      this.targets.forEach((target) => {
        // Create the worker.
        const workerPromise = new Promise((res) => {
          const worker = new Worker("./" + target);
          // Listen for messages from the worker and print them.
          worker.on("message", (msg) => {
            if (msg === ComponiumStatus.Fail) {
              failed = true;
            }
            if (msg === ComponiumStatus.Pass || msg === ComponiumStatus.Fail) {
              testSuites--;
            }
            res(msg);
          });
        });
        workers.push(workerPromise);
      });

      Promise.allSettled(workers).then(() => {
        if (testSuites === 0) {
          if (failed) {
            return resolve({
              status: ComponiumStatus.Fail,
            });
          } else {
            return resolve({
              status: ComponiumStatus.Pass,
            });
          }
        }
      });
    });
  }
}

export default NodeExecutor;
