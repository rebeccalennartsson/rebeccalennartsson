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

const Link = (props) => {
    const { event, title, navigate } = props;
    const href = navigate === null ? title.replaceAll(' ', '-') : navigate;
    return (
        <a onClick={event} href={`#${href}`}>
            {title}
        </a>
    );
}

export const Menu = () => {
    const MEDIA_QUERY_BRAKE = 768;
    const { pages } = useContext(PagesContext);
    const [isOpen, setIsOpen] = useState(false);
    const [contentIsInView, setContentIsInView] = useState(false);
    const [isPhone, setIsPhone] = useState(window.innerWidth < MEDIA_QUERY_BRAKE);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setContentIsInView((window.innerHeight - 100) < position);
    };

    const handleResize = () => {
        setIsPhone(window.innerWidth < MEDIA_QUERY_BRAKE);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const links = pages.map((page, key) => <Link event={() => setIsOpen(false)} key={key} title={page.title} navigate={null} />);

    if (isPhone) {
        if (isOpen) {
            return (
                <div className="menu">
                    <div className="drop-down">
                        {links}
                        <Link event={() => setIsOpen(false)} title="Kontakt" navigate="form" />
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
                        <Link event={() => setIsOpen(false)} title="Kontakt" navigate="form" />
                    </div>
                </div>
            </div>
        )
    }
};
