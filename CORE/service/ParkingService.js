const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;

const TABLE_NAME = 't_parking_place';

async function findParkingPlaceForTodayWithBuildingPriority(building) {
    try {
        let db = getDb();

        let today = new Date();
        today.setHours(0, 0, 0,0);

        //no priority to check if there is any parking place available
        let anyParkingPlace = await db.collection(TABLE_NAME).findOne({
                reservationDate: { $not:{$eq: today }}
            });

        if(anyParkingPlace == null) {
            return null;
        };

        //perform further check with priority filtering
        //building and owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            owner_email: null,
            reservationDate: { $not:{$eq: today }}
        }).toArray(function(err, result) {
            if (err) throw err;
            parkingPlaceList = result;
            //db.close(); //TODO: close?
        });

        if(parkingPlace != null) {
            return parkingPlace;
        }

        //owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            owner_email: null,
            reservationDate: { $not:{$eq: today }}
        });

        if(parkingPlace != null) {
            return parkingPlace;
        }

        //building priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            reservationDate: { $not:{$eq: today }}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        };

        return anyParkingPlace; //no priority

    } catch (error) {
        Log.error('findParkingPlaceForTodayWithBuildingPriority error: ' + error);
        return false;
    }
}


async function findNotOwnedParkingPlaceForTomorrowWithBuildingPriority(email, building) {
    try {
        let db = getDb();

        let today = Date.now();
        today.setHours(0, 0, 0,0);


        //no priority to check if there is any parking place available
        let anyParkingPlace = await db.collection(TABLE_NAME).findOne({
            reservationDate: { $not:{$eq: today }}
        });

        if(anyParkingPlace == null) {
            return null;
        };

        //perform further check with priority filtering
        //building and owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            owner_email: null,
            reservationDate: { $not:{$eq: today }}
        }).toArray(function(err, result) {
            if (err) throw err;
            parkingPlaceList = result;
            //db.close(); //TODO: close?
        });

        if(parkingPlace != null) {
            return parkingPlace;
        }

        //owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            owner_email: null,
            reservationDate: { $not:{$eq: today }}
        });

        if(parkingPlace != null) {
            return parkingPlace;
        }

        //building priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            reservationDate: { $not:{$eq: today }}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        };

        return anyParkingPlace; //no priority

    } catch (error) {
        Log.error('findNotOwnedParkingPlaceForTomorrowWithBuildingPriority error: ' + error);
        return false;
    }
}


async function findParkingPlaceForTomorrowWithBuildingPriority(email, building) {
    try {
        let db = getDb();

        let today = new Date();
        today.setHours(0, 0, 0,0);

        //no priority to check if there is any parking place available
        let anyParkingPlace = await db.collection(TABLE_NAME).findOne({
            reservationDate: { $not:{$eq: today }}
        });

        if(anyParkingPlace == null) {
            return null;
        };

        //perform further check with priority filtering
        //building and owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            owner_email: null,
            reservationDate: { $not:{$eq: today }}
        }).toArray(function(err, result) {
            if (err) throw err;
            parkingPlaceList = result;
            //db.close(); //TODO: close?
        });

        if(parkingPlace != null) {
            return parkingPlace;
        }

        //owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            owner_email: null,
            reservationDate: { $not:{$eq: today }}
        });

        if(parkingPlace != null) {
            return parkingPlace;
        }

        //building priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            reservationDate: { $not:{$eq: today }}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        };

        return anyParkingPlace; //no priority

    } catch (error) {
        Log.error('findParkingPlaceForTomorrowWithBuildingPriority error: ' + error);
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
    findParkingPlaceForTodayWithBuildingPriority,
    findNotOwnedParkingPlaceForTomorrowWithBuildingPriority,
    findParkingPlaceForTomorrowWithBuildingPriority
}