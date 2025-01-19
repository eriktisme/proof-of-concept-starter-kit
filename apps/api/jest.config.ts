import type { Config } from 'jest'

process.env.DATABASE_URL = ''

const config: Config = {
  moduleNameMapper: {
    '@/data/(.*)': '<rootDir>/src/data/$1',
  },
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}

export default config
