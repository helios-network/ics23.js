import { Ics23VerifyArgs } from '../../src';
import { fromHex } from '@cosmjs/encoding';

export function toIcs23VerifyArgs(
  data: { key: string; value: string; root: string; proof: string },
  spec: Uint8Array,
): Ics23VerifyArgs {
  return {
    key: fromHex(data.key),
    value: data.value && data.value.length > 0 ? fromHex(data.value) : undefined,
    root: fromHex(data.root),
    proof: fromHex(data.proof),
    spec,
  };
}
