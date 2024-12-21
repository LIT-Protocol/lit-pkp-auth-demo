import { CID } from 'multiformats/cid';
import {
  AttObj,
  PlainJSON,
  encodeRecap,
  decodeRecap,
  validString,
  checkAtt,
} from './utils';
import { SiweMessage } from 'siwe';

export * from './utils';

export { AttObj, PlainJSON, CID };
const urnRecapPrefix = 'urn:recap:';

/**
 * Recap class handles the creation, merging, and decoding of ReCap objects
 */
export class Recap {
  #prf: Array<CID>;
  #att: AttObj;

  /**
   * Constructs a Recap instance
   *
   * @param att - The input attenuation object (default is an empty object {})
   * @param prf - The input proof array (default is an empty array [])
   */
  constructor(att: AttObj = {}, prf: Array<CID> | Array<string> = []) {
    checkAtt(att);
    this.#att = att;
    this.#prf = prf.map(cid =>
      typeof cid === 'string' ? CID.parse(cid) : cid
    );
  }

  /**
   * Gets the proofs array of the Recap object
   *
   * @returns An Array of CID objects
   */
  get proofs(): Array<CID> {
    return this.#prf;
  }

   /**
   * Gets the attenuation object of the Recap object
   *
   * @returns An attenuation object (AttObj)
   */
  get attenuations(): AttObj {
    return this.#att;
  }

  /**
   * Calculates the statement field of a SIWE recap-transformed-statement
   *
   * @returns A string representing the statement constructed from the Recap object
   */
  get statement(): string {
    let statement =
      'I further authorize the stated URI to perform the following actions on my behalf: ';

    let section = 1;
    for (const resource of Object.keys(this.attenuations).sort()) {
      const resourceAbilities = Object.keys(this.attenuations[resource])
        .sort()
        .reduce((acc, cur) => {
          const [namespace, name] = cur.split('/');
          if (acc[namespace] === undefined) {
            acc[namespace] = [name];
          } else {
            acc[namespace].push(name);
          }
          return acc;
        }, {} as { [key: string]: Array<string> });

      for (const [namespace, names] of Object.entries(resourceAbilities)) {
        statement += `(${section}) '${namespace}': ${names
          .map(n => `'${n}'`)
          .join(', ')} for '${resource}'. `;
        section += 1;
      }
    }

    // Strip trailing statement at the end.
    statement = statement.slice(0, -1);

    return statement;
  }

  /**
   * Adds a new proof to the proofs collection of the Recap object
   *
   * @param cid - A CID (Content Identifier) object or its string representation
   */
  addProof(cid: string | CID) {
    if (typeof cid === 'string') {
      this.#prf.push(CID.parse(cid));
    } else {
      this.#prf.push(cid);
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
  addAttenuation(
    resource: string,
    namespace = '*',
    name = '*',
    restriction: { [key: string]: PlainJSON } = {}
  ) {
    if (!validString(namespace)) {
      throw new Error('Invalid ability namespace');
    }
    if (!validString(name)) {
      throw new Error('Invalid ability name');
    }

    const abString = `${namespace}/${name}`;
    const ex = this.#att[resource];

    if (ex !== undefined) {
      if (ex[abString] !== undefined) {
        ex[abString].push(restriction);
      } else {
        ex[abString] = [restriction];
      }
    } else {
      this.#att[resource] = { [abString]: [restriction] };
    }
  }

  /**
   * Merges another Recap object with the current Recap object
   *
   * @param other - The other Recap object to be merged
   */
  merge(other: Recap) {
    this.#prf.push(...other.proofs.filter(cid => !this.#prf.includes(cid)));

    for (const [resource, abilities] of Object.entries(other.attenuations)) {
      if (this.#att[resource] !== undefined) {
        const ex = this.#att[resource];
        for (const [ability, restrictions] of Object.entries(abilities)) {
          if (
            ex[ability] === undefined ||
            ex[ability].length === 0 ||
            ex[ability].every(r => Object.keys(r).length === 0)
          ) {
            ex[ability] = restrictions;
          } else {
            ex[ability].push(...restrictions);
          }
        }
      } else {
        this.#att[resource] = abilities;
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
  static decode_urn(recap: string): Recap {
    if (!recap.startsWith(urnRecapPrefix)) {
      throw new Error('Invalid recap urn');
    }

    const { att, prf } = decodeRecap(recap.slice(urnRecapPrefix.length));
    return new Recap(att, prf);
  }

  /**
   * Extracts the Recap object from a SiweMessage instance
   *
   * @param siwe - A SiweMessage instance
   * @returns A Recap object extracted from the input SiweMessage
   * @throws Will throw an error if the SiweMessage doesn't have any resources
   */
  static extract(siwe: SiweMessage): Recap {
    if (siwe.resources === undefined) {
      throw new Error('No resources in SiweMessage');
    }
    const last_index = siwe.resources.length - 1;
    return Recap.decode_urn(siwe.resources[last_index]);
  }

  /**
   * Extracts and verifies a Recap object from a SiweMessage instance
   *
   * @param siwe - A SiweMessage instance
   * @returns A verified Recap object extracted from the input SiweMessage
   * @throws Will throw an error if the SiweMessage has an invalid statement
   */
  static extract_and_verify(siwe: SiweMessage): Recap {
    const recap = Recap.extract(siwe);
    if (
      siwe.statement === undefined ||
      !siwe.statement.endsWith(recap.statement)
    ) {
      throw new Error('Invalid statement');
    }
    return recap;
  }

  /**
   * Adds a Recap object to a SiweMessage
   *
   * @param siwe - The input SiweMessage instance to be modified
   * @returns A modified SiweMessage instance with the Recap object added
   */
  add_to_siwe_message(siwe: SiweMessage): SiweMessage {
    try {
      // try merge with existing recap
      if (
        siwe.statement === undefined ||
        siwe.resources === undefined ||
        siwe.resources.length === 0
      ) {
        throw new Error('no recap');
      }
      const other = Recap.extract_and_verify(siwe);
      const previousStatement = other.statement;
      other.merge(this);
      siwe.statement =
        siwe.statement.slice(0, -previousStatement.length) + other.statement;
      siwe.resources[siwe.resources.length - 1] = other.encode();
      return siwe;
    } catch (e) {
      // no existing recap, just apply it
      siwe.statement =
        siwe.statement === undefined
          ? this.statement
          : siwe.statement + ' ' + this.statement;
      siwe.resources =
        siwe.resources === undefined
          ? [this.encode()]
          : [...siwe.resources, this.encode()];
      return siwe;
    }
  }

  /**
   * Encodes a Recap object into a Recap URI
   *
   * @returns A Recap URI string
   */
  encode(): string {
    return `${urnRecapPrefix}${encodeRecap(this.#att, this.#prf)}`;
  }
}
