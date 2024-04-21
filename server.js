const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
//require('dotenv').config();

const PORT=3000;
const DB_CONN='mongodb+srv://cdognovak:beepBoop@cluster0.qwtoxef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(DB_CONN)
    .then(client => {
        console.log('connected To Database');
        const db = client.db('superhero-db');
        const superheroCollection = db.collection('superheroes');

        app.set('view engine', 'ejs');

        // app.use(bodyParser.urlencoded({ exteded: true }));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));
        // app.use(bodyParser.json());
        app.use(express.json());

        app.get('/', (req, res) => {
            console.log('getting');
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
            console.log('trying to delete');
            console.log(req.body);
            superheroCollection.deleteOne(
                { superheroName: req.body.superheroName }
            )
            .then(result => {
                res.json(`Deleted ${req.body.superheroName}.`);
            })
            .catch(error => console.error(error));
        });

        app.listen(PORT, () => {
            console.log(`Listening on ${PORT}`);
        });
    })
    .catch(error => {
        console.error(error);
    });
