import { Drawing, Waiting, Welcome, WordChoose } from "./core";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/word_choose" element={<WordChoose />} />
        <Route path="/game" element={<Drawing />} />
      </Routes>
    </>
  );
}

export default App;
