import './Menu.scss';
import { useState, useContext } from 'react';
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
            <a onClick={closeLinks}>X</a>
        </div>
    );
};

export const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <MenuItems isOpen={isOpen} closeLinks={() => setIsOpen(false)} />
            {isOpen ? null : (
                <a className="menu-toggle" onClick={() => setIsOpen(true)}>
                    =
                </a>
            )}
        </div>
    );
};
