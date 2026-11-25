import { useContext } from 'react';
import { Menu } from './Menu';
import { ConfigContext } from '../Server/ConfigContext';

const Header = () => {
    const { Config, servicePage } = useContext(ConfigContext);
    const { tagline, services } = Config.settings.hero;

    return (
        <header className="App-header">
            <Menu />
            <div className="hero-intro">
                {servicePage
                    ? <h1 className="hero-tagline">{servicePage.article.heading}</h1>
                    : <p className="hero-tagline">{tagline}</p>}
                <p className="hero-services">{services}</p>
            </div>
        </header>
    );
};

export default Header;
