"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// node_modules/canonicalize/lib/canonicalize.js
var require_canonicalize = __commonJS({
  "node_modules/canonicalize/lib/canonicalize.js"(exports, module2) {
    "use strict";
    module2.exports = function serialize2(object) {
      if (typeof object === "number" && isNaN(object)) {
        throw new Error("NaN is not allowed");
      }
      if (typeof object === "number" && !isFinite(object)) {
        throw new Error("Infinity is not allowed");
      }
      if (object === null || typeof object !== "object") {
        return JSON.stringify(object);
      }
      if (object.toJSON instanceof Function) {
        return serialize2(object.toJSON());
      }
      if (Array.isArray(object)) {
        const values2 = object.reduce((t, cv, ci) => {
          const comma = ci === 0 ? "" : ",";
          const value = cv === void 0 || typeof cv === "symbol" ? null : cv;
          return `${t}${comma}${serialize2(value)}`;
        }, "");
        return `[${values2}]`;
      }
      const values = Object.keys(object).sort().reduce((t, cv) => {
        if (object[cv] === void 0 || typeof object[cv] === "symbol") {
          return t;
        }
        const comma = t.length === 0 ? "" : ",";
        return `${t}${comma}${serialize2(cv)}:${serialize2(object[cv])}`;
      }, "");
      return `{${values}}`;
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CID: () => CID,
  Recap: () => Recap,
  checkAtt: () => checkAtt,
  decodeRecap: () => decodeRecap,
  encodeRecap: () => encodeRecap,
  isSorted: () => isSorted,
  validAbString: () => validAbString,
  validString: () => validString
});
module.exports = __toCommonJS(src_exports);

// node_modules/multiformats/vendor/varint.js
var encode_1 = encode;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode.bytes = offset - oldOffset + 1;
  return out;
}
var decode = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/multiformats/src/varint.js
var decode2 = (data, offset = 0) => {
  const code = varint_default.decode(data, offset);
  return [code, varint_default.decode.bytes];
};
var encodeTo = (int, target, offset = 0) => {
  varint_default.encode(int, target, offset);
  return target;
};
var encodingLength = (int) => {
  return varint_default.encodingLength(int);
};

// node_modules/multiformats/src/bytes.js
var empty = new Uint8Array(0);
var equals = (aa, bb) => {
  if (aa === bb)
    return true;
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
};
var coerce = (o) => {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
};

// node_modules/multiformats/src/hashes/digest.js
var create = (code, digest) => {
  const size = digest.byteLength;
  const sizeOffset = encodingLength(code);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest(code, size, digest, bytes);
};
var decode3 = (multihash) => {
  const bytes = coerce(multihash);
  const [code, sizeOffset] = decode2(bytes);
  const [size, digestOffset] = decode2(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);
  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code, size, digest, bytes);
};
var equals2 = (a, b) => {
  if (a === b) {
    return true;
  } else {
    const data = (
      /** @type {{code?:unknown, size?:unknown, bytes?:unknown}} */
      b
    );
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
};
var Digest = class {
  /**
   * Creates a multihash digest.
   *
   * @param {Code} code
   * @param {Size} size
   * @param {Uint8Array} digest
   * @param {Uint8Array} bytes
   */
  constructor(code, size, digest, bytes) {
    this.code = code;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/vendor/base-x.js
function base(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode3(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      pbegin++;
    }
    var it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length2;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode5(string) {
    var buffer = decodeUnsafe(string);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name} character`);
  }
  return {
    encode: encode3,
    decodeUnsafe,
    decode: decode5
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/multiformats/src/bases/base.js
var Encoder = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   */
  constructor(name, prefix, baseEncode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {API.Multibase<Prefix>}
   */
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(text:string) => Uint8Array} baseDecode
   */
  constructor(name, prefix, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = /** @type {number} */
    prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  /**
   * @param {string} text
   */
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  /**
   * @template {string} OtherPrefix
   * @param {API.UnibaseDecoder<OtherPrefix>|ComposedDecoder<OtherPrefix>} decoder
   * @returns {ComposedDecoder<Prefix|OtherPrefix>}
   */
  or(decoder) {
    return or(this, decoder);
  }
};
var ComposedDecoder = class {
  /**
   * @param {Decoders<Prefix>} decoders
   */
  constructor(decoders) {
    this.decoders = decoders;
  }
  /**
   * @template {string} OtherPrefix
   * @param {API.UnibaseDecoder<OtherPrefix>|ComposedDecoder<OtherPrefix>} decoder
   * @returns {ComposedDecoder<Prefix|OtherPrefix>}
   */
  or(decoder) {
    return or(this, decoder);
  }
  /**
   * @param {string} input
   * @returns {Uint8Array}
   */
  decode(input) {
    const prefix = (
      /** @type {Prefix} */
      input[0]
    );
    const decoder = this.decoders[prefix];
    if (decoder) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
var or = (left, right) => new ComposedDecoder(
  /** @type {Decoders<L|R>} */
  {
    ...left.decoders || { [
      /** @type API.UnibaseDecoder<L> */
      left.prefix
    ]: left },
    ...right.decoders || { [
      /** @type API.UnibaseDecoder<R> */
      right.prefix
    ]: right }
  }
);
var Codec = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   * @param {(text:string) => Uint8Array} baseDecode
   */
  constructor(name, prefix, baseEncode, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name, prefix, baseEncode);
    this.decoder = new Decoder(name, prefix, baseDecode);
  }
  /**
   * @param {Uint8Array} input
   */
  encode(input) {
    return this.encoder.encode(input);
  }
  /**
   * @param {string} input
   */
  decode(input) {
    return this.decoder.decode(input);
  }
};
var from = ({ name, prefix, encode: encode3, decode: decode5 }) => new Codec(name, prefix, encode3, decode5);
var baseX = ({ prefix, name, alphabet }) => {
  const { encode: encode3, decode: decode5 } = base_x_default(alphabet, name);
  return from({
    prefix,
    name,
    encode: encode3,
    /**
     * @param {string} text
     */
    decode: (text) => coerce(decode5(text))
  });
};
var decode4 = (string, alphabet, bitsPerChar, name) => {
  const codes = {};
  for (let i = 0; i < alphabet.length; ++i) {
    codes[alphabet[i]] = i;
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name} character`);
    }
    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || 255 & buffer << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
};
var encode2 = (data, alphabet, bitsPerChar) => {
  const pad = alphabet[alphabet.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer >> bits];
    }
  }
  if (bits) {
    out += alphabet[mask & buffer << bitsPerChar - bits];
  }
  if (pad) {
    while (out.length * bitsPerChar & 7) {
      out += "=";
    }
  }
  return out;
};
var rfc4648 = ({ name, prefix, bitsPerChar, alphabet }) => {
  return from({
    prefix,
    name,
    encode(input) {
      return encode2(input, alphabet, bitsPerChar);
    },
    decode(input) {
      return decode4(input, alphabet, bitsPerChar, name);
    }
  });
};

