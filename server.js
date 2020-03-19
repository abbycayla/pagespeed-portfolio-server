const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//models
require('./models/Projects');
require('./models/User');

//routes
app.use(require('./routes'));

//connect to DB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('open', function(){
    console.log('MongoDB connected');
});

const server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
});