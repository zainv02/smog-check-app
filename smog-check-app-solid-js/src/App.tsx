import { Router, Route, Routes } from '@solidjs/router';
import type { Component } from 'solid-js';

import Home from './views/Home/Home';
import InvoicePage from './views/InvoicePage/InvoicePage';
import LicensePlateInfo from './views/LicensePlateInfo/LicensePlateInfo';
import UserInfo from './views/UserInfo/UserInfo';

const App: Component = () => {

    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' component={Home} />
                    <Route path='/plate-info' component={LicensePlateInfo}/>
                    <Route path='/user-info' component={UserInfo}/>
                    <Route path='/invoice' component={InvoicePage} />
                    <Route path='/*' element={<p class='text-9xl text-red-500'>404! Nothing here!</p>} />
                </Routes>
            </Router>
        </>
    );

};

export default App;
