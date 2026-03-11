import '@testing-library/jest-native/extend-expect';

// Set up mock environment variables for Supabase to prevent test crashes
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// MOCKS DE INFRAESTRUCTURA UI
jest.mock('react-native-reanimated', () => {
    const React = require('react');
    const mockAnimation = { duration: () => mockAnimation, delay: () => mockAnimation, springify: () => mockAnimation };
    return {
        __esModule: true,
        default: { call: jest.fn(), createAnimatedComponent: (c: any) => c, View: require('react-native').View, Text: require('react-native').Text },
        createAnimatedComponent: (c: any) => c,
        useSharedValue: (v: any) => ({ value: v }),
        useAnimatedStyle: () => ({}),
        useAnimatedProps: () => ({}),
        withTiming: (v: any) => v,
        withRepeat: (v: any) => v,
        withSequence: (...args: any[]) => args[0],
        withSpring: (v: any) => v,
        withDelay: (t: any, v: any) => v,
        runOnJS: (fn: any) => fn,
        FadeInUp: mockAnimation,
        FadeInRight: mockAnimation,
        FadeIn: mockAnimation,
        interpolate: (v: any, input: any, output: any) => output[0],
        interpolateColor: (v: any, input: any, output: any) => output[0],
        Extrapolate: { CLAMP: 'clamp' },
        Easing: {
            linear: (v: any) => v,
            out: (v: any) => (fn: any) => fn,
            exp: (v: any) => v,
        },
        View: ({ children, style }: any) => React.createElement('View', { style }, children),
        Text: ({ children, style }: any) => React.createElement('Text', { style }, children),
        ScrollView: ({ children, style }: any) => React.createElement('ScrollView', { style }, children),
    };
});

// Mock de React Native Skia
jest.mock('@shopify/react-native-skia', () => {
    const React = require('react');
    return {
        Canvas: ({ children, style }: any) => React.createElement('View', { style }, children),
        Path: () => null,
        Circle: () => null,
        Group: ({ children }: any) => React.createElement('View', null, children),
        LinearGradient: () => null,
        vec: () => ({ x: 0, y: 0 }),
        Skia: {
            Path: {
                Make: () => ({
                    moveTo: jest.fn().mockReturnThis(),
                    quadTo: jest.fn().mockReturnThis(),
                    cubicTo: jest.fn().mockReturnThis(),
                    lineTo: jest.fn().mockReturnThis(),
                    close: jest.fn().mockReturnThis(),
                })
            }
        }
    };
});

jest.mock('expo-image', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        Image: (props: any) => React.createElement(View, props),
    };
});

jest.mock('expo-linear-gradient', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        LinearGradient: (props: any) => React.createElement(View, props),
    };
});

jest.mock('expo-haptics', () => ({
    selectionAsync: jest.fn(),
    notificationAsync: jest.fn(),
    impactAsync: jest.fn(),
}));

jest.mock('expo-blur', () => ({
    BlurView: (props: any) => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View, props);
    },
}));

// Mock de navegación para evitar errores de Link/Navigation
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
        useRoute: () => ({
            params: {},
        }),
        useFocusEffect: jest.fn(),
    };
});
// Mock de Safe Area Context
jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    return {
        SafeAreaProvider: ({ children }: any) => children,
        SafeAreaView: ({ children }: any) => children,
        useSafeAreaInsets: () => inset,
        useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    };
});

// Mock de SVG
jest.mock('react-native-svg', () => {
    const React = require('react');
    const { View } = require('react-native');
    const mockComponent = (name: string) => (props: any) => React.createElement(View, { ...props, 'data-svg-component': name });
    return {
        Svg: mockComponent('Svg'),
        Circle: mockComponent('Circle'),
        Path: mockComponent('Path'),
        Rect: mockComponent('Rect'),
        G: mockComponent('G'),
        // Añadir más si fuera necesario
    };
});

// Mock de Iconos
jest.mock('@expo/vector-icons', () => ({
    Ionicons: (props: any) => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View, props);
    },
}));

// Mock de Worklets (Reanimatd dep)
jest.mock('react-native-worklets', () => ({
    Worklets: {
        createRunInJS: (fn: any) => fn,
        createRunOnRuntime: (fn: any) => fn,
    },
}), { virtual: true });

// MOCKS ADICIONALES PARA EXPO
jest.mock('expo-video', () => ({
    VideoView: (props: any) => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View, props);
    },
    useVideoPlayer: () => ({
        play: jest.fn(),
        pause: jest.fn(),
    }),
}));

jest.mock('expo-constants', () => ({
    expoConfig: {
        extra: {
            supabaseUrl: 'mock-url',
            supabaseAnonKey: 'mock-key',
        },
    },
}));

jest.mock('expo-device', () => ({
    modelName: 'Mock Device',
}));

jest.mock('expo-notifications', () => ({
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
}));
