import { base58btc } from 'multiformats/bases/base58';
import { base64url } from 'multiformats/bases/base64';
import { CID } from 'multiformats/cid';
import serialize from 'canonicalize';

/**
 * PlainJSON type definition.
 * 
 * @typedef PlainJSON
 * @type {boolean|number|string|Object.<string, PlainJSON>|Array.<PlainJSON>}
 */
export type PlainJSON =
  | boolean
  | number
  | string
  | { [key: string]: PlainJSON }
  | Array<PlainJSON>;

/**
 * Attenuation object type definition.
 * 
 * @typedef AttObj
 * @type {Object.<string, Object.<string, Array.<PlainJSON>>>}
 */
export type AttObj = { [key: string]: { [key: string]: Array<PlainJSON> } };

/** @private */
const stringRegex = /^[a-zA-Z0-9.*_+-]+$/g;
/** @private */
const abilityStringRegex = /^[a-zA-Z0-9.*_+-]+\/[a-zA-Z0-9.*_+-]+$/g;

/**
 * Check if the input string is a valid string Regex.
 *
 * @param {string} str - The input string.
 * @returns {boolean} - Returns true if the input string is valid, otherwise false.
 */
export const validString = (str: string) => str.match(stringRegex) !== null;

/**
 * Check if the input string is a valid ability string Regex.
 *
 * @param {string} str - The input string.
 * @returns {boolean} - Returns true if the input string is valid, otherwise false.
 */
export const validAbString = (str: string) =>
  str.match(abilityStringRegex) !== null;

/**
 * Encode recap details (an attenuation object and a list of CIDs) into a base64 representation to be append the the Recap URI.
 *
 * @param {AttObj} att - The attenuation object.
 * @param {Array.<CID>} prf - An array of proof CIDs.
 * @returns {string} - Returns the base64url encoded component of a ReCap URI.
 */
export const encodeRecap = (att: AttObj, prf: Array<CID>) =>
  base64url.encoder.baseEncode(
    new TextEncoder().encode(
      serialize({
        att: att,
        prf: prf.map(cid => cid.toV1().toString(base58btc.encoder)),
      })
    )
  );

/**
 * Decode the base64 component of a ReCap URI into recap details (an attenuation object and a list of CIDs).
 *
 * @param {string} recap - The base64url encoded component ReCap URI.
 * @returns {Object} - An object containing a decoded att property as an attenuation object, and a decoded prf property as an array of CID objects.
 * @throws {Error} - Throws an error if the ReCap URI is invalid.
 */
export const decodeRecap = (
  recap: string
): { att: AttObj; prf: Array<CID> } => {
  const { att, prf } = JSON.parse(
    new TextDecoder().decode(base64url.decoder.baseDecode(recap))
  );

  // check the att is an object
  if (!(att instanceof Object) || Array.isArray(att)) {
    throw new Error('Invalid attenuation object');
  }
  // check the prf is a list
  if (!Array.isArray(prf) || prf.some(cid => typeof cid !== 'string')) {
    throw new Error('Invalid proof list');
  }

  checkAtt(att);

  if (!isSorted(att)) {
    throw new Error('Attenuation object is not properly sorted');
  }

  return {
    att,
    prf: prf.map((cid: string) => CID.parse(cid, base58btc)),
  };
};

/**
 * Check if the input attenuation object is valid.
 *
 * @param {AttObj} att - The input attenuation object.
 * @returns {boolean} - Returns true if the input attenuation object is valid, otherwise false.
 * @throws {Error} - Throws an error if the attenuation object contains invalid entries.
 */
export const checkAtt = (att: AttObj): att is AttObj => {
  // TODO ensure the att keys are valid URIs
  // because URIs are so broad, there's no easy/efficient way to do this
  for (const ob of Object.values(att)) {
    // check the att entries are objects
    if (!(ob instanceof Object)) {
      throw new Error('Invalid attenuation object');
    }
    for (const [ab, nb] of Object.entries(ob)) {
      // check the ability strings are valid
      if (!validAbString(ab)) {
        throw new Error(`Invalid ability string: ${ab}`);
      }
      // check the nota-bene list is a list of objects
      if (
        !Array.isArray(nb) ||
        nb.some(n => !(n instanceof Object) || Array.isArray(n))
      ) {
        throw new Error(`Invalid nota-bene list for ${ab}`);
      }
    }
  }
  return true;
};

/**
 * Check if the input object is sorted.
 *
 * @param {PlainJSON} obj - The input object.
 * @returns {boolean} - Returns true if the input object is sorted, otherwise false.
 */
export const isSorted = (obj: PlainJSON): boolean => {
  if (Array.isArray(obj)) {
    // its an array
    return obj.every(isSorted);
  } else if (obj instanceof Object) {
    // its an object
    const keys = Object.keys(obj);
    return (
      Object.keys(obj)
        .sort()
        .every((v, i) => v === keys[i]) && Object.values(obj).every(isSorted)
    );
  } else {
    // its a primitive
    return true;
  }
};
