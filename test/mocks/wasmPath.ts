import path from 'path';

export default path.resolve(
	path.dirname(new URL(import.meta.url).pathname),
	'../../rust/pkg/ics23_wasm_bg.wasm',
);
