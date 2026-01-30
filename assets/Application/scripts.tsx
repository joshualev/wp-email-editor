/**
 * scripts.tsx - React Application Entry Point
 *
 * This is the main entry point for the EDM Editor React application.
 * It bootstraps the React app by mounting it to the WordPress-provided
 * root element and wrapping it with essential providers.
 *
 * Provider Stack:
 * - React.StrictMode: Enables additional development checks
 * - ThemeProvider: Provides MUI theme context with brand colors
 * - CssBaseline: Normalizes browser styles for consistent rendering
 *
 * The root element ID matches the WordPress template output from
 * `includes/Newsletter/Controller/NewsletterController.php`.
 *
 * @module Application/scripts
 */
import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/Application/globals.css';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from '@/Application/App';
import theme from '@/Application/theme';

const rootElement = document.getElementById('wp-hubspot-edm-editor-root');
if (!rootElement) {
  throw new Error('Unable to find #wp-hubspot-edm-editor-root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);