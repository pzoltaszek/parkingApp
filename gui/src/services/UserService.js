
const UserService = {
    assignUser: async (email, hashedPass, building, reservationForToday) => {
        let res = await fetch('http://localhost:3001/user/assignUser', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                hashedPass: hashedPass,
                building: building,
                reservationForToday: reservationForToday
            })
        });
        let response = await res.json();
        return response;
    },

    unassignUser: async (email, hashedPass, building, reservationForToday) => {
        let res = await fetch('http://localhost:3001/user/unassignUser', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                hashedPass: hashedPass,
                building: building,
                reservationForToday: reservationForToday
            })
        });
        let response = await res.json();
        return response;
    },

    check: async (email, reservationForToday) => {
        let res = await fetch('http://localhost:3001/user/check', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                reservationForToday: reservationForToday
            })
        });
        let response = await res.json();
        return response;
    }
}

export default UserService;
