const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

const {dbUrl, mongoOptions} = require('../config')

const auth = require('../src/routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(dbUrl, mongoOptions, () => {
  app.use('/auth', auth)

  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`app started on ${PORT}`)
  });
})

