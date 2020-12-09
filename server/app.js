const express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// const cloudinary = require('cloudinary').v2
require('dotenv').config();




const app = express();
const user_routes = require('./routes/users')
const message_routes = require('./routes/messages')

//settings
app.set('port', process.env.PORT || 4000);

//CORS
app.use(express.json());
app.use(cors());

//routes
//app.use('/', express.static('dist/frontend', {redirect:false}));
app.use('/api', user_routes);
// app.use('/api', follow_routes);
// app.use('/api', publication_routes);
app.use('/api', message_routes);

// app.get('*', function(req, res, next){
// 	res.sendFile(path.resolve('index.html'))
// })
app.use('/uploads', express.static(path.resolve('uploads')));



module.exports = app;