import { React, useContext, useState, useEffect } from 'react';
import { PagesContext } from '../Server/PagesContext';
import { Form } from './ContactForm';

const Pages = () => {
    const { pages } = useContext(PagesContext);
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
    const [isInView, setIsInView] = useState(false);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setIsInView((window.innerHeight / 2) < position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`App ${isInView ? 'page-section-wrapper' : ''}`}>
            <Pages />
            <>{props.children}</>
        </div>
    );
};
