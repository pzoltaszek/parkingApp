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


module.exports = {
    userHasAlreadyReservation
}