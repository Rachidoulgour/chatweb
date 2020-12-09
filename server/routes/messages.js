const express = require('express');
const messageController = require('../controllers/messages');

const api = express.Router();
const authentication = require('../middleware/autenticated');


api.post('/chat-messages/:senderId/:receiverId', authentication.ensureAuth, messageController.sendMessage);
api.get('/my-messages/:page?', authentication.ensureAuth, messageController.getReceivedMessages);
api.get('/my-messages/:id/:page?', authentication.ensureAuth, messageController.getMessagesByEmitter);
api.get('/messages/:page?', authentication.ensureAuth, messageController.getEmmitedMessages);
api.get('/message-unread', authentication.ensureAuth, messageController.getViewedMessages);
api.get('/modify-unread-messages', authentication.ensureAuth, messageController.setViewedMessage);

module.exports = api;