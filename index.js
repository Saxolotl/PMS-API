const express = require('express');
const app = express()
const port = 6969

app.get('/', (req, res) => {
    res.send(`This is the API for the Open Innovation Lab Project Management System`)
});

app.listen(port, () => console.log(`API now listening at http://localhost:${port}`));