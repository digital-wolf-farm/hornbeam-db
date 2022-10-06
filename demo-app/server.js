const express = require('express');

const odmService = require('./src/odm');

const app = express();
const port = 3000;

const odm = odmService();

app.use(express.json());

app.get('/get-books', async (req, res) => {
    try {
        const data = await odm.getBooks();
        res.status(200).send(data);
    } catch (e) {
        console.log('Server error', e);
        res.status(500).json({ error: e.name, action: e.action, message: e.message });
    }
});

app.post('/add-book', async (req, res) => {
    try {
        const data = await odm.addBook(req.body);
        res.status(200).send({ id: data });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/add-books', async (req, res) => {
    try {
        const data = await odm.addBooks(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.put('/edit-book', async (req, res) => {
    try {
        const data = await odm.editBook(req.body);
        res.status(200).send({ id: data });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/remove-book', async (req, res) => {
    try {
        const data = await odm.removeBook(req.body.id);
        res.status(200).send({ id: data });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/remove-books', async (req, res) => {
    try {
        const data = await odm.removeBooks(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(port, process.env.SERVER_HOSTNAME, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
