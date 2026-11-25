import React from 'react';
import './App.scss';
import Header from './Components/Header';
import { Main } from './Components/Main';
import { Config } from './Server/Config';
import { ConfigContext } from './Server/ConfigContext';

export const servicePageForPath = (pages, path) => {
    const slug = path.replace(/^\/+|\/+$/g, '');
    return pages.find(p => !p.disabled && p.slug && p.slug === slug) || null;
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Config: Config,
            servicePage: servicePageForPath(Config.pages, props.path),
        };
    }

    render() {
        return (
            <ConfigContext.Provider value={this.state}>
                <div>
                    <Header />
                    <Main></Main>
                </div>
            </ConfigContext.Provider>
        );
    }
}
