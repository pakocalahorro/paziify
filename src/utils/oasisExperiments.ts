import { UserState } from '../types';
import { supabase } from '../services/supabaseClient';

/**
 * Paziify Design System (PDS) v3.0 - Feature Flags & Experiments
 * 
 * This file acts as the central Admin Gate to protect in-development Vanguard Tier features 
 * from regular users in production.
 */

// Central toggle to completely disable/enable all experimental features at once.
export const IS_OASIS_V3_ACTIVE = true;

// Specific Feature Flags tailored for the Sprints
export const Experiments = {
    // Sprint 2
    showNewPortal: false,
    // Sprint 3
    useDynamicBackgroundHome: true, // Let's turn this one on for testing soon
    // Sprint 4
    enableParallaxAndSharedElements: true,
    // Sprint 5
    enableGlobalMiniPlayer: true,
};

/**
 * Checks if the current user has explicitly 'admin' role in Supabase.
 * @param userId - The Supabase Auth User ID
 * @returns boolean indicating if the user is an admin
 */
export const checkIsAdmin = async (userId?: string): Promise<boolean> => {
    if (!IS_OASIS_V3_ACTIVE || !userId) return false;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Admin Check Error:', error);
            return false;
        }

        return data?.role === 'admin';
    } catch (e) {
        console.error('Admin Check Exception:', e);
        return false;
    }
};

import { useApp } from '../context/AppContext';

/**
 * Hooks to be used within the UI to conditionally render the new PDS v3.0 components.
 */
export const adminHooks = {
    /**
     * Use this wrapper to conditionally render unfinished Vanguard components.
     * Example: { useIsAdmin() && <OasisShowcaseButton /> }
     */
    useIsAdmin: () => {
        const { userState } = useApp();
        return IS_OASIS_V3_ACTIVE && userState.role === 'admin';
    }
};
