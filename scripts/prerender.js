// Renders every page to static HTML so crawlers that don't run JavaScript — which is most
// AI assistants, ChatGPT included — see the real copy instead of an empty
// <div id="root"></div>. build/index.html gets the home page; each service page in Config
// (one with a `slug`) gets build/<slug>/index.html with its own title, meta tags and
// JSON-LD. index.jsx hydrates this markup instead of replacing it.
//
// Runs at the end of `yarn build`, after Vite has built the client into build/ and the
// server bundle (src/entry-server.jsx) into build-ssr/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');
const indexPath = path.join(buildDir, 'index.html');

const { render, Config } = await import(path.join(root, 'build-ssr', 'entry-server.js'));

const baseUrl = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).homepage.replace(/\/*$/, '/');
const placeholder = '<div id="root"></div>';
const builtHtml = fs.readFileSync(indexPath, 'utf8');
if (!builtHtml.includes(placeholder)) {
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

const withMarkup = (html, pathname) => html.replace(placeholder, () => `<div id="root">${render(pathname)}</div>`);

// The stylesheet is under 3 kB, so inlining it saves a render-blocking request on phones.
// Its font URLs are absolute, so they still resolve from the inlined copy.
const withInlinedCss = html => {
    const stylesheet = /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/;
    const [, href] = html.match(stylesheet) || [];
    if (!href) {
        throw new Error('prerender: stylesheet link not found in build/index.html');
    }
    const css = fs.readFileSync(path.join(buildDir, href), 'utf8');
    return html.replace(stylesheet, () => `<style>${css}</style>`);
};

// The phone's first screen uses only these weights: 100 for the logo and tagline, 400 for
// the services line. Without a preload the fonts are only discovered once styles apply.
const FIRST_SCREEN_FONT_WEIGHTS = ['100', '400'];

const withFontPreloads = html => {
    const preloads = FIRST_SCREEN_FONT_WEIGHTS.map(weight => {
        const [url] = html.match(new RegExp(`/assets/roboto-latin-${weight}-[\\w-]+\\.woff2`)) || [];
        if (!url) {
            throw new Error(`prerender: font weight ${weight} not found in the stylesheet`);
        }
        return `<link rel="preload" as="font" type="font/woff2" href="${url}" crossorigin>`;
    });
    return replaceRequired(html, /<\/head>/, () => `${preloads.join('')}</head>`);
};

const template = withFontPreloads(withInlinedCss(builtHtml));

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
