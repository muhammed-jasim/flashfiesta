import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setThemeMode(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeMode('dark');
        }
    }, []);

    const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

    const muiTheme = createTheme({
        palette: {
            mode: themeMode,
            primary: {
                main: currentTheme.colors.primary,
            },
            secondary: {
                main: currentTheme.colors.secondary,
            },
            background: {
                default: currentTheme.colors.background,
                paper: currentTheme.colors.surface,
            },
            text: {
                primary: currentTheme.colors.text,
                secondary: currentTheme.colors.textSecondary,
            }
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
        }
    });

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme, theme: currentTheme }}>
            <MuiThemeProvider theme={muiTheme}>
                <StyledThemeProvider theme={currentTheme}>
                    {children}
                </StyledThemeProvider>
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
