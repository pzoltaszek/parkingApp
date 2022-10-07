const express = require('express');
const userRouter = express.Router();
const Log = require('../utils/Log');
const getDb = require(".././dataBase/db").getDb;
const UserService  = require('../service/UserService');

const tableName = 't_email';

function router() {
    userRouter.post("/findUser", async (req, res) => {
        const {email, pass} = req.body;
        try {
            if (email && pass) {
                let db = getDb();
                let user = await db.collection(tableName).findOne({email: email, pass: pass})
                Log.info('call "findUser"');
                return res.json({success: true, data: user});
            } else {
                return res.json({success: true, data: null});
            }
        } catch (error) {
            Log.error('Database error: cannot find user in "findUser"');
            return res.json({success: false});
        }
    });

    userRouter.get("/getAllUser", (req, res) => {
        let db = getDb();
        db.collection(tableName).find({}).toArray((error, docs) => {
            if (error) {
                Log.error('Database error: cannot get all users in "getAllUser"');
                return res.json({success: false});
            } else {
                Log.info('call "getAllUser"');
                return res.json({success: true, data: docs});
            }
        });
    });


    userRouter.post("/addNewUser", async (req, res) => {
        const {login, pass} = req.body;
        let db = getDb();
        try {
            if (email && pass) {
                let user = await db.collection(tableName).findOne({email: email});
                if (user) {
                    return res.json({success: true, data: null});
                } else {
                    db.collection(tableName).insertOne({email: email, pass: pass});
                    Log.info('call "addNewUser"');
                    return res.json({success: true, email: email});
                }
            } else {
                return res.json({success: true, data: null});
            }
        } catch (error) {
            Log.error('Database error: cannot add new user in "addNewUser"');
            return res.json({success: false});
        }
    });

    userRouter.post("/assignUser", async (req, res) => {
        const {email, hashedPass, building, reservationForToday} = req.body;
        try {
            if (!await UserService.login(email, hashedPass)) {
                return res.json({success: false, data: 'LOGIN_FAILED'});
            }
            if (await UserService.userHasAlreadyReservation(email, reservationForToday)) {
                return res.json({success: false, data: 'RESERVATION_ALREADY_EXISTING'});
            }
            if (reservationForToday) {
                if ((new Date()).getHours() > 13) {
                    return {success: false, data: 'TOO_LATE_FOR_TODAY_RESERVATION'}; //nie ma sensu już tak późno rezerwować na dziś
                }
                if (await UserService.userOwnsParkingSlotAndItsAvailable(email, reservationForToday)) { //miejsce właściciela może być już zajęte
                    await UserService.assignOwnerToPlaceForToday(email);
                    return {success: true, data: 'OWNER_PLACE_ASSIGNED'};
                } else {
                    ParkingPlace
                    place = await UserService.findParkingPlaceForTodayWithBuildingPriority(email, building); //TODO: trzeba zdecydować czy priorytet ma budynek czy własność
                    if (place == null) {
                        return {success: false, data: 'NO_PLACE_AVAILABLE'};
                    } else {
                        await UserService.assignUserToPlaceForToday(email, place.id);
                        return {success: true, data: {number: place.number, building: place.building}};
                    }
                }
            } else { //rezerwacja na jutro
                if ((new Date()).getHours() < 13) {
                    return {success: false, data: 'TOO_EARLY_FOR_TOMORROW_RESERVATION'}; //za wcześnie na jakiekolwiek rezerwacje na jutro, bo w bazie są jeszcze informacje o dzisiejszych rezerwacjach
                }
                if ((new Date()).getHours() < 15) { //tylko właściciel może rezerwować przed 15:00 na jutro
                    if (await UserService.userOwnsParkingSlot(email)) {
                        await UserService.assignOwnerToPlaceForTomorrow(email);
                        return {success: true, data: 'OWNER_PLACE_ASSIGNED'};
                    } else {
                        ParkingPlace
                        place = await UserService.findNotOwnedParkingPlaceForTomorrowWithBuildingPriority(email, building); //przed 15:00 można się przypisać tylko do miejsc bez rejestracji
                        if (place == null) {
                            return {success: false, data: 'NO_NOT_OWNED_PLACE_AVAILABLE_TRY_LATER'};
                        } else {
                            await UserService.assignUserToPlaceForTomorrow(email, place.id);
                            return {success: true, data: {number: place.number, building: place.building}};
                        }
                    }
                } else {
                    if (await UserService.userOwnsParkingSlotAndItsAvailable(email, reservationForToday)) { //po 15:00 własne miejsce może już być zajęte przez kogoś innego
                        await UserService.assignOwnerToPlaceForTomorrow(email);
                        return {success: true, data: 'OWNER_PLACE_ASSIGNED'};
                    } else {
                        ParkingPlace
                        place = await UserService.findParkingPlaceForTomorrowWithBuildingPriority(email, building); //TODO: trzeba zdecydować czy priorytet ma budynek czy własność
                        if (place == null) {
                            return {success: false, data: 'NO_PLACE_AVAILABLE'};
                        } else {
                            await UserService.assignUserToPlaceForTomorrow(email, place.id);
                            return {success: true, data: {number: place.number, building: place.building}};
                        }
                    }
                }
            }
        } catch (error) { //any error (?)
            Log.error('Error ' + error);
            return res.json({success: false, data: error});
        }
    });


    userRouter.post("/unassignUser", async (req, res) => {
        const {email, hashedPass, reservationForToday} = req.body;
        try {
            if (!await UserService.login(email, hashedPass)) {
                return {success: false, data: 'LOGIN_FAILED'};
            }
            if (await UserService.userHasAlreadyReservation(email, reservationForToday)) {
                await UserService.resetReservation(email, reservationForToday); //ustaw datę na przeszłość/null, wyczyść reservedBy
                return {success: true, data: 'RESERVATION_RESET'};
            }
        } catch (error) { //any error (?)
            Log.error('Error ' + error);
            return res.json({success: false, data: error});
        }
    });

    return userRouter;
};

module.exports = router;