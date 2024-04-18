const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.DB_CONN, { useUnfifiedTopology: true })
    .then(client => {
        console.log('connected To Database');
        const db = client.db('superhero-db');
        const superheroCollection = db.collection('superheroes');

        app.set('view engine', 'ejs');

        app.use(bodyParser.urlencoded({ exteded: true }));
        app.use(express.static('public'));
        app.use(bodyParser.json());

        app.get('/', (req, res) => {
            const cursor = superheroCollection.find().toArray()
            .then(results => {
                console.log(results);
                res.render('index.ejs', { superheroes: results });
            })
            .catch(error => console.error(error));
        });

        app.post('/superheroes', (req, res) => {
            superheroCollection.insertOne(req.body)
            .then(result => {
                console.log(result);
                res.redirect('/');
            })
            .catch(error => console.error(error));
        });

        app.delete('/superheroes', (req, res) => {
            superheroCollection.deleteOne(
                { superheroName: req.body.superheroName }
            )
            .then(result => {
                res.json(`Deleted ${req.body.superheroName}.`);
            })
            .catch(error => console.error(error));
        });

        app.listen(process.env.PORT, () => {
            console.log(`Listening on ${process.env.PORT}`);
        });
    })
    .catch(error => {
        console.error(error);
    });
