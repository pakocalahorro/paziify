import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// 1. Create the Client with default options
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours (time data remains in cache before garbage collection)
            staleTime: 1000 * 60 * 5,    // 5 minutes (time data is considered fresh)
            retry: 2,
        },
        mutations: {
            retry: 2,
        },
    },
});

// 2. Create the Persister (Save to Disk)
export const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    throttleTime: 1000, // Save at most once every second
});
