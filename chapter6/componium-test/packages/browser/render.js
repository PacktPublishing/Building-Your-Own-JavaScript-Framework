import * as Eta from "eta";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

Eta.configure({
  views: path.join(__dirname, "views"),
});

let template = "<%~ includeFile('./index.eta', it) %>";

function render(testFiles) {
  const layout = Eta.render(template, {
    message: "Open browser console for test results...",
    testFiles: testFiles,
  });
  return layout;
}

export default render;
