import {
  init,
  defaultIavlSpec,
  defaultTendermintSpec,
  defaultSmtSpec,
  verifyMembership,
  verifyNonMembership,
  calculateExistenceRoot,
} from '../src';
import { toIcs23VerifyArgs } from './utils/to-ics23-verify-args';

import iavl_exist_left from './testdata/iavl/exist_left.json';
import iavl_exist_right from './testdata/iavl/exist_right.json';
import iavl_exist_middle from './testdata/iavl/exist_middle.json';
import iavl_nonexist_left from './testdata/iavl/nonexist_left.json';
import iavl_nonexist_right from './testdata/iavl/nonexist_right.json';
import iavl_nonexist_middle from './testdata/iavl/nonexist_middle.json';
import tendermint_exist_left from './testdata/tendermint/exist_left.json';
import tendermint_exist_right from './testdata/tendermint/exist_right.json';
import tendermint_exist_middle from './testdata/tendermint/exist_middle.json';
import tendermint_nonexist_left from './testdata/tendermint/nonexist_left.json';
import tendermint_nonexist_right from './testdata/tendermint/nonexist_right.json';
import tendermint_nonexist_middle from './testdata/tendermint/nonexist_middle.json';
import smt_exist_left from './testdata/smt/exist_left.json';
import smt_exist_right from './testdata/smt/exist_right.json';
import smt_exist_middle from './testdata/smt/exist_middle.json';
import smt_nonexist_left from './testdata/smt/nonexist_left.json';
import smt_nonexist_right from './testdata/smt/nonexist_right.json';
import smt_nonexist_middle from './testdata/smt/nonexist_middle.json';

describe('single proof verification', () => {
  beforeAll(async () => {
    await init();
  });

  describe('iavl', () => {
    test('exist_left', () => {
      const v = toIcs23VerifyArgs(iavl_exist_left, defaultIavlSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('exist_right', () => {
      const v = toIcs23VerifyArgs(iavl_exist_right, defaultIavlSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('exist_middle', () => {
      const v = toIcs23VerifyArgs(iavl_exist_middle, defaultIavlSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_left', () => {
      const v = toIcs23VerifyArgs(iavl_nonexist_left, defaultIavlSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_right', () => {
      const v = toIcs23VerifyArgs(iavl_nonexist_right, defaultIavlSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_middle', () => {
      const v = toIcs23VerifyArgs(iavl_nonexist_middle, defaultIavlSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });
  });

  describe('tendermint', () => {
    beforeAll(async () => {
      await init();
    });

    test('exist_left', () => {
      const v = toIcs23VerifyArgs(tendermint_exist_left, defaultTendermintSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('exist_right', () => {
      const v = toIcs23VerifyArgs(tendermint_exist_right, defaultTendermintSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('exist_middle', () => {
      const v = toIcs23VerifyArgs(tendermint_exist_middle, defaultTendermintSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_left', () => {
      const v = toIcs23VerifyArgs(tendermint_nonexist_left, defaultTendermintSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_right', () => {
      const v = toIcs23VerifyArgs(tendermint_nonexist_right, defaultTendermintSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_middle', () => {
      const v = toIcs23VerifyArgs(tendermint_nonexist_middle, defaultTendermintSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });
  });

  describe('smt', () => {
    beforeAll(async () => {
      await init();
    });

    test('exist_left', () => {
      const v = toIcs23VerifyArgs(smt_exist_left, defaultSmtSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('exist_right', () => {
      const v = toIcs23VerifyArgs(smt_exist_right, defaultSmtSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('exist_middle', () => {
      const v = toIcs23VerifyArgs(smt_exist_middle, defaultSmtSpec());
      const ok = verifyMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_left', () => {
      const v = toIcs23VerifyArgs(smt_nonexist_left, defaultSmtSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_right', () => {
      const v = toIcs23VerifyArgs(smt_nonexist_right, defaultSmtSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });

    test('nonexist_middle', () => {
      const v = toIcs23VerifyArgs(smt_nonexist_middle, defaultSmtSpec());
      const ok = verifyNonMembership(v);
      expect(ok).toBe(true);
    });
  });
});

describe('single proof utilities', () => {
  beforeAll(async () => {
    await init();
  });

  test('calculateExistenceRoot should produce the correct root hash', () => {
    const v = toIcs23VerifyArgs(iavl_exist_left, defaultIavlSpec());
    const root = calculateExistenceRoot(v.proof);
    expect(root).toEqual(v.root);
  });
});
