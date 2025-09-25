export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { resolveJsonModule: true } }],
  },
  moduleNameMapper: {
    '\\.wasm$': '<rootDir>/test/mocks/wasmPath.ts',
  },
  globals: {
    __dirname: process.cwd(),
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}', '!<rootDir>/rust/pkg/**'],
};
