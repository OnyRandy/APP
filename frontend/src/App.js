import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />          
        <Route path="/Dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
