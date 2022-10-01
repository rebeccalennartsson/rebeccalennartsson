import './Menu.scss';
import { useState, useContext, useEffect } from 'react';
import { PagesContext } from '../Server/PagesContext';

const TextLogo = () => {
    return (
        <h1>
            <a href="#">Rebecca Lennartsson</a>
        </h1>
    )
}

export const Menu = () => {
    const { pages } = useContext(PagesContext);
    const [isOpen, setIsOpen] = useState(false);
    const [contentIsInView, setContentIsInView] = useState(false);
    const [isPhone, setIsPhone] = useState(window.innerWidth < 768);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setContentIsInView((window.innerHeight - 100) < position);
    };

    const handleResize = () => {
        setIsPhone(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const links = pages.map((page, key) => (
        <a
            onClick={() => setIsOpen(false)}
            key={key}
            href={`#${page.title.replaceAll(' ', '-')}`}
        >
            {page.title}
        </a>
    ));

    if (isPhone) {
        if (isOpen) {
            return (
                <div className="menu">
                    <div className="drop-down">
                        {links}
                        <a href="#close-menu" onClick={() => setIsOpen(false)}>X</a>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="menu">
                    <div className={`navigation ${contentIsInView ? 'navigation-inverted' : ''}`}>
                        <TextLogo />
                        <a className={`open-menu-btn ${contentIsInView ? 'open-menu-btn-inverted' : ''}`} href="#open-menu" onClick={() => setIsOpen(true)}>
                            =
                        </a>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div className="menu">
                <div className={`navigation large ${contentIsInView ? 'navigation-inverted ' : ''}`}>
                    <TextLogo />
                    <div>
                        {links}
                    </div>
                </div>
            </div>
        )
    }
};
