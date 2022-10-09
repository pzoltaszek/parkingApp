import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleForm from "./components/SimpleForm";

function App() {
  const inputsReservation = [{
    label: "Email address", type: "email", placeholder: "Enter email"
  },
  { label: "Password", type: "password", placeholder: "Password" }
  ]
  const inputsCheck = [{
    label: "Email address", type: "email", placeholder: "Enter email"
  }
  ]
  return (
    <div className="App">
      <SimpleForm componentType="reservation" title="Parking spot reservation" inputs={inputsReservation} buildingDropdown />
      <SimpleForm componentType="check" title="Check your reservation" inputs={inputsCheck} />
    </div>
  );
}

export default App;
