// Image URLs for the app
export const IMAGES = {
    // HomeScreen backgrounds
    DAY: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1000&q=80',
    NIGHT: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1000&q=80',
    RECOVERY: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&q=80',

    // Session images (Motivational & Joyful Nature)
    SESSION_MOTIVATION: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80', // Sunrise forest
    SESSION_JOY: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', // Mountain meadow
    SESSION_PEACE: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=80', // Calm blue nature
    SESSION_ENERGY: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80', // Golden hour nature
    SESSION_FOCUS: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', // Calm focus
    SESSION_ROUTINE: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', // Organized routine

    // Legacy support (to avoid crashes)
    SESSION_1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    SESSION_2: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&q=80',
    SESSION_3: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
    LEAF_BG: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?w=800&q=80',
    ACADEMY_HERO: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&q=80',

    // Library Premium Photos (Vibrant Nature based on theme)
    LIB_MEDITATION: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&q=80', // Peaceful beach/ocean
    LIB_BOOKS: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1000&q=80', // Nature wisdom
    LIB_STORIES: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&q=80', // Deep forest path
    LIB_ACADEMY: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1000&q=80', // Cosmos/Wisdom
};

export const SESSION_ASSETS: Record<string, string> = {
    'calmasos': IMAGES.SESSION_PEACE,
    'sueno': 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80',
    'mindfulness': IMAGES.SESSION_JOY,
    'resiliencia': IMAGES.SESSION_MOTIVATION,
    'despertar': IMAGES.SESSION_ENERGY,
    'rendimiento': IMAGES.SESSION_FOCUS,
    'salud': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
    'habitos': IMAGES.SESSION_ROUTINE,
    'emocional': 'https://images.unsplash.com/photo-1516589174184-c685eb32140a?w=800&q=80',
    'kids': 'https://images.unsplash.com/photo-1536640712247-c7553ee84681?w=800&q=80',
    'default': IMAGES.SESSION_PEACE,
};
