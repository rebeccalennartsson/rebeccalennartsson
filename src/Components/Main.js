import { React, useContext, useState, useEffect } from 'react';
import { ConfigContext } from '../Server/ConfigContext';
import { Form } from './ContactForm';

const Pages = () => {
    const getText = texts => texts.map((t, k) => <p key={k}>{t}</p>)

    const { Config } = useContext(ConfigContext);
    const pages = Config.pages.filter(p => !p.disabled);
    const sections = pages.map((p, key) => {
        const { title, texts } = p;
        return (
            <section
                id={title.replaceAll(' ', '-')}
                className="page-section"
                key={key}
            >
                <h1 className="title">{title}</h1>

                <div className="text">
                    {getText(texts)}
                </div>
            </section>
        );
    });

    return (
        <>
            {sections}
            <Form />
        </>
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

    const { settings: { youtube } } = Config;

    const frames = youtube
        .filter(y => !y.disabled)
        .map((y, key) => {
            return (
                <iframe
                    key={key}
                    className="show-reel"
                    src={y.src}
                    title={y.title}
                    frameBorder="0"
                    allow={y.allow}
                    allowFullScreen />
                );
            });

    return (
        <div className={`App ${isInView ? 'page-section-wrapper' : ''}`}>
            {frames}
            <Pages />
            <>{props.children}</>
        </div>
    );
};
