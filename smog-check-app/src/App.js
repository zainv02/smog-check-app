import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TwoButtonsPage from './components/TwoButtonsPage/TwoButtonsPage.jsx';
import NewUser from './components/NewUser/NewUser';
import ReturningUser from './components/ReturningUser/ReturningUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-info" element={<NewUser />} />
        <Route path="/" element={<TwoButtonsPage />} />
        <Route path="/returning-user" element={<ReturningUser />} />
      </Routes>
    </Router>
  );
}

export default App;
