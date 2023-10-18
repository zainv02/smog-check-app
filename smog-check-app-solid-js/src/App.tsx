import { Router, Route, Routes } from '@solidjs/router';
import type { Component } from 'solid-js';

import Home from './views/Home/Home';
import LicensePlateEnter from './views/LicensePlateEnter/LicensePlateEnter';
import UserInfo from './views/UserInfo/UserInfo';

const App: Component = () => {

    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' component={Home} />
                    <Route path='/plate-info' component={LicensePlateEnter}/>
                    <Route path='/user-info' component={UserInfo}/>
                </Routes>
            </Router>
        </>
    );

};

export default App;
