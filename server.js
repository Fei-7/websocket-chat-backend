import express from 'express';

// Create an Express application
const app = express();

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
