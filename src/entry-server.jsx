import { renderToString } from 'react-dom/server';
import App from './App';

export { Config } from './Server/Config';

export const render = path => renderToString(<App path={path} />);
