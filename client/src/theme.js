export const lightTheme = {
    mode: 'light',
    colors: {
        primary: '#0066FF', // Flash Blue
        secondary: '#12B76A', // Accent Green
        accent: '#F43F5E', // Rose/Red accent
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceSecondary: '#F1F5F9',
        text: '#0F172A',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        white: '#FFFFFF',
        dark: '#020617',
    },
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        premium: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    },
    transitions: {
        default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fast: 'all 0.2s ease',
    }
};

export const darkTheme = {
    mode: 'dark',
    colors: {
        primary: '#3B82F6', // Brighter blue for dark mode
        secondary: '#10B981', // Brighter green for dark mode
        accent: '#FB7185', // Brighter rose/red for dark mode
        background: '#000000', // Pure Black
        surface: '#121212', // Very Dark Gray
        surfaceSecondary: '#1E1E1E', // Dark Gray
        text: '#FFFFFF',
        textSecondary: '#A0A0A0',
        border: '#2A2A2A',
        error: '#F87171',
        warning: '#FBBF24',
        success: '#34D399',
        white: '#FFFFFF',
        dark: '#000000',
    },
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.6)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
        premium: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    },
    transitions: {
        default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fast: 'all 0.2s ease',
    }
};
