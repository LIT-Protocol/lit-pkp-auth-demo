import {
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
  http_exports
} from "./chunk-6IUWLB5E.mjs";
import {
  verror_default
} from "./chunk-IS5JM2W6.mjs";
import "./chunk-U4C26WBU.mjs";
import "./chunk-ZPFGUXRO.mjs";
import "./chunk-RVUDAT5T.mjs";
import "./chunk-QXAXOUZS.mjs";

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
export {
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
  verror_default as VError,
  src_default as default
};
