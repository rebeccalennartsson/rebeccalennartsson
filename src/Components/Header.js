import { Menu } from './Menu';
import SEO from '../Server/SEO';
const Header = () => {
    return (
        <header className="App-header">
            <SEO
                title="Rebecca är utbildad sångerska och musikalartist vid Balettakademien i Göteborg."
                description="Rebecca hjälper er med sång på erat kommande bröllop, dop, begravning eller event! Godkänd för F-skatt."
                name="Rebecca Lennartsson"
                type="article" />
            <Menu />
        </header>
    );
};

export default Header;
