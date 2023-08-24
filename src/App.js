import Header from "./Components/HeaderComponent/Header";
import Home from "./Components/HomeComponent/Home";
import Users from "./UsersComponent/Users";
import Bookmarks from "./Components/Bookmarks/Book_Marks";
import IsOnline from "./Components/IonlineComponent/IsOnline";
import { BrowserRouter, Routes, Route } from "react-router-dom";



import { useState } from "react";

function App() {
  let [isOnlineNow, updateIsOnlineOrNot] = useState([true, false]);
  return <BrowserRouter>
    <Header />
    <IsOnline obj={{ isOnlineNow, updateIsOnlineOrNot }} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users isOnlineNow={isOnlineNow} />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
    </Routes>
  </BrowserRouter>

}
export default App;