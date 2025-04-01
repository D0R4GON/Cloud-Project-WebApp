"use client";

import { useState, useEffect} from "react";
import Cookies from "js-cookie";

import Menu from "./pages/menu";
import ItemList from "./pages/items";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import UserItemListPage from "./pages/userItems";
import ChangeProfilePage from "./pages/profileChange";


export default function Home() {
  const [bar, setBar] = useState('home');
  const [loggedUser, setLoggedUser] = useState(null);

  // Check for username cookie on page load
  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setLoggedUser(user); // Set the loggedUser state from cookie
    }
  }, []);

  // render correct field set by menu
  const renderField = () => {
    switch (bar) {
      case "login":
        return <LoginPage setLoggedUser={setLoggedUser} setBar={setBar}/>;
      case "profile":
          return <ProfilePage setLoggedUser={setLoggedUser} setBar={setBar}/>;      
      case "search":
        return <ItemList/>;
      case "offer":
        return <OfferItemPage/>;
      case "userList":
        return <UserItemListPage/>
      case "profileChange":
        return <ChangeProfilePage setBar={setBar}/>
      default:
        return <HomePage/>;
    }
  };

  return (
    <div className="whole_page">
        <Menu bar={bar} setBar={setBar} loggedUser={loggedUser} setLoggedUser={setLoggedUser}/> 
        {renderField()}
    </div>
  );
}
