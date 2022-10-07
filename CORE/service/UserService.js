const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;

const TABLE_NAME = 't_parking_place';

async function userHasAlreadyReservation(email, reservationForToday) {
    try {
        if (email) {
            let db = getDb();
            let userWithReservation = await db.collection(TABLE_NAME).findOne({reservedBy: email});
            if (userWithReservation) {
                return checkUserReservationDate(userWithReservation.reservationDate, reservationForToday);
            } else {
                false;
            }
        } else {
            Log.error('no user email provided');
            return false;
        }
    } catch (error) {
        Log.error('Database error: cannot find user in "userHasAlreadyReservation"');
        return false;
    }
}

function checkUserReservationDate(dateOfReservation, reservationForToday) {
    if (!dateOfReservation) {
        return false;
    }
    let now = new Date(),
        dayNow = now.getDay(),
        monthNow = now.getMonth() + 1, //in JS: JAN = 0, FEB =1 etc.
        yearNow = now.getFullYear(),
        dayReservation = dateOfReservation.getDay(),
        monthReservation = dateOfReservation.getMonth() + 1,
        yearReservation = dateOfReservation.getFullYear();
    if (reservationForToday) {
        return dayNow === dayReservation && monthNow === monthReservation && yearNow && yearReservation;
    } else {
        dayNow += 1; //for tommorrow
        return dayNow === dayReservation && monthNow === monthReservation && yearNow && yearReservation;
    }
}

async function userOwnsParkingSlotAndItsAvailable(email, reservationForToday) {
    try {
        if (email) {
            let db = getDb();
            let dateToCheck =  reservationForToday ?  createCorrectDateFormat(true) : createCorrectDateFormat(false);
            let owner = await db.collection(TABLE_NAME).findOne({
                owner_email: email,
                reservationDate: {$not: {$eq: dateToCheck}}
            });
            if (owner) {
                return !!owner.reservedBy;
            } else {
                false;
            }
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
        Log.error('Database error: error in "assignOwnerToPlaceForToday"');
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
            db.collection(TABLE_NAME).updateOne({number: placeId}, {$set: update});
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
            db.collection(TABLE_NAME).updateOne({number: placeId}, {$set: update});
        }
    } catch (error) {
        Log.error('Database error: error in "assignUserToPlaceForToday"');
    }
}

function createCorrectDateFormat(isToday){
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isToday){
        return today
    } else {
        return today.setDate(today.getDate() +1);
    }
}

module.exports = {
    userHasAlreadyReservation,
    userOwnsParkingSlotAndItsAvailable,
    assignOwnerToPlaceForToday,
    assignOwnerToPlaceForTomorrow,
    assignUserToPlaceForToday,
    assignUserToPlaceForTomorrow
}