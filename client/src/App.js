import Welcome from "./core/Welcome";
import Waiting from "./core/Waiting";
import { Route, Routes } from "react-router-dom";
import Drawing from "./core/Drawing";
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Welcome />} />
      <Route path="/waiting" element={<Waiting />} />
      <Route path="/game" element={<Drawing />} />
    </Routes>
  );
}

export default App;
