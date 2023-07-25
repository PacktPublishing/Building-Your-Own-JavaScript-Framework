import CliServer from "./server.js";
import puppeteer from "puppeteer";
import { ComponiumStatus } from "../util/env.js";

class BrowserExecutor {
  constructor(targets, options = {}) {
    this.targets = targets;
    this.options = options;
    this.puppeteerOptions = {
      headless: options.keepAlive ? false : "new",
      devtools: true,
    };
  }
  async execute() {
    const cliServer = new CliServer(this.targets);
    const server = await cliServer.listen();
    const browser = await puppeteer.launch(this.puppeteerOptions);
    const page = await browser.newPage();
    return new Promise(async (resolve) => {
      page.on("console", async (message) => {
        if (
          message.text() === ComponiumStatus.Pass ||
          message.text() === ComponiumStatus.Fail
        ) {
          if (!this.options.keepAlive) {
            await browser.close();
            await cliServer.close();
          }

          if (message.text() === ComponiumStatus.Fail) {
            return resolve({
              status: ComponiumStatus.Fail,
              keepAlive: this.options.keepAlive,
            });
          } else {
            return resolve({
              status: ComponiumStatus.Pass,
              keepAlive: this.options.keepAlive,
            });
          }
        }
        console.log(message.text());
      });
      await page.goto(`http://127.0.0.1:${server.port.port}`);
    });
  }
}

export default BrowserExecutor;
