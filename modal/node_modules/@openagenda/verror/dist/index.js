var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  BadGateway: () => BadGateway,
  BadRequest: () => BadRequest,
  Conflict: () => Conflict,
  Forbidden: () => Forbidden,
  GeneralError: () => GeneralError,
  Gone: () => Gone,
  LengthRequired: () => LengthRequired,
  MethodNotAllowed: () => MethodNotAllowed,
  NotAcceptable: () => NotAcceptable,
  NotAuthenticated: () => NotAuthenticated,
  NotFound: () => NotFound,
  NotImplemented: () => NotImplemented,
  PaymentError: () => PaymentError,
  Timeout: () => Timeout,
  TooManyRequests: () => TooManyRequests,
  Unavailable: () => Unavailable,
  Unprocessable: () => Unprocessable,
  VError: () => verror_default,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/verror.js
var import_inherits = __toESM(require("inherits"));
var import_assertion_error2 = __toESM(require("assertion-error"));

// src/assert.js
function isError(arg) {
  return Object.prototype.toString.call(arg) === "[object Error]" || arg instanceof Error;
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isString(arg) {
  return typeof arg === "string";
}
function isFunc(arg) {
  return typeof arg === "function";
}

// src/parseConstructorArguments.js
var import_sprintf_js = require("sprintf-js");
var import_assertion_error = __toESM(require("assertion-error"));
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
      throw new import_assertion_error.default(
        "first argument to VError, or WError constructor must be a string, object, or Error"
      );
    }
    options = {};
    sprintfArgs = argv;
  }
  if (!isObject(options))
    throw new import_assertion_error.default("options (object) is required");
  if (options.meta && !isObject(options.meta))
    throw new import_assertion_error.default("options.meta must be an object");
  return {
    options,
    shortMessage: sprintfArgs.length === 0 ? "" : import_sprintf_js.sprintf.apply(null, sprintfArgs)
  };
}

// src/utils.js
function defineProperty(target, descriptor) {
  descriptor.enumerable = descriptor.enumerable || false;
  descriptor.configurable = true;
  if ("value" in descriptor)
    descriptor.writable = true;
  Object.defineProperty(target, descriptor.key, descriptor);
}
function defineProperties(target, props) {
  for (let i = 0; i < props.length; i++) {
    defineProperty(target, props[i]);
  }
}

