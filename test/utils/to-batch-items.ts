import { fromHex } from '@cosmjs/encoding';

export function toBatchItems(datas: Array<{ key: string; value?: string; root: string; proof: string }>) {
  const proofs: Uint8Array[] = [];
  const keys: Uint8Array[] = [];
  const values: Uint8Array[] = [];
  const roots: Uint8Array[] = [];
  for (const d of datas) {
    proofs.push(fromHex(d.proof));
    keys.push(fromHex(d.key));
    if (d.value && d.value.length > 0) values.push(fromHex(d.value));
    roots.push(fromHex(d.root));
  }
  return { proofs, keys, values, roots };
}
