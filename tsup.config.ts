import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	platform: 'node',
	loader: {
		'.json': 'json',
		'.wasm': 'file',
	},
	shims: true,
});


