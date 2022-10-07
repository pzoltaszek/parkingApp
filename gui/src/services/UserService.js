
const UserService = {
    getExampleData: async () => {
        let res = await fetch('http://localhost:3001/user/getAllUser');
        let data = await res.json();
        if (data.success !== true) {
            return "";
        } else {
            return data.data;
        }
    },

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
    }
}

export default UserService;
