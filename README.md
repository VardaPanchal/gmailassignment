# Node.js Email API

A simple Node.js application using Express to send emails via the Gmail REST API. Handles OAuth 2.0 authentication and securely stores tokens.

## Features

- **OAuth 2.0 Authentication**:
  - `/auth/initiate`: Start OAuth flow.
  - `/auth/callback`: Handle token exchange and storage.

- **Email Sending**:
  - `/email/send`: Send emails using stored credentials.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>

2. **Install Dependencies**:
 ```bash
   npm install
```
3.**Configure Environment Variables**:

Create a .env file from .env.example and add your OAuth credentials. Ensure you include the following variables:

Test the API Endpoints:

Use Postman or a similar tool to test the following endpoints:
POST /email/send to send an email,get user details,get emails.
