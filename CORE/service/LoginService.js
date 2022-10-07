const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;

const TABLE_NAME = 't_email';

async function login(email, pass) {
    try {
        if (email && pass) {
            let db = getDb();
            let user = await db.collection(TABLE_NAME).findOne({email: email, pass: pass})
            Log.info('call "findUser"');
            return !!user;
        } else {
            return false;
        }
    } catch (error) {
        Log.error('Database error: cannot find user in "login"');
        return false;
    }
}

module.exports = {
    login
}