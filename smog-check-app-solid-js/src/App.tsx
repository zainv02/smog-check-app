import type { Component } from 'solid-js';
import { Router, Route, Routes } from '@solidjs/router';
import LicensePlateEnter from './views/LicensePlateEnter/LicensePlateEnter';
import NewUser from './views/NewUser/NewUser';
import ReturningUser from './views/ReturningUser/ReturningUser';

const App: Component = () => {

    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' component={LicensePlateEnter}/>
                    <Route path='/new-user' component={NewUser}/>
                    <Route path='/returning-user' component={ReturningUser}/>
                </Routes>
            </Router>
        </>
    );

};

export default App;
