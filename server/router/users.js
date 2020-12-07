const express = require('express');
const multipart = require('connect-multiparty');
const UserController = require('../controllers/users');

const api = express.Router();
const authentication = require('../middleware/autenticated')
const upload = multipart({uploadDir: './uploads/users'});


api.post('/signup', UserController.saveUser);
api.get('/activation/:jwt', UserController.activation);
api.post('/login', UserController.login);
api.get('/user/:id', authentication.ensureAuth ,UserController.getUser);
api.get('/users/:page?', authentication.ensureAuth ,UserController.getUsers);
api.get('/counters/:id?', authentication.ensureAuth ,UserController.getCounters);
api.put('/update-user/:id', authentication.ensureAuth ,UserController.updateUser);
api.post('/update-avatar/:id', [authentication.ensureAuth, upload] ,UserController.uploadAvatar);
api.get('/avatar/avatarFile', authentication.ensureAuth, UserController.getAvatarFile);



module.exports = api;