import { CID } from 'multiformats/cid';
import { SiweMessage } from 'siwe';

import { Recap } from './index';
import { validAbString, isSorted, validString } from './utils';

import valid from '../test/valid.json' assert { type: 'json' };
import invalid from '../test/invalid.json' assert { type: 'json' };

describe('Recap Handling', () => {
  test('should build a recap', () => {
    const recap = new Recap();

    expect(recap.proofs).toEqual([]);

    recap.addAttenuation('https://example.com', 'crud', 'read');
    expect(recap.attenuations).toEqual({
      'https://example.com': { 'crud/read': [{}] },
    });
    expect(recap.proofs).toEqual([]);

    recap.addAttenuation('kepler:example://default/kv', 'kv', 'read');
    expect(recap.attenuations).toEqual({
      'https://example.com': { 'crud/read': [{}] },
      'kepler:example://default/kv': { 'kv/read': [{}] },
    });
    expect(recap.proofs).toEqual([]);

    recap.addAttenuation('kepler:example://default/kv', 'kv', 'write', {
      max: 10,
    });
    expect(recap.attenuations).toEqual({
      'https://example.com': { 'crud/read': [{}] },
      'kepler:example://default/kv': {
        'kv/read': [{}],
        'kv/write': [{ max: 10 }],
      },
    });
    expect(recap.proofs).toEqual([]);

    const cidStr =
      'bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea';
    const cid = CID.parse(cidStr);

    recap.addProof(cidStr);
    expect(recap.proofs).toEqual([cid]);
  });
  test('should decode properly', () => {
    // @ts-ignore
    for (const { message, recap } of Object.values(valid).map(
      // @ts-ignore
      ({ message, recap: { att, prf } }) => ({
        message: new SiweMessage(message),
        // @ts-ignore
        recap: { att, prf: prf.map(CID.decode) },
      })
    )) {
      let decoded: Recap;
      expect(() => (decoded = Recap.extract_and_verify(message))).not.toThrow();
      expect(decoded!.attenuations).toEqual(recap.att);
      // @ts-ignore
      let proofs = recap.prf.map(CID.decode);
      // @ts-ignore
      expect(decoded.proofs).toEqual(proofs);
    }
    // @ts-ignore
    for (const { message } of Object.values(invalid).map(({ message }) => ({
      message: new SiweMessage(message),
    }))) {
      expect(() => Recap.extract_and_verify(message)).toThrow();
    }
  });
});

describe('Utils', () => {
  const unordered = {
    c: 1,
    b: 2,
    ca: 3,
    bnested: {
      c: [3, 2, 1],
      b: 2,
    },
  };
  const ordered = {
    b: 2,
    bnested: {
      b: 2,
      c: [3, 2, 1],
    },
    c: 1,
    ca: 3,
  };
  const validStrings = ['crud', 'kepler', 'https-proto'];
  const validAbilityStrings = ['crud/read', 'kepler/*', 'https/put'];
  const invalidAbilityStrings = [
    'crud',
    'crud/read/write',
    'with a/space',
    'with/a space',
  ];

  test('should test for ordering', () => {
    expect(isSorted(ordered)).toBeTruthy();
    expect(isSorted(unordered)).toBeFalsy();
  });
  test('should test for valid strings', () => {
    validStrings.forEach(str => expect(validString(str)).toBeTruthy());
    validAbilityStrings.forEach(str => {
      expect(validAbString(str)).toBeTruthy();
    });
    invalidAbilityStrings.forEach(str => {
      expect(validAbString(str)).toBeFalsy();
    });
  });
});
