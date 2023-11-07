import { Route, Routes } from '@solidjs/router';
import { type Component } from 'solid-js';

import { ErrorProvider } from './contexts/errorState';
import { LoadingStateProvider, useLoadingState } from './contexts/loadingState';
import { SessionStateProvider, useSessionState } from './contexts/sessionState';
import Finish from './views/Finish';
import Home from './views/Home';
import InvoicePage from './views/InvoicePage';
import LicensePlateInfo from './views/LicensePlateInfo';
import SignPage from './views/SignPage';
import UserInfo from './views/UserInfo';

import { Panel, Section } from '$components/Layout';

const App: Component = () => {

    return (
        <Section class='h-screen max-h-screen bg-light-60 py-8'>
            <Panel class='relative h-fit max-h-full w-[768px] max-w-[768px] overflow-y-scroll'>
                <ErrorProvider>
                    <LoadingStateProvider>
                        <SessionStateProvider exclude={[ '/', '/plate-info' ]}>
                            <Routes>
                                <Route path='/' component={Home} />
                                <Route path='/plate-info' component={LicensePlateInfo}/>
                                <Route path='/user-info' component={UserInfo}/>
                                <Route path='/sign' component={SignPage} />
                                <Route path='/invoice' component={InvoicePage} />
                                <Route path='/finish' component={Finish} />
                                <Route path='/*' element={<p class='text-9xl text-red-500'>404! Nothing here!</p>} />
                            </Routes>
                            {/* <_Debugger /> */}
                        </SessionStateProvider>
                    </LoadingStateProvider>
                </ErrorProvider>
            </Panel>
        </Section>
    );

};

const _Debugger: Component = () => {

    const { promiseCount } = useLoadingState();
    const { valid, checking } = useSessionState();

    return (
        <div class='fixed left-0 top-0'>
            <p>Loading Promise Count: {promiseCount()}</p>
            <p>Session valid? {checking() ? 'checking...' : (valid() ? 'true' : 'false')}</p>
        </div>
    );

};

export default App;
