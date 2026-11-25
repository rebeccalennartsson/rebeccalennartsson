import { Fragment, useContext } from 'react';
import { ConfigContext } from '../Server/ConfigContext';
import { Form } from './ContactForm';

// Bundled so the files get hashed URLs; a runtime path string alone would 404.
const localAudioUrls = import.meta.glob('../audio/*.mp3', { eager: true, query: '?url', import: 'default' });

const servicePageHref = page => `/${page.slug}/`;

const PageSection = (props) => {
    const { title, texts, linkedPage } = props;
    return (
        <section id={title.replaceAll(' ', '-')} className="page-section">
            <h2 className="title">{title}</h2>

            <div className="text">
                {texts.map((t, k) => <p key={k}>{t}</p>)}
                {linkedPage
                    ? <p><a href={servicePageHref(linkedPage)}>{linkedPage.article.linkText}</a></p>
                    : null}
            </div>
        </section>
    );
};

const ServiceArticle = ({ page, otherPages }) => {
    const { lead, sections, faq } = page.article;
    return (
        <>
            <section className="page-section">
                <div className="text">
                    <p className="lead">{lead}</p>
                </div>
            </section>
            {sections.map((s, key) => (
                <PageSection key={key} title={s.heading} texts={s.texts} />
            ))}
            <section id="vanliga-fragor" className="page-section">
                <h2 className="title">Vanliga frågor</h2>
                <div className="text">
                    {faq.map((f, key) => (
                        <Fragment key={key}>
                            <h3 className="faq-question">{f.question}</h3>
                            <p>{f.answer}</p>
                        </Fragment>
                    ))}
                </div>
            </section>
            {otherPages.length > 0 ? (
                <section className="page-section">
                    <h2 className="title">Fler tillfällen</h2>
                    <div className="text">
                        {otherPages.map(p => (
                            <p key={p.slug}><a href={servicePageHref(p)}>{p.article.linkText}</a></p>
                        ))}
                    </div>
                </section>
            ) : null}
        </>
    );
};

export const Main = (props) => {
    const { Config, servicePage } = useContext(ConfigContext);
    const { settings: { youtube, mp3 } } = Config;

    const frames = youtube
        .filter(y => !y.disabled)
        .map((y, key) => {
            return (
                <section className="page-section" key={key}>
                    <iframe
                        className="show-reel"
                        src={y.src}
                        title={y.title}
                        frameBorder="0"
                        allow={y.allow}
                        allowFullScreen />
                </section>
            );
        });

    const audio = mp3
        .filter(m => !m.disabled)
        .map((m, key) => {
            const { src , title, local, altText } = m;
            const audioSrc = local ? localAudioUrls[`../audio/${src}`] : src;
            return (
                <section
                    key={key}
                    className="page-section"
                >
                    <h2 className="title">{title}</h2>

                    <audio aria-label={altText} preload="metadata" controls>
                        <source src={audioSrc} type="audio/mpeg" />
                        Din webbläsare kan inte spela upp ljudet.
                    </audio>
                </section>
            );
        });

    const enabledPages = Config.pages.filter(p => !p.disabled);
    // Intro leads so visitors read who she is before meeting a media player.
    const [intro, ...remainingPages] = enabledPages;
    const linkedPageFor = p => (p.slug ? p : null);

    return (
        <main className="App">
            {servicePage ? (
                <ServiceArticle
                    page={servicePage}
                    otherPages={enabledPages.filter(p => p.slug && p !== servicePage)}
                />
            ) : (
                <>
                    {intro ? <PageSection title={intro.title} texts={intro.texts} linkedPage={linkedPageFor(intro)} /> : null}
                    {frames}
                    {audio}
                    {remainingPages.map((p, key) => (
                        <PageSection key={key} title={p.title} texts={p.texts} linkedPage={linkedPageFor(p)} />
                    ))}
                </>
            )}
            <Form />
            <>{props.children}</>
        </main>
    );
};
