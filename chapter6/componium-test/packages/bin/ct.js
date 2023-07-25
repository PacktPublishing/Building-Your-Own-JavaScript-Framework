#!/usr/bin/env node
import runner from "../runner/cli.js";
import yargs from "yargs/yargs";
import { Enviroments } from "../util/env.js";

yargs(process.argv.slice(2))
  .scriptName("ct")
  .usage("$0 [<tests>...]")
  .command(
    "* [<tests>...]",
    "the default test command",
    () => {},
    (args) => {
      let env = Enviroments.Node;
      if (args.browser) {
        env = Enviroments.Browser;
      }
      const options = {
        keepAlive: args.keepAlive,
      };
      runner(args.tests, env, options);
    }
  )

  .boolean("browser")
  .alias("browser", ["b"])
  .describe("browser", "Run the test in a web browser")

  .boolean("keepAlive")
  .describe("keepAlive", "Keep the web browser alive to debug tests")

  .help().argv;
