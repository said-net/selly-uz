process.env.NODE_ENV !== 'production' && require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const file = require('express-fileupload');
const { APP_PORT, MONGO_URI } = require('./src/configs/env.config');
const router = require('./src/router');
mongoose.connect(MONGO_URI);
app.use(cors());
app.use(file());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', router);
app.listen(APP_PORT);
try {
    require('./src/bot/bot').launch()
} catch { }