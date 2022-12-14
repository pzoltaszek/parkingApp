const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;

const TABLE_NAME = 't_parking_place';

async function userHasAlreadyReservation(email, reservationForToday) {
    try {
        if (email) {
            let db = getDb();
            let dateToCheck = createCorrectDateFormat(reservationForToday);
            let userWithReservation = await db.collection(TABLE_NAME).findOne({reservedBy: email, reservationDate: dateToCheck });
            return !!userWithReservation;
        } else {
            Log.error('no user email provided');
            return false;
        }
    } catch (error) {
        Log.error('Database error: cannot find user in "userHasAlreadyReservation"');
        return false;
    }
}

async function userOwnsParkingSlotAndItsAvailable(email, reservationForToday) {
    try {
        if (email) {
            let db = getDb();
            let dateToCheck =  reservationForToday ?  createCorrectDateFormat(true) : createCorrectDateFormat(false);

            let ownPlace = await db.collection(TABLE_NAME).findOne({
                owner_email: email,
                reservationDate: {$not: {$eq: dateToCheck}}
            });
            return ownPlace != null;
        } else {
            Log.error('no user email provided');
            return false;
        }
    } catch (error) {
        Log.error('Database error: error in "userOwnsParkingSlotAndItsAvailable"');
        return false;
    }
}

async function assignOwnerToPlaceForToday(email) {
    try {
        if (email) {
            let db = getDb();
            let today = createCorrectDateFormat(true);
            const update = {
                reservedBy: email,
                reservationDate: today
            };
            db.collection(TABLE_NAME).updateOne({owner_email: email}, {$set: update});
        }
    } catch (error) {
        Log.error('Database error: error in "assignOwnerToPlaceForToday"');
    }
}

async function assignOwnerToPlaceForTomorrow(email) {
    try {
        if (email) {
            let db = getDb();
            let today = createCorrectDateFormat(false);
            const update = {
                reservedBy: email,
                reservationDate: today
            };
            db.collection(TABLE_NAME).updateOne({owner_email: email}, {$set: update});
        }
    } catch (error) {
        Log.error('Database error: error in "assignOwnerToPlaceForTomorrow"');
    }
}

async function assignUserToPlaceForToday(email, placeId) {
    try {
        if (email) {
            let db = getDb();
            let today = createCorrectDateFormat(true);
            const update = {
                reservedBy: email,
                reservationDate: today
            };
            db.collection(TABLE_NAME).updateOne({_id: placeId}, {$set: update});
        }
    } catch (error) {
        Log.error('Database error: error in "assignUserToPlaceForToday"');
    }
}

async function assignUserToPlaceForTomorrow(email, placeId) {
    try {
        if (email) {
            let db = getDb();
            let tomorrow = createCorrectDateFormat(false);
            const update = {
                reservedBy: email,
                reservationDate: tomorrow
            };
            db.collection(TABLE_NAME).updateOne({_id: placeId}, {$set: update});
        }
    } catch (error) {
        Log.error('Database error: error in "assignUserToPlaceForTomorrow"');
    }
}

async function checkPlace(email, reservationForToday) {
    try {
        if (email) {
            let db = getDb();
            let dateToCheck = createCorrectDateFormat(reservationForToday);
            let userWithReservation = await db.collection(TABLE_NAME).findOne({reservedBy: email, reservationDate: dateToCheck });
            return userWithReservation;
        } else {
            return;
        }
    } catch (error) {
        Log.error('Database error: error in "checkPlace"');
    }
}

function createCorrectDateFormat(isToday){
    let today = new Date();
    if (isToday){
        return today.toLocaleDateString();
    } else {
        today.setDate(today.getDate() +1);
        return today.toLocaleDateString();
    }
}

module.exports = {
    userHasAlreadyReservation,
    userOwnsParkingSlotAndItsAvailable,
    assignOwnerToPlaceForToday,
    assignOwnerToPlaceForTomorrow,
    assignUserToPlaceForToday,
    assignUserToPlaceForTomorrow,
    checkPlace
}