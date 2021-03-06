const express = require('express');

const odmService = require('./src/odm');

const app = express();
const port = 3000;

const odm = odmService();

app.use(express.json());

app.get('/getAuthors', async (req, res) => {
    try {
        const data = await odm.getAuthors();
        res.status(200).send(data);
    } catch (e) {
        console.log('Serrver error', e);
        res.status(500).json({error: e.name, message: e.message});
    }
});

app.post('/addAuthor', async (req, res) => {
    try {
        const data = await odm.addAuthor(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/addPublisher', async (req, res) => {
    try {
        const data = await odm.addPublisher(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/addSeries', async (req, res) => {
    try {
        const data = await odm.addSeries(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/removeSeries', async (req, res) => {
    try {
        const data = await odm.removeSeries(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/editSeries', async (req, res) => {
    try {
        const data = await odm.editSeries(req.body);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/getBooks', async (req, res) => {
    try {
        const data = await odm.getBooks();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(port, process.env.SERVER_HOSTNAME, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
