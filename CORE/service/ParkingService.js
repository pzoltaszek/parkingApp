const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;

const TABLE_NAME = 't_parking_place';

async function findParkingPlaceForTodayWithBuildingPriority(building) {
    try {
        let db = getDb();

        let today = new Date();
        today.setHours(0, 0, 0, 0);

        //no priority to check if there is any parking place available
        let anyParkingPlace = await db.collection(TABLE_NAME).findOne({
            reservationDate: {$not: {$eq: today.toLocaleDateString()}}
        });

        if (anyParkingPlace == null) {
            return null;
        }

        //perform further check with priority filtering
        //building and owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            owner_email: '',
            reservationDate: {$not: {$eq: today.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }

        //owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            owner_email: '',
            reservationDate: {$not: {$eq: today.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }

        //building priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            reservationDate: {$not: {$eq: today.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }
        ;

        return anyParkingPlace; //no priority

    } catch (error) {
        Log.error('findParkingPlaceForTodayWithBuildingPriority error: ' + error);
        return false;
    }
}


async function findNotOwnedParkingPlaceForTomorrowWithBuildingPriority(email, building) {
    try {
        let db = getDb();

        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        //no priority to check if there is any not-owned parking place available
        let anyParkingPlace = await db.collection(TABLE_NAME).findOne({
            reservationDate: {$not: {$eq: tomorrow.toLocaleDateString()}},
            owner_email: ''
        });

        if (anyParkingPlace == null) {
            return null;
        }

        //perform further check with priority filtering
        //building and owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            owner_email: '',
            reservationDate: {$not: {$eq: tomorrow.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }

        return anyParkingPlace; //no priority

    } catch (error) {
        Log.error('findNotOwnedParkingPlaceForTomorrowWithBuildingPriority error: ' + error);
        return false;
    }
}


async function findParkingPlaceForTomorrowWithBuildingPriority(building) {
    try {
        let db = getDb();

        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        //no priority to check if there is any parking place available
        let anyParkingPlace = await db.collection(TABLE_NAME).findOne({
            reservationDate: {$not: {$eq: tomorrow.toLocaleDateString()}}
        });

        if (anyParkingPlace == null) {
            return null;
        }

        //perform further check with priority filtering
        //building and owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            owner_email: '',
            reservationDate: {$not: {$eq: tomorrow.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }

        //owner priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            owner_email: '',
            reservationDate: {$not: {$eq: tomorrow.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }

        //building priority
        parkingPlace = await db.collection(TABLE_NAME).findOne({
            building: building,
            reservationDate: {$not: {$eq: tomorrow.toLocaleDateString()}}
        });

        if (parkingPlace != null) {
            return parkingPlace;
        }

        return anyParkingPlace; //no priority

    } catch (error) {
        Log.error('findParkingPlaceForTomorrowWithBuildingPriority error: ' + error);
        return false;
    }
}

async function userOwnsParkingSlot(email) {
    try {
        let db = getDb();

        let userParkingPlace = await db.collection(TABLE_NAME).findOne({
            owner_email: email
        });

        return userParkingPlace != null;

    } catch (error) {
        Log.error('userOwnsParkingSlot error: ' + error);
        return false;
    }
}

async function resetReservation(email, reservationForToday) {
    try {
        let db = getDb();

        let dateToCheck = new Date();

        if (!reservationForToday) {
            dateToCheck.setDate(dateToCheck.getDate() + 1);
        }

        const update = {
            reservedBy: '',
            reservationDate: ''
        };

        await db.collection(TABLE_NAME).updateOne({
                reservedBy: email,
                reservationDate: dateToCheck.toLocaleDateString()
            },
            {$set: update});

    } catch (error) {
        Log.error('resetReservation error: ' + error);
        return false;
    }
}

module.exports = {
    findParkingPlaceForTodayWithBuildingPriority,
    findNotOwnedParkingPlaceForTomorrowWithBuildingPriority,
    findParkingPlaceForTomorrowWithBuildingPriority,
    userOwnsParkingSlot,
    resetReservation
}