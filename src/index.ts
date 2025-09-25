import fs from 'fs/promises';
import path from 'path';
import wasmPath from '../rust/pkg/ics23_wasm_bg.wasm';
import * as wasm from '../rust/pkg/ics23_wasm.js';

export type Ics23BaseArgs = {
  proof: Uint8Array;
  spec: Uint8Array;
  root: Uint8Array;
};

export type Ics23VerifyArgs = Ics23BaseArgs & {
  key: Uint8Array;
  value?: Uint8Array;
};

export type Ics23VerifyBatchArgs = Ics23BaseArgs & {
  keys: Uint8Array[];
  values: Uint8Array[];
};

/* istanbul ignore next */
export class WasmNotInitializedError extends Error {
  constructor() {
    super('The WASM module has not been initialized. Please `await init()` before using any other functions.');
    this.name = 'WasmNotInitializedError';
  }
}

let initialized = false;
function ensureWasmInitialized(): void {
  if (!initialized) throw new WasmNotInitializedError();
}

export async function init(): Promise<void> {
  if (initialized) return;

  let bytes: ArrayBufferLike = (await fs.readFile(path.resolve(__dirname, wasmPath)))?.buffer;
  if (!bytes) throw new Error('Failed to read WASM file');
  // @ts-ignore
  const { instance } = await WebAssembly.instantiate(bytes, {
    './ics23_wasm_bg.js': wasm,
  });
  (wasm as any).__wbg_set_wasm(instance.exports);

  initialized = true;
}

export function defaultIavlSpec(): Uint8Array {
  ensureWasmInitialized();
  return wasm.default_iavl_spec();
}

export function defaultTendermintSpec(): Uint8Array {
  ensureWasmInitialized();
  return wasm.default_tendermint_spec();
}

export function defaultSmtSpec(): Uint8Array {
  ensureWasmInitialized();
  return wasm.default_smt_spec();
}

export function verifyBatchMembership(args: Ics23VerifyBatchArgs): boolean {
  ensureWasmInitialized();
  const { proof, spec, root, keys, values } = args;
  // Pass JS arrays directly, wasm-bindgen shim will map to JsValue[] and our Rust takes js_sys::Array
  return wasm.verify_batch_membership(proof, spec, root, keys, values);
}

export function verifyBatchNonMembership(args: Omit<Ics23VerifyBatchArgs, 'values'>): boolean {
  ensureWasmInitialized();
  const { proof, spec, root, keys } = args;
  // Pass JS arrays directly, wasm-bindgen shim will map to JsValue[] and our Rust takes js_sys::Array
  return wasm.verify_batch_non_membership(proof, spec, root, keys);
}

export function compressBatchProof(proof: Uint8Array): Uint8Array {
  ensureWasmInitialized();
  return wasm.compress_batch_proof(proof);
}

export function decompressBatchProof(proof: Uint8Array): Uint8Array {
  ensureWasmInitialized();
  return wasm.decompress_batch_proof(proof);
}

export function buildBatchProof(proofs: Uint8Array[]): Uint8Array {
  ensureWasmInitialized();
  return wasm.build_batch_proof(proofs);
}

export function verifyMembership(args: Ics23VerifyArgs): boolean {
  ensureWasmInitialized();
  const { proof, spec, root, key, value } = args;
  if (!value) throw new Error('The `value` field is required for membership verification');
  return wasm.verify_membership(proof, spec, root, key, value);
}

export function verifyNonMembership(args: Omit<Ics23VerifyArgs, 'value'>): boolean {
  ensureWasmInitialized();
  const { proof, spec, root, key } = args;
  return wasm.verify_non_membership(proof, spec, root, key);
}

export function calculateExistenceRoot(proof: Uint8Array): Uint8Array {
  ensureWasmInitialized();
  return wasm.calculate_existence_root(proof);
}
