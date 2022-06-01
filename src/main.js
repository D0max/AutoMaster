const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

const {dbUrl, mongoOptions} = require('../config')

const auth = require('../src/routes/auth');
const personal = require('../src/routes/personal');

const app = express();
app.use(cors({
  origin: "*",
}));
app.use(express.json());

mongoose.connect(dbUrl, mongoOptions, () => {
  app.use('/auth', auth)
  app.use('/personal', personal)

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`app started on ${PORT}`)
  });
})

