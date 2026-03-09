module.exports = {
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                order: jest.fn(() => ({
                    range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 }))
                })),
                eq: jest.fn(() => ({
                    select: jest.fn(() => Promise.resolve({ data: [], error: null }))
                }))
            }))
        }))
    }
};
