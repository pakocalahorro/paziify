module.exports = {
    NativeModules: {},
    Platform: { OS: 'ios', select: (obj) => obj.ios },
    StyleSheet: { create: (s) => s },
    AsyncStorage: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
    }
};
