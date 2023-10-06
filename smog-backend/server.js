const express = require('express');
const app = express();
const port = process.env.Port || 4000;


// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    next();
  });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user', (req, res) => {
    console.log('Uhhhh');
    j = {name: 'Joe', 'email': 'joe@gmail.com'};
    console.log(j);
    res.json(j);
})

app.get('/car', (req, res) => {
    j = {model: 'Toyota', 'Year': '1999'};
    res.json(j);
})

app.listen(port, () => {
    console.log('Server is running on port '+ port);
})