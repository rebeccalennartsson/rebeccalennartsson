// Renders <App /> to static HTML inside build/index.html's #root, so crawlers that don't
// run JavaScript — which is most AI assistants, ChatGPT included — see the real copy
// instead of an empty <div id="root"></div>. Runs as `postbuild`.
//
// index.js uses createRoot, not hydrateRoot, so this markup is simply replaced once the
// bundle loads. That keeps it free of hydration-mismatch concerns (Menu reads
// window.innerWidth during render) at the cost of a re-render on load.
//
// No extra dependencies: @babel/core and its presets come with react-scripts.

const fs = require('fs');
const path = require('path');
const Module = require('module');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const buildDir = path.join(root, 'build');
const indexPath = path.join(buildDir, 'index.html');

const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, 'asset-manifest.json'), 'utf8'));

// Compile src/ on the fly; stylesheets are irrelevant to the markup.
const compileJs = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
    if (!filename.startsWith(srcDir)) {
        return compileJs(module, filename);
    }
    const { code } = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
        filename,
        babelrc: false,
        configFile: false,
        presets: [
            [require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
            [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
        ],
    });
    module._compile(code, filename);
};
Module._extensions['.scss'] = () => {};
// Resolve bundled media to the same hashed URL webpack emitted.
Module._extensions['.mp3'] = (module, filename) => {
    const key = `static/media/${path.basename(filename)}`;
    const url = manifest.files[key];
    if (!url) {
        throw new Error(`prerender: ${key} not found in asset-manifest.json`);
    }
    module.exports = url;
};

// Menu picks its layout from window.innerWidth during render. Prerender the phone layout,
// since that is what most visitors get.
global.window = { innerWidth: 390 };

const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require(path.join(srcDir, 'App.js')).default;

const markup = renderToString(React.createElement(App));
const html = fs.readFileSync(indexPath, 'utf8');
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) {
    throw new Error(`prerender: ${placeholder} not found in build/index.html`);
}
fs.writeFileSync(indexPath, html.replace(placeholder, `<div id="root">${markup}</div>`));
console.log(`prerender: wrote ${markup.length} characters of markup into build/index.html`);
