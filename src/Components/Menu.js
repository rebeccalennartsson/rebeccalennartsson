import './Menu.scss';
import { useState, useContext, useEffect, useRef } from 'react';
import { ConfigContext } from '../Server/ConfigContext';

const sectionIdFor = title => title.replaceAll(' ', '-');

const TextLogo = () => {
    return (
        <h1>
            <a href="/rebeccalennartsson">Rebecca Lennartsson</a>
        </h1>
    )
}

const Link = (props) => {
    const { event, title, navigate, isCurrent } = props;
    const href = navigate === null ? sectionIdFor(title) : navigate;
    return (
        <a
            onClick={event}
            href={`#${href}`}
            className={isCurrent ? 'is-current' : undefined}
            aria-current={isCurrent ? 'true' : undefined}
        >
            {title}
        </a>
    );
}

export const Menu = () => {
    const MEDIA_QUERY_BRAKE = 821;
    const { Config } = useContext(ConfigContext);
    const [isOpen, setIsOpen] = useState(false);
    const [contentIsInView, setContentIsInView] = useState(false);
    const [isPhone, setIsPhone] = useState(window.innerWidth < MEDIA_QUERY_BRAKE);
    const [currentSection, setCurrentSection] = useState(null);
    const dropDownRef = useRef(null);
    const openButtonRef = useRef(null);
    const wasOpen = useRef(false);

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

    // Must release on isPhone change too, or widening past the breakpoint while open
    // leaves the page unscrollable.
    useEffect(() => {
        document.body.style.overflow = isOpen && isPhone ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, isPhone]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const closeOnEscape = e => e.key === 'Escape' && setIsOpen(false);
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isOpen]);

    useEffect(() => {
        const overlay = dropDownRef.current;
        if (!overlay) {
            return;
        }
        const focusableItems = () => [...overlay.querySelectorAll('a[href], button')];
        const first = focusableItems()[0];
        if (first) {
            first.focus();
        }

        const keepFocusInside = e => {
            if (e.key !== 'Tab') {
                return;
            }
            const items = focusableItems();
            if (items.length === 0) {
                return;
            }
            const edge = e.shiftKey ? items[0] : items[items.length - 1];
            if (document.activeElement === edge) {
                e.preventDefault();
                (e.shiftKey ? items[items.length - 1] : items[0]).focus();
            }
        };
        overlay.addEventListener('keydown', keepFocusInside);
        return () => overlay.removeEventListener('keydown', keepFocusInside);
    }, [isOpen, isPhone]);

    // Without this, closing drops focus to the top of the document.
    useEffect(() => {
        if (wasOpen.current && !isOpen && openButtonRef.current) {
            openButtonRef.current.focus();
        }
        wasOpen.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        const sections = Config.pages
            .filter(p => !p.disabled)
            .map(p => sectionIdFor(p.title))
            .concat(Config.settings.contact.disabled ? [] : ['form'])
            .map(id => document.getElementById(id))
            .filter(Boolean);

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                const inBand = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (inBand.length > 0) {
                    setCurrentSection(inBand[0].target.id);
                }
            },
            // A band across the upper-middle of the viewport, not the whole of it.
            { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, [Config]);

    const pages = Config.pages.filter(p => !p.disabled);
    const links = pages.map((page, key) => (
        <Link
            event={() => setIsOpen(false)}
            key={key}
            title={page.title}
            navigate={null}
            isCurrent={currentSection === sectionIdFor(page.title)}
        />
    ));
    const contactLink = !Config.settings.contact.disabled
        ? (
            <Link
                event={() => setIsOpen(false)}
                title="KONTAKT"
                navigate="form"
                isCurrent={currentSection === 'form'}
            />
        )
        : null;

    if (isPhone) {
        if (isOpen) {
            return (
                <nav className="menu" aria-label="Huvudmeny">
                    <div
                        className="drop-down"
                        id="huvudmeny"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Meny"
                        ref={dropDownRef}
                    >
                        <button
                            className="close-menu-btn"
                            type="button"
                            aria-label="Stäng meny"
                            onClick={() => setIsOpen(false)}
                        >
                            &times;
                        </button>
                        {links}
                        {contactLink}
                    </div>
                </nav>
            )
        } else {
            return (
                <nav className="menu" aria-label="Huvudmeny">
                    <div className={`navigation ${contentIsInView ? 'navigation-inverted' : ''}`}>
                        <TextLogo />
                        <button
                            className={`open-menu-btn ${contentIsInView ? 'open-menu-btn-inverted' : ''}`}
                            type="button"
                            aria-label="Öppna meny"
                            aria-expanded={isOpen}
                            aria-controls="huvudmeny"
                            onClick={() => setIsOpen(true)}
                            ref={openButtonRef}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </nav>
            )
        }
    } else {
        return (
            <nav className="menu" aria-label="Huvudmeny">
                <div className={`navigation large ${contentIsInView ? 'navigation-inverted ' : ''}`}>
                    <TextLogo />
                    <div>
                        {links}
                        {contactLink}
                    </div>
                </div>
            </nav>
        )
    }
};
