export interface Guide {
    name: string;
    avatar: string;
}

export const GUIDES: Guide[] = [
    { name: 'Aria', avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_aria.webp' },
    { name: 'Éter', avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_eter.webp' },
    { name: 'Ziro', avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_ziro.webp' },
    { name: 'Gaia', avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_gaia.webp' }
];

export const getGuideAvatar = (name?: string): string | undefined => {
    if (!name) return undefined;
    const guide = GUIDES.find(g => g.name.toLowerCase() === name.toLowerCase());
    return guide?.avatar;
};
