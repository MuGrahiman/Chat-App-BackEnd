# Chat App Backend Server

## Description
The Chat App Backend Server is a backend service for a real-time chat application built using Socket.IO. This server handles user authentication, user data storage, and token management. Messages are stored in the users' local storage for improved performance and user experience. The backend server provides a secure and efficient communication platform for users to engage in real-time conversations.

## Installation
To install and run the Chat App Backend Server, follow these steps:
1. Clone the repository from [https://github.com/MuGrahiman/Chat-App-BackEnd].
2. Install the required dependencies using `npm install`.
3. Configure the environment variables for database connection, security keys, and other settings.
4. Start the server using `npm start`.

## Usage
To use the Chat App Backend Server, follow these guidelines:
1. Connect to the server using the provided endpoint.
2. Authenticate users and generate access tokens for secure communication.
3. Store user data and manage tokens for user sessions.
4. Implement real-time messaging features using Socket.IO for seamless communication between users.

## API Documentation
The Chat App Backend Server provides an API for user authentication, token management, and message storage. The user schema defines the structure of user data stored in the database.

## User Schema
- **id**: Unique identifier for the user ***this is an auto generated id from frontend***.

## Configuration
The server configuration can be customized by modifying the environment variables in the `.env` file. The following environment variables need to be configured:
- **JWT_SECRET**: Secret key for generating and verifying JSON Web Tokens (JWT) for user authentication.
- **CONNECTION_URL**: URL for connecting to the MongoDB database.
- **PORT**: Port number on which the server run