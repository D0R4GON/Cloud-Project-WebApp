"use client";

import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import Menu from "./pages/menu";
import ItemListPage from "./pages/itemList";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import ChangeProfilePage from "./pages/profileChange";
import OfferItemPage from "./pages/offerItems";

export default function Home() {
  const [bar, setBar] = useState("home");
  const [itemCategory, setItemCategory] = useState('');
  
  const { route } = useAuthenticator((context) => [context.route]);

  // Function to update bar and force re-render
  const updateBar = (newBar) => {
    setBar(newBar);
  };

  // Render correct field set by menu
  const renderField = () => {
    switch (bar) {
      case "profile":
        return route === "authenticated" ? 
          <ProfilePage setBar={updateBar} /> : 
          <LoginPage setBar={updateBar} />;
      case "search":
        return <ItemListPage itemCategory={itemCategory}/>;
      case "userList":
          return <ItemListPage />;      
      case "offer":
        return <OfferItemPage />;
      case "profileChange":
        return <ChangeProfilePage setBar={updateBar} />;
      default:
        return <HomePage setBar={setBar} setItemCategory={setItemCategory}/>;
    }
  };

  return (
    <div className="whole_page">
      <Menu bar={bar} setBar={updateBar} />
      {renderField()}
    </div>
  );
}
