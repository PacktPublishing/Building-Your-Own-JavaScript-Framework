import { isBrowser } from "../util/env.js";

let chai;

if (isBrowser()) {
  chai = window.chai;
} else {
  chai = await import("chai");
}

let expect = chai.expect;
let assert = chai.assert;
let should = chai.should;

export { expect, assert, should };
