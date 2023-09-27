import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyle.css';



function NewUser() {
  const [licensePlate, setLicensePlate] = useState('');
  const [name, setName] = useState('');

  const handleLicensePlateChange = (e) => {
    setLicensePlate(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission here (e.g., send data to the server).
    // For now, let's log the values to the console.
    console.log('License Plate:', licensePlate);
    console.log('Name:', name);
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
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

export default NewUser;
