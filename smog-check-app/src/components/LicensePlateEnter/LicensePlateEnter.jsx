import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyle.css';
import BackendAPI from '../../BackendAPI.jsx';

var api = new BackendAPI();

function LicensePlateEnter() {
  const [licensePlate, setLicensePlate] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [carInfo, setCarInfo] = useState(null);

  const handleLicensePlateChange = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
    e.target.value = e.target.value.toUpperCase();
    setLicensePlate(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission here (e.g., send data to the server).
    // For now, let's log the values to the console.
    console.log('License Plate:', licensePlate);

   
    var userData = api.getUserInfo(licensePlate);
    var carData = api.getCarInfo(licensePlate);

    setUserInfo(userData);
    setCarInfo(carData);
    
  };

  return (
    <div className="form">
      <h2>Enter Your Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="licensePlate">License Plate Number:</label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={licensePlate}
            onChange={handleLicensePlateChange}
          />
        </div>
        <div>
          <div className="button-pair">
            <Link to="/" className="nav-button">Back</Link>
            <button type="submit" className="nav-button">Submit</button>
          </div>
          
        </div>
      </form>
    </div>
  );
}

export default LicensePlateEnter;
