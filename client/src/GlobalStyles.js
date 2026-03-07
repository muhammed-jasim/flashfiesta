import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: ${props => props.theme.colors.primary};
    --background: ${props => props.theme.colors.background};
    --text: ${props => props.theme.colors.text};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surfaceSecondary};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;
