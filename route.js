const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

// Define routes
router.get('/auth/initiate', controllers.initiateOAuth);
router.get('/auth/callback', controllers.handleOAuthCallback);
router.post('/mail/send', controllers.sendMail);
router.get('/mail/user/:email', controllers.getUser);
router.get('/mail/list/:email', controllers.getMails);
router.get('/mail/read/:email/:messageId', controllers.readMail);

module.exports = router;
