
const ExampleService = {
    getExampleData: async() => {
        let res = await fetch('http://localhost:3001/example/getData');
        let data = await res.json();
        if (data.success !== true) {
            return "";
        } else {
            return data.data;
        }
    }
}

export default ExampleService;