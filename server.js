const express = require('express');
const path = require('path');
const uuid = require('uuid/v1');
const fs = require('fs');

const dbData = require('./db/db.json');

const app = express();
const PORT = 3009;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const writeToFile = (destination, content) => 
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : fs.readFile(destination, (err, data) => {
            if (err) throw (err);
        })
    );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// HTML Routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// API Routes

app.get('/api/notes', (req, res) => {
    res.json(dbData);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
