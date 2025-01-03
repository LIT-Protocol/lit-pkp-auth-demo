import {
  isError,
  isObject,
  isString
} from "./chunk-ZPFGUXRO.mjs";

// src/parseConstructorArguments.js
import { sprintf } from "sprintf-js";
import AssertionError from "assertion-error";
function parseConstructorArguments(...argv) {
  let options;
  let sprintfArgs;
  if (argv.length === 0) {
    options = {};
    sprintfArgs = [];
  } else if (isError(argv[0])) {
    options = { cause: argv[0] };
    sprintfArgs = argv.slice(1);
  } else if (typeof argv[0] === "object") {
    options = {};
    for (const k in argv[0]) {
      if (Object.prototype.hasOwnProperty.call(argv[0], k)) {
        options[k] = argv[0][k];
      }
    }
    sprintfArgs = argv.slice(1);
  } else {
    if (!isString(argv[0])) {
      throw new AssertionError(
        "first argument to VError, or WError constructor must be a string, object, or Error"
      );
    }
    options = {};
    sprintfArgs = argv;
  }
  if (!isObject(options))
    throw new AssertionError("options (object) is required");
  if (options.meta && !isObject(options.meta))
    throw new AssertionError("options.meta must be an object");
  return {
    options,
    shortMessage: sprintfArgs.length === 0 ? "" : sprintf.apply(null, sprintfArgs)
  };
}

export {
  parseConstructorArguments
};
