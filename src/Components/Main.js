import { React, useContext, useState, useEffect } from 'react';
import { ConfigContext } from '../Server/ConfigContext';
import { Form } from './ContactForm';

const PageSection = (props) => {
    const { title, texts } = props;
    return (
        <section id={title.replaceAll(' ', '-')} className="page-section">
            <h2 className="title">{title}</h2>

            <div className="text">
                {texts.map((t, k) => <p key={k}>{t}</p>)}
            </div>
        </section>
    );
};

export const Main = (props) => {
    const { Config } = useContext(ConfigContext);
    const [isInView, setIsInView] = useState(false);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setIsInView((window.innerHeight / 2) < position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            const audioSrc = local ? require(`../audio/${src}`) : src;
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

    // Intro leads so visitors read who she is before meeting a media player.
    const [intro, ...remainingPages] = Config.pages.filter(p => !p.disabled);

    return (
        <main className={`App ${isInView ? 'page-section-wrapper' : ''}`}>
            {intro ? <PageSection title={intro.title} texts={intro.texts} /> : null}
            {frames}
            {audio}
            {remainingPages.map((p, key) => (
                <PageSection key={key} title={p.title} texts={p.texts} />
            ))}
            <Form />
            <>{props.children}</>
        </main>
    );
};
