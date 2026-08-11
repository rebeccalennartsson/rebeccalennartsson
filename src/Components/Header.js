import { useContext } from 'react';
import { Menu } from './Menu';
import { ConfigContext } from '../Server/ConfigContext';

const Header = () => {
    const { Config } = useContext(ConfigContext);
    const { tagline, services } = Config.settings.hero;

    return (
        <header className="App-header">
            <Menu />
            <div className="hero-intro">
                <p className="hero-tagline">{tagline}</p>
                <p className="hero-services">{services}</p>
            </div>
        </header>
    );
};

export default Header;
