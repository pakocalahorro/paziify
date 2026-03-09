module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '^../services/supabaseClient$': '<rootDir>/src/__tests__/mocks/supabaseClient.mock.ts',
        '^./supabaseClient$': '<rootDir>/src/__tests__/mocks/supabaseClient.mock.ts',
        '^@react-native-async-storage/async-storage$': '<rootDir>/src/__tests__/mocks/asyncStorage.mock.ts',
        '^react-native$': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|unimodules|@supabase)',
    ],
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
