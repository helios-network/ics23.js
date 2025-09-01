import {
  init,
  defaultIavlSpec,
  defaultTendermintSpec,
  defaultSmtSpec,
  verifyBatchMembership,
  verifyBatchNonMembership,
  buildBatchProof,
  compressBatchProof,
  decompressBatchProof,
} from '../src';
import { toBatchItems } from './utils/to-batch-items';

import i_iavl_exist_left from './testdata/iavl/exist_left.json';
import i_iavl_exist_right from './testdata/iavl/exist_right.json';
import i_iavl_exist_middle from './testdata/iavl/exist_middle.json';
import i_iavl_nonexist_left from './testdata/iavl/nonexist_left.json';
import i_iavl_nonexist_right from './testdata/iavl/nonexist_right.json';
import i_iavl_nonexist_middle from './testdata/iavl/nonexist_middle.json';
import t_exist_left from './testdata/tendermint/exist_left.json';
import t_exist_right from './testdata/tendermint/exist_right.json';
import t_exist_middle from './testdata/tendermint/exist_middle.json';
import t_nonexist_left from './testdata/tendermint/nonexist_left.json';
import t_nonexist_right from './testdata/tendermint/nonexist_right.json';
import t_nonexist_middle from './testdata/tendermint/nonexist_middle.json';
import s_exist_left from './testdata/smt/exist_left.json';
import s_exist_right from './testdata/smt/exist_right.json';
import s_exist_middle from './testdata/smt/exist_middle.json';
import s_nonexist_left from './testdata/smt/nonexist_left.json';
import s_nonexist_right from './testdata/smt/nonexist_right.json';
import s_nonexist_middle from './testdata/smt/nonexist_middle.json';

describe('batch proof verification', () => {
  beforeAll(async () => {
    await init();
  });

  describe('iavl', () => {
    test('batch_exist', () => {
      const data = [
        i_iavl_exist_left,
        i_iavl_exist_right,
        i_iavl_exist_middle,
        i_iavl_nonexist_left,
        i_iavl_nonexist_right,
        i_iavl_nonexist_middle,
      ];
      const { proofs, keys, values, roots } = toBatchItems(data);
      const batch = buildBatchProof(proofs);
      const spec = defaultIavlSpec();
      const root = roots[0];
      const ok = verifyBatchMembership({ proof: batch, spec, root, keys: [keys[0]], values: [values[0]] });
      expect(ok).toBe(true);
    });

    test('batch_nonexist', () => {
      const data = [
        i_iavl_exist_left,
        i_iavl_exist_right,
        i_iavl_exist_middle,
        i_iavl_nonexist_left,
        i_iavl_nonexist_right,
        i_iavl_nonexist_middle,
      ];
      const { proofs, keys, roots } = toBatchItems(data);
      const batch = buildBatchProof(proofs);
      const spec = defaultIavlSpec();
      const root = roots[4];
      const ok = verifyBatchNonMembership({ proof: batch, spec, root, keys: [keys[4]] });
      expect(ok).toBe(true);
    });
  });

  describe('tendermint', () => {
    test('batch_exist', () => {
      const data = [t_exist_left, t_exist_right, t_exist_middle, t_nonexist_left, t_nonexist_right, t_nonexist_middle];
      const { proofs, keys, values, roots } = toBatchItems(data);
      const batch = buildBatchProof(proofs);
      const spec = defaultTendermintSpec();
      const root = roots[2];
      const ok = verifyBatchMembership({ proof: batch, spec, root, keys: [keys[2]], values: [values[2]] });
      expect(ok).toBe(true);
    });

    test('batch_nonexist', () => {
      const data = [t_exist_left, t_exist_right, t_exist_middle, t_nonexist_left, t_nonexist_right, t_nonexist_middle];
      const { proofs, keys, roots } = toBatchItems(data);
      const batch = buildBatchProof(proofs);
      const spec = defaultTendermintSpec();
      const root = roots[5];
      const ok = verifyBatchNonMembership({ proof: batch, spec, root, keys: [keys[5]] });
      expect(ok).toBe(true);
    });
  });

  describe('smt', () => {
    test('batch_exist', () => {
      const data = [s_exist_left, s_exist_right, s_exist_middle, s_nonexist_left, s_nonexist_right, s_nonexist_middle];
      const { proofs, keys, values, roots } = toBatchItems(data);
      const batch = buildBatchProof(proofs);
      const spec = defaultSmtSpec();
      const root = roots[0];
      const ok = verifyBatchMembership({ proof: batch, spec, root, keys: [keys[0]], values: [values[0]] });
      expect(ok).toBe(true);
    });

    test('batch_nonexist', () => {
      const data = [s_exist_left, s_exist_right, s_exist_middle, s_nonexist_left, s_nonexist_right, s_nonexist_middle];
      const { proofs, keys, roots } = toBatchItems(data);
      const batch = buildBatchProof(proofs);
      const spec = defaultSmtSpec();
      const root = roots[4];
      const ok = verifyBatchNonMembership({ proof: batch, spec, root, keys: [keys[4]] });
      expect(ok).toBe(true);
    });
  });
});

describe('batch proof utilities', () => {
  beforeAll(async () => {
    await init();
  });

  test('should correctly compress and decompress a batch proof', () => {
    const data = [s_exist_left, s_exist_right, s_exist_middle, s_nonexist_left, s_nonexist_right, s_nonexist_middle];
    const { proofs, keys, values, roots } = toBatchItems(data);
    const batch = buildBatchProof(proofs);
    const compressed = compressBatchProof(batch);
    const decompressed = decompressBatchProof(compressed);

    const spec = defaultSmtSpec();
    const root = roots[0];

    const ok = verifyBatchMembership({ proof: decompressed, spec, root, keys: [keys[0]], values: [values[0]] });
    expect(ok).toBe(true);
  });
});
