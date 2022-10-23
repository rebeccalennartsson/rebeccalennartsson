import { React, useContext, useState, useEffect } from 'react';
import { ConfigContext } from '../Server/ConfigContext';
import { Form } from './ContactForm';

const Pages = () => {
    const { Config } = useContext(ConfigContext);
    const pages = Config.pages.filter(p => !p.disabled);
    const sections = pages.map((p, key) => {
        const { title, text } = p;
        return (
            <section
                id={title.replaceAll(' ', '-')}
                className="page-section"
                key={key}
            >
                <h1 className="title">{title}</h1>
                <div className="text">{text}</div>
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
    return (
        <div className={`App ${isInView ? 'page-section-wrapper' : ''}`}>
            {!youtube.disabled ? (
                <iframe
                    className="show-reel"
                    src={youtube.src}
                    title={youtube.title}
                    frameBorder="0"
                    allow={youtube.allow}
                    allowFullScreen />
            ) : null}

            <Pages />
            <>{props.children}</>
        </div>
    );
};
