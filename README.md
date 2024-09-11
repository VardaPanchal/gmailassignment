# Node.js Email API

A simple Node.js application using Express to send emails via the Gmail REST API. Handles OAuth 2.0 authentication and securely stores tokens.

## Features

- **OAuth 2.0 Authentication**:
  - `api/auth/initiate`: Start OAuth flow.
  - `api/auth/callback`: Handle token exchange and storage.

- **Email Sending**:
  - `api/mail/send`: Send emails using stored credentials.
  - `api/mail/user/:email`: To get user details.
  - `api//mail/list/:email`: To list all mails.
  - `api//mail/read/:email/:messageId`: To read specific mail get Id from above command.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>

2. **Install Dependencies**:
 ```bash
   npm i
```
3.**Configure Environment Variables**:

Create a .env file from .env.example and add your OAuth credentials. Ensure you include the following variables:

Test the API Endpoints:
 ```bash
   Run  node app.js
```

Use Postman or a similar tool to test the following endpoints:
POST /email/send to send an email,get user details,get emails.
