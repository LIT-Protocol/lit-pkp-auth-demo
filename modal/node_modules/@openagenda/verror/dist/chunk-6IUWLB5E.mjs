import {
  verror_default
} from "./chunk-IS5JM2W6.mjs";
import {
  parseConstructorArguments
} from "./chunk-U4C26WBU.mjs";
import {
  __export
} from "./chunk-QXAXOUZS.mjs";

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
import inherits from "inherits";
import depd from "depd";
var deprecate = depd("@openangeda/verror");
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
  inherits(ExtendedError, verror_default);
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

export {
  BadRequest,
  NotAuthenticated,
  PaymentError,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  Timeout,
  Conflict,
  Gone,
  LengthRequired,
  Unprocessable,
  TooManyRequests,
  GeneralError,
  NotImplemented,
  BadGateway,
  Unavailable,
  http_exports
};
