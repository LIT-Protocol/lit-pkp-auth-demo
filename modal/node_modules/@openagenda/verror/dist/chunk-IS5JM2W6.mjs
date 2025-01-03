import {
  parseConstructorArguments
} from "./chunk-U4C26WBU.mjs";
import {
  isError,
  isFunc,
  isObject,
  isString
} from "./chunk-ZPFGUXRO.mjs";
import {
  defineProperties,
  defineProperty
} from "./chunk-RVUDAT5T.mjs";

// src/verror.js
import inherits from "inherits";
import AssertionError from "assertion-error";
var META = "@@verror/meta";
var reserved = [
  "name",
  "message",
  "shortMessage",
  "cause",
  "info",
  "stack",
  "fileName",
  "lineNumber"
];
function mergeMeta(instance, meta2) {
  if (!meta2) {
    return;
  }
  for (const k in meta2) {
    if (Object.prototype.hasOwnProperty.call(meta2, k)) {
      if (reserved.includes(k)) {
        throw new AssertionError(`"${k}" is a reserved meta`);
      }
      instance[META][k] = meta2[k];
      instance[k] = meta2[k];
    }
  }
}
function VError(...args) {
  if (!(this instanceof VError)) {
    return new VError(...args);
  }
  const { options, shortMessage } = parseConstructorArguments(...args);
  const { cause: cause2, constructorOpt, info: info2, name, skipCauseMessage, meta: meta2 } = options;
  let message = shortMessage;
  if (cause2) {
    if (!isError(cause2))
      throw new AssertionError("cause is not an Error");
    if (!skipCauseMessage && cause2.message) {
      message = message === "" ? cause2.message : `${message}: ${cause2.message}`;
    }
  }
  Error.call(this, message);
  if (name) {
    if (!isString(name))
      throw new AssertionError(`error's "name" must be a string`);
    this.name = name;
  }
  this.message = message;
  this.shortMessage = shortMessage;
  if (cause2) {
    this.cause = cause2;
  }
  this.info = {};
  if (info2) {
    for (const k in info2) {
      if (Object.prototype.hasOwnProperty.call(info2, k)) {
        this.info[k] = info2[k];
      }
    }
  }
  defineProperty(this, {
    key: META,
    value: {}
  });
  mergeMeta(this, VError.meta(this));
  mergeMeta(this, meta2);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, constructorOpt || this.constructor);
  } else {
    this.stack = new Error().stack;
  }
}
inherits(VError, Error);
defineProperties(VError.prototype, [
  {
    key: "toString",
    value: function toString() {
      let str = Object.prototype.hasOwnProperty.call(this, "name") && this.name || this.constructor.name || this.constructor.prototype.name;
      if (this.message) {
        str += `: ${this.message}`;
      }
      return str;
    }
  },
  {
    key: "toJSON",
    value: function toJSON() {
      const obj = {
        name: this.name,
        message: this.message,
        shortMessage: this.shortMessage,
        cause: this.cause,
        info: this.info
      };
      for (const key in this[META]) {
        if (Object.prototype.hasOwnProperty.call(this[META], key) && !(key in obj)) {
          obj[key] = this[META][key];
        }
      }
      return obj;
    }
  }
]);
defineProperties(VError, [
  {
    key: "cause",
    value: function cause(err) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      return isError(err.cause) ? err.cause : null;
    }
  },
  {
    key: "info",
    value: function info(err) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      const cause2 = VError.cause(err);
      const rv = cause2 !== null ? VError.info(cause2) : {};
      if (isObject(err.info)) {
        for (const k in err.info) {
          if (Object.prototype.hasOwnProperty.call(err.info, k)) {
            rv[k] = err.info[k];
          }
        }
      }
      return rv;
    }
  },
  {
    key: "meta",
    value: function meta(err) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      const cause2 = VError.cause(err);
      const rv = cause2 !== null ? VError.meta(cause2) : {};
      if (isObject(err[META])) {
        for (const k in err[META]) {
          if (Object.prototype.hasOwnProperty.call(err[META], k)) {
            rv[k] = err[META][k];
          }
        }
      }
      return rv;
    }
  },
  {
    key: "findCauseByName",
    value: function findCauseByName(err, name) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      if (!isString(name))
        throw new AssertionError("name (string) is required");
      if (name.length <= 0)
        throw new AssertionError("name cannot be empty");
      for (let cause2 = err; cause2 !== null; cause2 = VError.cause(cause2)) {
        if (!isError(err))
          throw new AssertionError("cause must be an Error");
        if (cause2.name === name) {
          return cause2;
        }
      }
      return null;
    }
  },
  {
    key: "findCauseByType",
    value: function findCauseByType(err, type) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      if (!isFunc(type))
        throw new AssertionError("type (func) is required");
      for (let cause2 = err; cause2 !== null; cause2 = VError.cause(cause2)) {
        if (!isError(err))
          throw new AssertionError("cause must be an Error");
        if (cause2 instanceof type) {
          return cause2;
        }
      }
      return null;
    }
  },
  {
    key: "hasCauseWithName",
    value: function hasCauseWithName(err, name) {
      return VError.findCauseByName(err, name) !== null;
    }
  },
  {
    key: "hasCauseWithType",
    value: function hasCauseWithType(err, type) {
      return VError.findCauseByType(err, type) !== null;
    }
  },
  {
    key: "fullStack",
    value: function fullStack(err) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      const cause2 = VError.cause(err);
      if (cause2) {
        return `${err.stack}
caused by: ${VError.fullStack(cause2)}`;
      }
      return err.stack;
    }
  },
  {
    key: "errorFromList",
    value: function errorFromList(errors) {
      if (!Array.isArray(errors)) {
        throw new AssertionError("list of errors (array) is required");
      }
      errors.forEach(function(error) {
        if (!isObject(error)) {
          throw new AssertionError("errors ([object]) is required");
        }
      });
      if (errors.length === 0) {
        return null;
      }
      errors.forEach((e) => {
        if (!isError(e))
          throw new AssertionError("error must be an Error");
      });
      if (errors.length === 1) {
        return errors[0];
      }
      return new MultiError(errors);
    }
  },
  {
    key: "errorForEach",
    value: function errorForEach(err, func) {
      if (!isError(err))
        throw new AssertionError("err must be an Error");
      if (!isFunc(func))
        throw new AssertionError("func (func) is required");
      if (err instanceof MultiError) {
        err.errors.forEach((e) => {
          func(e);
        });
      } else {
        func(err);
      }
    }
  }
]);
VError.prototype.name = "VError";
function MultiError(errors) {
  if (!(this instanceof MultiError)) {
    return new MultiError(errors);
  }
  if (!Array.isArray(errors)) {
    throw new AssertionError("list of errors (array) is required");
  }
  if (errors.length <= 0) {
    throw new AssertionError("must be at least one error is required");
  }
  VError.call(
    this,
    {
      cause: errors[0],
      meta: {
        errors: [...errors]
      }
    },
    "first of %d error%s",
    errors.length,
    errors.length === 1 ? "" : "s"
  );
}
inherits(MultiError, VError);
MultiError.prototype.name = "MultiError";
function WError(...args) {
  if (!(this instanceof WError)) {
    return new WError(...args);
  }
  const { options, shortMessage } = parseConstructorArguments(...args);
  options.skipCauseMessage = true;
  VError.call(
    this,
    options,
    "%s",
    shortMessage
  );
}
inherits(WError, VError);
defineProperties(WError.prototype, [
  {
    key: "toString",
    value: function toString2() {
      let str = Object.prototype.hasOwnProperty.call(this, "name") && this.name || this.constructor.name || this.constructor.prototype.name;
      if (this.message) {
        str += `: ${this.message}`;
      }
      if (this.cause && this.cause.message) {
        str += `; caused by ${this.cause.toString()}`;
      }
      return str;
    }
  }
]);
WError.prototype.name = "WError";
VError.VError = VError;
VError.WError = WError;
VError.MultiError = MultiError;
VError.META = META;
var verror_default = VError;

export {
  verror_default
};
