"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import Menu from "./pages/menu";
import { ItemListPage, UserItemsPage } from "./pages/itemList";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import ChangeProfilePage from "./pages/profileChange";
import OfferItemPage from "./pages/offerItems";

export default function Home() {
  const [bar, setBar] = useState("home");
  const [loggedUser, setLoggedUser] = useState(null);

  // Check for username cookie on page load
  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setLoggedUser(user);
    }
  }, []);

  // Function to update bar and force re-render
  const updateBar = (newBar) => {
    setBar(newBar);
  };

  // Render correct field set by menu
  const renderField = () => {
    switch (bar) {
      case "login":
        return <LoginPage setLoggedUser={setLoggedUser} setBar={updateBar} />;
      case "profile":
        return <ProfilePage setLoggedUser={setLoggedUser} setBar={updateBar} />;
      case "search":
        return <ItemListPage/>;
      case "userList":
          return <ItemListPage user={loggedUser}/>;      
      case "offer":
        return <OfferItemPage />;
      case "profileChange":
        return <ChangeProfilePage setBar={updateBar} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="whole_page">
      <Menu bar={bar} setBar={updateBar} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      {renderField()}
    </div>
  );
}
