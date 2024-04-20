import express from 'express';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Create an Express application
const app = express();

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start the server and listen on port 3000
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
