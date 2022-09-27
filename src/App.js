import React from 'react';
import './App.scss';
import Header from './Components/Header';
import { Main } from './Components/Main';
import { Pages } from './Server/Pages';
import { PagesContext } from './Server/PagesContext';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: Pages,
        };
    }

    render() {
        return (
            <PagesContext.Provider value={this.state}>
                <div>
                    <Header />
                    <Main></Main>
                </div>
            </PagesContext.Provider>
        );
    }
}
