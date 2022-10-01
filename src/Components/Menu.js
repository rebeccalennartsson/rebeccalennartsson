import './Menu.scss';
import { useState, useContext, useEffect } from 'react';
import { PagesContext } from '../Server/PagesContext';

/**
 *
 * @param {closeLinks: any; isOpen: Boolean;} props
 * @returns
 */
const MenuItems = (props) => {
    const { closeLinks, isOpen } = props;
    const { pages } = useContext(PagesContext);

    if (!isOpen) {
        return <></>;
    }

    const links = pages.map((page, key) => (
        <a
            onClick={closeLinks}
            key={key}
            href={`#${page.title.replaceAll(' ', '-')}`}
        >
            {page.title}
        </a>
    ));

    return (
        <div className="topnav">
            {links}
            <a href="#close-menu" onClick={closeLinks}>X</a>
        </div>
    );
};

export const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setIsInView((window.innerHeight - 75) < position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const style = {
        'backgroundColor': '#dddddd',
        'boxShadow': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'transition': 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        'opacity': '0.9'
    };

    return (
        <div>
            <MenuItems isOpen={isOpen} closeLinks={() => setIsOpen(false)} />
            {isOpen ? null : (
                <div style={isInView ? style : {}} className="menu-toggle">
                    <h1 style={{'color': isInView ? '#333333' : ''}}>Rebecca Lennartsson</h1>

                    <a style={{'color': isInView ? '#dddddd' : '', 'backgroundColor': isInView ? '#333333' : ''}} href="#menu" onClick={() => setIsOpen(true)}>
                        =
                    </a>
                </div>
            )}
        </div>
    );
};
