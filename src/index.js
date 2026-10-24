import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// createRoot, not hydrateRoot: it replaces the markup scripts/prerender.js puts in #root.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
