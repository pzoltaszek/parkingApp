const express = require('express');
const userRouter = express.Router();
const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;

const tableName = 't_email';

function router() {
    userRouter.post("/findUser", async(req, res) => {
        const {email , pass} = req.body;
        try {
            if (email && pass) {
                let db = getDb();
                let user = await db.collection(tableName).findOne({ email: email, pass: pass })
                Log.info('call "findUser"');
                return res.json({ success: true, data: user });
            } else {
                return res.json({ success: true, data: null });
            }
        } catch (error) {
            Log.error('Database error: cannot find user in "findUser"');
            return res.json({ success: false });
        }
    });

    userRouter.get("/getAllUser", (req, res) => {
        let db = getDb();
        db.collection(tableName).find({}).toArray((error, docs) => {
            if (error) {
                Log.error('Database error: cannot get all users in "getAllUser"');
                return res.json({ success: false });
            } else {
                Log.info('call "getAllUser"');
                return res.json({ success: true, data: docs });
            }
        });
    });


    userRouter.post("/addNewUser", async(req, res) => {
        const { login, pass } = req.body;
        let db = getDb();
        try {
            if (email && pass) {
                let user = await db.collection(tableName).findOne({ email: email });
                if (user) {
                    return res.json({ success: true, data: null });
                } else {
                    db.collection(tableName).insertOne({ email: email, pass: pass });
                    Log.info('call "addNewUser"');
                    return res.json({ success: true, email: email });
                }
            } else {
                return res.json({ success: true, data: null });
            }
        } catch (error) {
            Log.error('Database error: cannot add new user in "addNewUser"');
            return res.json({ success: false });
        }
    });
    return userRouter;
};

module.exports = router;