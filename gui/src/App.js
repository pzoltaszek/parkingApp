import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import ReservationForm from "./components/ReservationForm";
import CheckComponent from './components/CheckComponent';

function App() {
  return (
    <div className="App">
      <ReservationForm />
      <CheckComponent/>
    </div>
  );
}

export default App;