// src/verror.js
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
        throw new import_assertion_error2.default(`"${k}" is a reserved meta`);
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
      throw new import_assertion_error2.default("cause is not an Error");
    if (!skipCauseMessage && cause2.message) {
      message = message === "" ? cause2.message : `${message}: ${cause2.message}`;
    }
  }
  Error.call(this, message);
  if (name) {
    if (!isString(name))
      throw new import_assertion_error2.default(`error's "name" must be a string`);
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
(0, import_inherits.default)(VError, Error);
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
        throw new import_assertion_error2.default("err must be an Error");
      return isError(err.cause) ? err.cause : null;
    }
  },
  {
    key: "info",
    value: function info(err) {
      if (!isError(err))
        throw new import_assertion_error2.default("err must be an Error");
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
        throw new import_assertion_error2.default("err must be an Error");
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
        throw new import_assertion_error2.default("err must be an Error");
      if (!isString(name))
        throw new import_assertion_error2.default("name (string) is required");
      if (name.length <= 0)
        throw new import_assertion_error2.default("name cannot be empty");
      for (let cause2 = err; cause2 !== null; cause2 = VError.cause(cause2)) {
        if (!isError(err))
          throw new import_assertion_error2.default("cause must be an Error");
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
        throw new import_assertion_error2.default("err must be an Error");
      if (!isFunc(type))
        throw new import_assertion_error2.default("type (func) is required");
      for (let cause2 = err; cause2 !== null; cause2 = VError.cause(cause2)) {
        if (!isError(err))
          throw new import_assertion_error2.default("cause must be an Error");
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
        throw new import_assertion_error2.default("err must be an Error");
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
        throw new import_assertion_error2.default("list of errors (array) is required");
      }
      errors.forEach(function(error) {
        if (!isObject(error)) {
          throw new import_assertion_error2.default("errors ([object]) is required");
        }
      });
      if (errors.length === 0) {
        return null;
      }
      errors.forEach((e) => {
        if (!isError(e))
          throw new import_assertion_error2.default("error must be an Error");
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
        throw new import_assertion_error2.default("err must be an Error");
      if (!isFunc(func))
        throw new import_assertion_error2.default("func (func) is required");
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
    throw new import_assertion_error2.default("list of errors (array) is required");
  }
  if (errors.length <= 0) {
    throw new import_assertion_error2.default("must be at least one error is required");
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
(0, import_inherits.default)(MultiError, VError);
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
(0, import_inherits.default)(WError, VError);
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

// src/http.js
var http_exports = {};
__export(http_exports, {
  BadGateway: () => BadGateway,
  BadRequest: () => BadRequest,
  Conflict: () => Conflict,
  Forbidden: () => Forbidden,
  GeneralError: () => GeneralError,
  Gone: () => Gone,
  LengthRequired: () => LengthRequired,
  MethodNotAllowed: () => MethodNotAllowed,
  NotAcceptable: () => NotAcceptable,
  NotAuthenticated: () => NotAuthenticated,
  NotFound: () => NotFound,
  NotImplemented: () => NotImplemented,
  PaymentError: () => PaymentError,
  Timeout: () => Timeout,
  TooManyRequests: () => TooManyRequests,
  Unavailable: () => Unavailable,
  Unprocessable: () => Unprocessable,
  VError: () => verror_default
});
var import_inherits2 = __toESM(require("inherits"));
var import_depd = __toESM(require("depd"));
var deprecate = (0, import_depd.default)("@openangeda/verror");
function createError(name, statusCode, className) {
  const ExtendedError = function(...args) {
    if (!(this instanceof ExtendedError)) {
      return new ExtendedError(...args);
    }
    const { options, shortMessage } = parseConstructorArguments(...args);
    options.meta = {
      code: statusCode,
      statusCode,
      className,
      ...options.meta
    };
    verror_default.call(
      this,
      options,
      shortMessage
    );
    deprecate.property(this, "code", "use `statusCode` instead of `code`");
  };
  Object.defineProperty(ExtendedError, "name", { configurable: true, value: name });
  (0, import_inherits2.default)(ExtendedError, verror_default);
  ExtendedError.prototype.name = name;
  return ExtendedError;
}
var BadRequest = createError("BadRequest", 400, "bad-request");
var NotAuthenticated = createError("NotAuthenticated", 401, "not-authenticated");
var PaymentError = createError("PaymentError", 402, "payment-error");
var Forbidden = createError("Forbidden", 403, "forbidden");
var NotFound = createError("NotFound", 404, "not-found");
var MethodNotAllowed = createError("MethodNotAllowed", 405, "method-not-allowed");
var NotAcceptable = createError("NotAcceptable", 406, "not-acceptable");
var Timeout = createError("Timeout", 408, "timeout");
var Conflict = createError("Conflict", 409, "conflict");
var Gone = createError("Gone", 410, "gone");
var LengthRequired = createError("LengthRequired", 411, "length-required");
var Unprocessable = createError("Unprocessable", 422, "unprocessable");
var TooManyRequests = createError("TooManyRequests", 429, "too-many-requests");
var GeneralError = createError("GeneralError", 500, "general-error");
var NotImplemented = createError("NotImplemented", 501, "not-implemented");
var BadGateway = createError("BadGateway", 502, "bad-gateway");
var Unavailable = createError("Unavailable", 503, "unavailable");

// src/index.js
var httpAliases = {
  400: BadRequest,
  401: NotAuthenticated,
  402: PaymentError,
  403: Forbidden,
  404: NotFound,
  405: MethodNotAllowed,
  406: NotAcceptable,
  408: Timeout,
  409: Conflict,
  410: Gone,
  411: LengthRequired,
  422: Unprocessable,
  429: TooManyRequests,
  500: GeneralError,
  501: NotImplemented,
  502: BadGateway,
  503: Unavailable
};
Object.assign(verror_default, http_exports, httpAliases);
var src_default = verror_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BadGateway,
  BadRequest,
  Conflict,
  Forbidden,
  GeneralError,
  Gone,
  LengthRequired,
  MethodNotAllowed,
  NotAcceptable,
  NotAuthenticated,
  NotFound,
  NotImplemented,
  PaymentError,
  Timeout,
  TooManyRequests,
  Unavailable,
  Unprocessable,
  VError
});
