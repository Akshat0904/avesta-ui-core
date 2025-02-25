module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
	moduleNameMapper: {
		'^@calculator/(.*)$': '<rootDir>/src/modules/calculator/$1'
	},
	testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
