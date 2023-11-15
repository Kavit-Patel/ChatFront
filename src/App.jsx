import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Chat from "./pages/Chat";
import { useContext } from "react";
import { MyContext } from "./components/Context";

const App = () => {
  const { localUser } = useContext(MyContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={localUser ? <Chat /> : <Signup />} />
        <Route path="/sign-up" element={localUser ? <Chat /> : <Signup />} />
        <Route path="/sign-in" element={localUser ? <Chat /> : <Signin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
