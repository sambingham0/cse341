const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const nameController = require('./controllers/nameController');

app.get('/', nameController.getName);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
