
const ExampleService = {
    getExampleData: async() => {
        let res = await fetch('http://localhost:3001/user/getAllUser');
        let data = await res.json();
        if (data.success !== true) {
            return "";
        } else {
            return data.data;
        }
    }
}

export default ExampleService;