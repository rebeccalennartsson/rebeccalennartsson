import React from 'react';
import './App.scss';
import Header from './Components/Header';
import { Main } from './Components/Main';
import { Config } from './Server/Config';
import { ConfigContext } from './Server/ConfigContext';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Config: Config,
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
