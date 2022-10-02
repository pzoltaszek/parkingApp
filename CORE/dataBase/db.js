const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({ path: `${__dirname}/config/dev.env` });
const Log = require('../utils/Log');

const DB_URI = "mongodb+srv://".concat(process.env.DB_USER, ':', process.env.DB_PASS, '@cluster0.m6oic0h.mongodb.net/?retryWrites=true&w=majority');

let db;

const initDb = (callback) => {
    if (db) {
        Log.error('Already connected to DB!');
        return callback(null, db);
    }

    const client = new MongoClient(DB_URI, { useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            Log.error('Database connection failed');
            return callback(err);
        } else {
            db = client.db(process.env.DB_NAME);
            Log.info('Database connected');
            return callback(null, db);
        }
    });
};

const getDb = () => {
    return db;
}


module.exports = {
    getDb,
    initDb
}