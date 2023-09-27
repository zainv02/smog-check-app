import React from "react";
import { Link } from 'react-router-dom';
import './TwoButtonsPage.css'; // Import CSS file


class TwoButtonsPage extends React.Component
{
    render(){
        return (
            <div className="button-container">
                <Link to="/user-info" className="large-button">New Customer</Link>
                <Link to="/returning-user" className="large-button">Returning Customer</Link>
            </div>
        );
    }
}

export default TwoButtonsPage