import Welcome from "./core/Welcome";
import Drawing from "./core/Drawing";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Welcome />} />
      <Route path="/game" element={<Drawing />} />
    </Routes>
  );
}

export default App;
