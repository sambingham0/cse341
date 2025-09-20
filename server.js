const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the CSE341 assignment!');
});

app.get('/name', (req, res) => {
  res.send('Sam Bingham'); // Replace with the name of someone you know
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
