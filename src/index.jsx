import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const app = (
    <StrictMode>
        <App path={window.location.pathname} />
    </StrictMode>
);

// Built pages arrive prerendered by scripts/prerender.js; the dev server sends an empty root.
if (container.hasChildNodes()) {
    hydrateRoot(container, app);
} else {
    createRoot(container).render(app);
}
