const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const base64url = require('base64url');
require('dotenv').config();

const TOKEN_PATH = path.join(__dirname, 'token.json');

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

async function getOAuth2Client() {
    if (!fs.existsSync(TOKEN_PATH)) {
        throw new Error('Token file does not exist. Please authenticate first.');
    }
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function refreshTokenIfNeeded(oAuth2Client) {
    const tokens = oAuth2Client.credentials;
    if (tokens.expiry_date && tokens.expiry_date <= Date.now()) {
        const { credentials } = await oAuth2Client.refreshAccessToken();
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
        oAuth2Client.setCredentials(credentials);
    }
}

async function initiateOAuth(req, res) {
    try {
        console.log(process.env);
        console.log(oAuth2Client);
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly']
        });
        
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error initiating OAuth:', error.message);
        res.status(500).send('Failed to initiate OAuth');
    }
}

async function handleOAuthCallback(req, res) {
    console.log('Callback route hit with query:', req.query);
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Missing authorization code.');
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        res.send('Authentication successful. You can now use the API.');
    } catch (error) {
        console.error('Error during OAuth callback:', error.message);
        res.status(500).send('Authentication failed.');
    }
}

async function sendMail(req, res) {
    try {
        const oAuth2Client = await getOAuth2Client();
        await refreshTokenIfNeeded(oAuth2Client);

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const { to, subject, text } = req.body;

        if (!to) {
            return res.status(400).send('Recipient email address is required.');
        }

        const rawMessage = [
            `To: ${to}`,
            `Subject: ${subject || 'No Subject'}`,
            '',
            text || 'No Content'
        ].join('\n');

        const encodedMessage = base64url(rawMessage);

        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });

        res.json(result.data);
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).send('Failed to send email');
    }
}

async function getUser(req, res) {
    try {
        const oAuth2Client = await getOAuth2Client();
        await refreshTokenIfNeeded(oAuth2Client);

        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(url, config);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).send('Failed to fetch user profile');
    }
}

async function getMails(req, res) {
    try {
        const oAuth2Client = await getOAuth2Client();
        await refreshTokenIfNeeded(oAuth2Client);

        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(url, config);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching mails:', error.message);
        res.status(500).send('Failed to fetch mails');
    }
}

async function readMail(req, res) {
    try {
        const oAuth2Client = await getOAuth2Client();
        await refreshTokenIfNeeded(oAuth2Client);

        const { email, messageId } = req.params;
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(url, config);
        res.json(response.data);
    } catch (error) {
        console.error('Error reading mail:', error.message);
        res.status(500).send('Failed to read mail');
    }
}

module.exports = {
    initiateOAuth,
    handleOAuthCallback,
    getUser,
    getMails,
    readMail,
    sendMail
};
