import { React, useContext, useState, useEffect } from 'react';
import { PagesContext } from '../Server/PagesContext';

/**
 *
 * @param {{ name: String; value: String; }} props
 * @returns
 */
const NameValue = (props) => {
    const { name, value } = props;
    return (
        <div>
            <span>{name}</span>
            <span>{value}</span>
        </div>
    );
};

/**
 *
 * @param {{ nameValues: [{name: String; value: String;}]|null}} props
 * @returns
 */
const NameValues = (props) => {
    const { nameValues } = props;
    if (!nameValues || nameValues.length <= 0) {
        return <></>;
    }

    return nameValues.map((nv, key) => (
        <NameValue key={key} name={nv.name} value={nv.value} />
    ));
};

const Pages = () => {
    const { pages } = useContext(PagesContext);
    return pages.map((p, key) => {
        const { title, text, name_values } = p;
        return (
            <section
                id={title.replaceAll(' ', '-')}
                className="page-section"
                key={key}
            >
                <h1 className="title">{title}</h1>
                <div className="text">{text}</div>
                <div className="name-values">
                    <NameValues nameValues={name_values} />
                </div>
            </section>
        );
    });
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
