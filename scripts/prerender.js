// Renders <App /> to static HTML inside build/index.html's #root, so crawlers that don't
// run JavaScript — which is most AI assistants, ChatGPT included — see the real copy
// instead of an empty <div id="root"></div>. Each service page in Config (one with a
// `slug`) also gets build/<slug>/index.html with its own title, meta tags and JSON-LD.
// Runs as `postbuild`.
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
const { Config } = require(path.join(srcDir, 'Server', 'Config.js'));

const baseUrl = require(path.join(root, 'package.json')).homepage.replace(/\/*$/, '/');
const placeholder = '<div id="root"></div>';
const template = fs.readFileSync(indexPath, 'utf8');
if (!template.includes(placeholder)) {
    throw new Error(`prerender: ${placeholder} not found in build/index.html`);
}

const escapeHtml = value => value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const replaceRequired = (html, pattern, replacer) => {
    if (!pattern.test(html)) {
        throw new Error(`prerender: ${pattern} not found in build/index.html`);
    }
    return html.replace(pattern, replacer);
};

const withAttribute = (html, tagPattern, attribute, value) => replaceRequired(
    html,
    new RegExp(`(<${tagPattern}\\s+${attribute}=")[^"]*(")`),
    (match, before, after) => `${before}${escapeHtml(value)}${after}`
);

const withMeta = (html, key, name, value) => withAttribute(html, `meta\\s+${key}="${name}"`, 'content', value);

const structuredDataFor = (page, url) => {
    const { metaTitle, metaDescription, heading, serviceType, faq } = page.article;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${url}#webpage`,
                url,
                name: metaTitle,
                description: metaDescription,
                inLanguage: 'sv-SE',
                isPartOf: { '@id': `${baseUrl}#website` },
                about: { '@id': `${url}#service` },
                breadcrumb: { '@id': `${url}#breadcrumb` },
            },
            {
                '@type': 'Service',
                '@id': `${url}#service`,
                name: heading,
                serviceType,
                description: metaDescription,
                url,
                provider: { '@id': `${baseUrl}#person` },
                areaServed: { '@type': 'City', name: 'Göteborg' },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Rebecca Lennartsson', item: baseUrl },
                    { '@type': 'ListItem', position: 2, name: heading, item: url },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                isPartOf: { '@id': `${url}#webpage` },
                mainEntity: faq.map(f => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: { '@type': 'Answer', text: f.answer },
                })),
            },
        ],
    };
};

const withServicePageHead = (html, page) => {
    const { metaTitle, metaDescription } = page.article;
    const url = `${baseUrl}${page.slug}/`;
    // Escaped so copy can never close the <script> element early.
    const jsonLd = JSON.stringify(structuredDataFor(page, url)).replace(/</g, '\\u003c');

    let result = replaceRequired(html, /<title>[^<]*<\/title>/, () => `<title>${escapeHtml(metaTitle)}</title>`);
    result = withMeta(result, 'name', 'description', metaDescription);
    result = withAttribute(result, 'link\\s+rel="canonical"', 'href', url);
    result = withMeta(result, 'property', 'og:type', 'website');
    result = withMeta(result, 'property', 'og:url', url);
    result = withMeta(result, 'property', 'og:title', metaTitle);
    result = withMeta(result, 'property', 'og:description', metaDescription);
    result = withMeta(result, 'name', 'twitter:title', metaTitle);
    result = withMeta(result, 'name', 'twitter:description', metaDescription);
    return replaceRequired(result, /<\/head>/, () => `<script type="application/ld+json">${jsonLd}</script></head>`);
};

const withMarkup = (html, pathname) => {
    const markup = renderToString(React.createElement(App, { path: pathname }));
    return html.replace(placeholder, () => `<div id="root">${markup}</div>`);
};

fs.writeFileSync(indexPath, withMarkup(template, '/'));
console.log('prerender: wrote build/index.html');

// GitHub Pages serves build/<slug>/index.html at /<slug>/, so each service page gets its own URL.
Config.pages
    .filter(p => !p.disabled && p.slug)
    .forEach(page => {
        const pageDir = path.join(buildDir, page.slug);
        fs.mkdirSync(pageDir, { recursive: true });
        fs.writeFileSync(
            path.join(pageDir, 'index.html'),
            withMarkup(withServicePageHead(template, page), `/${page.slug}/`)
        );
        console.log(`prerender: wrote build/${page.slug}/index.html`);
    });