// node_modules/multiformats/src/bases/base58.js
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/src/bases/base32.js
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/src/cid.js
var format = (link, base2) => {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV0(
        bytes,
        baseCache(link),
        /** @type {API.MultibaseEncoder<"z">} */
        base2 || base58btc.encoder
      );
    default:
      return toStringV1(
        bytes,
        baseCache(link),
        /** @type {API.MultibaseEncoder<Prefix>} */
        base2 || base32.encoder
      );
  }
};
var cache = /* @__PURE__ */ new WeakMap();
var baseCache = (cid) => {
  const baseCache2 = cache.get(cid);
  if (baseCache2 == null) {
    const baseCache3 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache3);
    return baseCache3;
  }
  return baseCache2;
};
var CID = class {
  /**
   * @param {Version} version - Version of the CID
   * @param {Format} code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param {API.MultihashDigest<Alg>} multihash - (Multi)hash of the of the content.
   * @param {Uint8Array} bytes
   *
   */
  constructor(version, code, multihash, bytes) {
    this.code = code;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes;
    this["/"] = bytes;
  }
  /**
   * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
   * please either use `CID.asCID(cid)` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  /**
   * @returns {CID<Data, API.DAG_PB, API.SHA_256, 0>}
   */
  toV0() {
    switch (this.version) {
      case 0: {
        return (
          /** @type {CID<Data, API.DAG_PB, API.SHA_256, 0>} */
          this
        );
      }
      case 1: {
        const { code, multihash } = this;
        if (code !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return (
          /** @type {CID<Data, API.DAG_PB, API.SHA_256, 0>} */
          CID.createV0(
            /** @type {API.MultihashDigest<API.SHA_256>} */
            multihash
          )
        );
      }
      default: {
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
      }
    }
  }
  /**
   * @returns {CID<Data, Format, Alg, 1>}
   */
  toV1() {
    switch (this.version) {
      case 0: {
        const { code, digest } = this.multihash;
        const multihash = create(code, digest);
        return (
          /** @type {CID<Data, Format, Alg, 1>} */
          CID.createV1(this.code, multihash)
        );
      }
      case 1: {
        return (
          /** @type {CID<Data, Format, Alg, 1>} */
          this
        );
      }
      default: {
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
      }
    }
  }
  /**
   * @param {unknown} other
   * @returns {other is CID<Data, Format, Alg, Version>}
   */
  equals(other) {
    return CID.equals(this, other);
  }
  /**
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @param {API.Link<Data, Format, Alg, Version>} self
   * @param {unknown} other
   * @returns {other is CID}
   */
  static equals(self, other) {
    const unknown = (
      /** @type {{code?:unknown, version?:unknown, multihash?:unknown}} */
      other
    );
    return unknown && self.code === unknown.code && self.version === unknown.version && equals2(self.multihash, unknown.multihash);
  }
  /**
   * @param {API.MultibaseEncoder<string>} [base]
   * @returns {string}
   */
  toString(base2) {
    return format(this, base2);
  }
  toJSON() {
    return { "/": format(this) };
  }
  link() {
    return this;
  }
  get [Symbol.toStringTag]() {
    return "CID";
  }
  // Legacy
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `CID(${this.toString()})`;
  }
  /**
   * Takes any input `value` and returns a `CID` instance if it was
   * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
   * it will return value back. If `value` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * `CID` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   *
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @template {unknown} U
   * @param {API.Link<Data, Format, Alg, Version>|U} input
   * @returns {CID<Data, Format, Alg, Version>|null}
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = (
      /** @type {any} */
      input
    );
    if (value instanceof CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code, multihash, bytes } = value;
      return new CID(
        version,
        code,
        /** @type {API.MultihashDigest<Alg>} */
        multihash,
        bytes || encodeCID(version, code, multihash.bytes)
      );
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code } = value;
      const digest = (
        /** @type {API.MultihashDigest<Alg>} */
        decode3(multihash)
      );
      return CID.create(version, code, digest);
    } else {
      return null;
    }
  }
  /**
   *
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @param {Version} version - Version of the CID
   * @param {Format} code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param {API.MultihashDigest<Alg>} digest - (Multi)hash of the of the content.
   * @returns {CID<Data, Format, Alg, Version>}
   */
  static create(version, code, digest) {
    if (typeof code !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code !== DAG_PB_CODE) {
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`
          );
        } else {
          return new CID(version, code, digest, digest.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code, digest.bytes);
        return new CID(version, code, digest, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   *
   * @template {unknown} [T=unknown]
   * @param {API.MultihashDigest<typeof SHA_256_CODE>} digest - Multihash.
   * @returns {CID<T, typeof DAG_PB_CODE, typeof SHA_256_CODE, 0>}
   */
  static createV0(digest) {
    return CID.create(0, DAG_PB_CODE, digest);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @param {Code} code - Content encoding format code.
   * @param {API.MultihashDigest<Alg>} digest - Miltihash of the content.
   * @returns {CID<Data, Code, Alg, 1>}
   */
  static createV1(code, digest) {
    return CID.create(1, code, digest);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   *
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @template {API.Version} Ver
   * @param {API.ByteView<API.Link<Data, Code, Alg, Ver>>} bytes
   * @returns {CID<Data, Code, Alg, Ver>}
   */
  static decode(bytes) {
    const [cid, remainder] = CID.decodeFirst(bytes);
    if (remainder.length) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   *
   * @template {unknown} T
   * @template {number} C
   * @template {number} A
   * @template {API.Version} V
   * @param {API.ByteView<API.Link<T, C, A, V>>} bytes
   * @returns {[CID<T, C, A, V>, Uint8Array]}
   */
  static decodeFirst(bytes) {
    const specs = CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(
      bytes.subarray(prefixSize, prefixSize + specs.multihashSize)
    );
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(
      specs.multihashSize - specs.digestSize
    );
    const digest = new Digest(
      specs.multihashCode,
      specs.digestSize,
      digestBytes,
      multihashBytes
    );
    const cid = specs.version === 0 ? CID.createV0(
      /** @type {API.MultihashDigest<API.SHA_256>} */
      digest
    ) : CID.createV1(specs.codec, digest);
    return [
      /** @type {CID<T, C, A, V>} */
      cid,
      bytes.subarray(specs.size)
    ];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   *
   * @template {unknown} T
   * @template {number} C
   * @template {number} A
   * @template {API.Version} V
   * @param {API.ByteView<API.Link<T, C, A, V>>} initialBytes
   * @returns {{ version:V, codec:C, multihashCode:A, digestSize:number, multihashSize:number, size:number }}
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length2] = decode2(initialBytes.subarray(offset));
      offset += length2;
      return i;
    };
    let version = (
      /** @type {V} */
      next()
    );
    let codec = (
      /** @type {C} */
      DAG_PB_CODE
    );
    if (
      /** @type {number} */
      version === 18
    ) {
      version = /** @type {V} */
      0;
      offset = 0;
    } else {
      codec = /** @type {C} */
      next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = (
      /** @type {A} */
      next()
    );
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return { version, codec, multihashCode, digestSize, multihashSize, size };
  }
  /**
   * Takes cid in a string representation and creates an instance. If `base`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   *
   * @template {string} Prefix
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @template {API.Version} Ver
   * @param {API.ToString<API.Link<Data, Code, Alg, Ver>, Prefix>} source
   * @param {API.MultibaseDecoder<Prefix>} [base]
   * @returns {CID<Data, Code, Alg, Ver>}
   */
  static parse(source, base2) {
    const [prefix, bytes] = parseCIDtoBytes(source, base2);
    const cid = CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
var parseCIDtoBytes = (source, base2) => {
  switch (source[0]) {
    case "Q": {
      const decoder = base2 || base58btc;
      return [
        /** @type {Prefix} */
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base2 || base58btc;
      return [
        /** @type {Prefix} */
        base58btc.prefix,
        decoder.decode(source)
      ];
    }
    case base32.prefix: {
      const decoder = base2 || base32;
      return [
        /** @type {Prefix} */
        base32.prefix,
        decoder.decode(source)
      ];
    }
    default: {
      if (base2 == null) {
        throw Error(
          "To parse non base32 or base58btc encoded CID multibase decoder must be provided"
        );
      }
      return [
        /** @type {Prefix} */
        source[0],
        base2.decode(source)
      ];
    }
  }
};
var toStringV0 = (bytes, cache2, base2) => {
  const { prefix } = base2;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base2.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var toStringV1 = (bytes, cache2, base2) => {
  const { prefix } = base2;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
var encodeCID = (version, code, multihash) => {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
};
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/multiformats/src/bases/base64.js
var base64 = rfc4648({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc4648({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc4648({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc4648({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// src/utils.ts
var import_canonicalize = __toESM(require_canonicalize(), 1);
var stringRegex = /^[a-zA-Z0-9.*_+-]+$/g;
var abilityStringRegex = /^[a-zA-Z0-9.*_+-]+\/[a-zA-Z0-9.*_+-]+$/g;
var validString = (str) => str.match(stringRegex) !== null;
var validAbString = (str) => str.match(abilityStringRegex) !== null;
var encodeRecap = (att, prf) => base64url.encoder.baseEncode(
  new TextEncoder().encode(
    (0, import_canonicalize.default)({
      att,
      prf: prf.map((cid) => cid.toV1().toString(base58btc.encoder))
    })
  )
);
var decodeRecap = (recap) => {
  const { att, prf } = JSON.parse(
    new TextDecoder().decode(base64url.decoder.baseDecode(recap))
  );
  if (!(att instanceof Object) || Array.isArray(att)) {
    throw new Error("Invalid attenuation object");
  }
  if (!Array.isArray(prf) || prf.some((cid) => typeof cid !== "string")) {
    throw new Error("Invalid proof list");
  }
  checkAtt(att);
  if (!isSorted(att)) {
    throw new Error("Attenuation object is not properly sorted");
  }
  return {
    att,
    prf: prf.map((cid) => CID.parse(cid, base58btc))
  };
};
var checkAtt = (att) => {
  for (const ob of Object.values(att)) {
    if (!(ob instanceof Object)) {
      throw new Error("Invalid attenuation object");
    }
    for (const [ab, nb] of Object.entries(ob)) {
      if (!validAbString(ab)) {
        throw new Error(`Invalid ability string: ${ab}`);
      }
      if (!Array.isArray(nb) || nb.some((n) => !(n instanceof Object) || Array.isArray(n))) {
        throw new Error(`Invalid nota-bene list for ${ab}`);
      }
    }
  }
  return true;
};
var isSorted = (obj) => {
  if (Array.isArray(obj)) {
    return obj.every(isSorted);
  } else if (obj instanceof Object) {
    const keys = Object.keys(obj);
    return Object.keys(obj).sort().every((v, i) => v === keys[i]) && Object.values(obj).every(isSorted);
  } else {
    return true;
  }
};

// src/index.ts
var urnRecapPrefix = "urn:recap:";
var _prf, _att;
var _Recap = class {
  /**
   * Constructs a Recap instance
   *
   * @param att - The input attenuation object (default is an empty object {})
   * @param prf - The input proof array (default is an empty array [])
   */
  constructor(att = {}, prf = []) {
    __privateAdd(this, _prf, void 0);
    __privateAdd(this, _att, void 0);
    checkAtt(att);
    __privateSet(this, _att, att);
    __privateSet(this, _prf, prf.map(
      (cid) => typeof cid === "string" ? CID.parse(cid) : cid
    ));
  }
  /**
   * Gets the proofs array of the Recap object
   *
   * @returns An Array of CID objects
   */
  get proofs() {
    return __privateGet(this, _prf);
  }
  /**
  * Gets the attenuation object of the Recap object
  *
  * @returns An attenuation object (AttObj)
  */
  get attenuations() {
    return __privateGet(this, _att);
  }
  /**
   * Calculates the statement field of a SIWE recap-transformed-statement
   *
   * @returns A string representing the statement constructed from the Recap object
   */
  get statement() {
    let statement = "I further authorize the stated URI to perform the following actions on my behalf: ";
    let section = 1;
    for (const resource of Object.keys(this.attenuations).sort()) {
      const resourceAbilities = Object.keys(this.attenuations[resource]).sort().reduce((acc, cur) => {
        const [namespace, name] = cur.split("/");
        if (acc[namespace] === void 0) {
          acc[namespace] = [name];
        } else {
          acc[namespace].push(name);
        }
        return acc;
      }, {});
      for (const [namespace, names] of Object.entries(resourceAbilities)) {
        statement += `(${section}) '${namespace}': ${names.map((n) => `'${n}'`).join(", ")} for '${resource}'. `;
        section += 1;
      }
    }
    statement = statement.slice(0, -1);
    return statement;
  }
  /**
   * Adds a new proof to the proofs collection of the Recap object
   *
   * @param cid - A CID (Content Identifier) object or its string representation
   */
  addProof(cid) {
    if (typeof cid === "string") {
      __privateGet(this, _prf).push(CID.parse(cid));
    } else {
      __privateGet(this, _prf).push(cid);
    }
  }
  /**
   * Adds a new attenuation to the attenuations object of the Recap object
   *
   * @param resource - The resource URI
   * @param namespace - The ability namespace (default is *)
   * @param name - The ability name (default is *)
   * @param restriction - A JSON object containing restrictions or requirements for the action (default is {})
   */
  addAttenuation(resource, namespace = "*", name = "*", restriction = {}) {
    if (!validString(namespace)) {
      throw new Error("Invalid ability namespace");
    }
    if (!validString(name)) {
      throw new Error("Invalid ability name");
    }
    const abString = `${namespace}/${name}`;
    const ex = __privateGet(this, _att)[resource];
    if (ex !== void 0) {
      if (ex[abString] !== void 0) {
        ex[abString].push(restriction);
      } else {
        ex[abString] = [restriction];
      }
    } else {
      __privateGet(this, _att)[resource] = { [abString]: [restriction] };
    }
  }
  /**
   * Merges another Recap object with the current Recap object
   *
   * @param other - The other Recap object to be merged
   */
  merge(other) {
    __privateGet(this, _prf).push(...other.proofs.filter((cid) => !__privateGet(this, _prf).includes(cid)));
    for (const [resource, abilities] of Object.entries(other.attenuations)) {
      if (__privateGet(this, _att)[resource] !== void 0) {
        const ex = __privateGet(this, _att)[resource];
        for (const [ability, restrictions] of Object.entries(abilities)) {
          if (ex[ability] === void 0 || ex[ability].length === 0 || ex[ability].every((r) => Object.keys(r).length === 0)) {
            ex[ability] = restrictions;
          } else {
            ex[ability].push(...restrictions);
          }
        }
      } else {
        __privateGet(this, _att)[resource] = abilities;
      }
    }
  }
  /**
   * Decodes a Recap URI into a Recap object
   *
   * @param recap - The input Recap URI string
   * @returns A Recap object decoded from the input Recap URI
   * @throws Will throw an error if the input string is not a valid Recap URI
   */
  static decode_urn(recap) {
    if (!recap.startsWith(urnRecapPrefix)) {
      throw new Error("Invalid recap urn");
    }
    const { att, prf } = decodeRecap(recap.slice(urnRecapPrefix.length));
    return new _Recap(att, prf);
  }
  /**
   * Extracts the Recap object from a SiweMessage instance
   *
   * @param siwe - A SiweMessage instance
   * @returns A Recap object extracted from the input SiweMessage
   * @throws Will throw an error if the SiweMessage doesn't have any resources
   */
  static extract(siwe) {
    if (siwe.resources === void 0) {
      throw new Error("No resources in SiweMessage");
    }
    const last_index = siwe.resources.length - 1;
    return _Recap.decode_urn(siwe.resources[last_index]);
  }
  /**
   * Extracts and verifies a Recap object from a SiweMessage instance
   *
   * @param siwe - A SiweMessage instance
   * @returns A verified Recap object extracted from the input SiweMessage
   * @throws Will throw an error if the SiweMessage has an invalid statement
   */
  static extract_and_verify(siwe) {
    const recap = _Recap.extract(siwe);
    if (siwe.statement === void 0 || !siwe.statement.endsWith(recap.statement)) {
      throw new Error("Invalid statement");
    }
    return recap;
  }
  /**
   * Adds a Recap object to a SiweMessage
   *
   * @param siwe - The input SiweMessage instance to be modified
   * @returns A modified SiweMessage instance with the Recap object added
   */
  add_to_siwe_message(siwe) {
    try {
      if (siwe.statement === void 0 || siwe.resources === void 0 || siwe.resources.length === 0) {
        throw new Error("no recap");
      }
      const other = _Recap.extract_and_verify(siwe);
      const previousStatement = other.statement;
      other.merge(this);
      siwe.statement = siwe.statement.slice(0, -previousStatement.length) + other.statement;
      siwe.resources[siwe.resources.length - 1] = other.encode();
      return siwe;
    } catch (e) {
      siwe.statement = siwe.statement === void 0 ? this.statement : siwe.statement + " " + this.statement;
      siwe.resources = siwe.resources === void 0 ? [this.encode()] : [...siwe.resources, this.encode()];
      return siwe;
    }
  }
  /**
   * Encodes a Recap object into a Recap URI
   *
   * @returns A Recap URI string
   */
  encode() {
    return `${urnRecapPrefix}${encodeRecap(__privateGet(this, _att), __privateGet(this, _prf))}`;
  }
};
var Recap = _Recap;
_prf = new WeakMap();
_att = new WeakMap();
