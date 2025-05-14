"use client";

import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import Menu from "./pages/menu";
import ItemListPage from "./pages/itemList";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import OfferItemPage from "./pages/offerItems";
import BookingList from "./pages/offersListUser";
import UserItemListPage from "./pages/userItemList"
import UserProfilePage from "./pages/userProfile"

export default function Home() {
  const [bar, setBar] = useState("home");
  const [itemCategory, setItemCategory] = useState('');
  
  const { route, user } = useAuthenticator((context) => [context.route, context.user]);

  // Function to update bar and force re-render
  const updateBar = (newBar) => {
    setBar(newBar);
  };

  // Render correct field set by menu
  const renderField = () => {
    switch (bar) {
      case "login":
        return route === "authenticated" ? 
          <HomePage setBar={setBar} setItemCategory={setItemCategory}/> :
          <LoginPage setBar={updateBar} />;
      case "search":
        return <ItemListPage user={user} itemCategory={itemCategory} setBar={updateBar}/>;
      case "userList":
          return <UserItemListPage user={user} setBar={updateBar}/>;
      case "offer":
        return <OfferItemPage />;
      case "userOfferList":
        return <BookingList />;
      case "userProfile":
        return < UserProfilePage />
      default:
        return <HomePage setBar={setBar} setItemCategory={setItemCategory}/>;
    }
  };

  return (
    <>
    <div className="whole_page">
      <Menu bar={bar} setBar={updateBar} />
    </div>
    <div style={{marginTop:"13px", marginLeft: "130px", marginRight: "130px", marginBottom: "13px"}}>
      {renderField()}
    </div>
    <hr style={{
      border: "none",
      marginTop: "-10px",
      marginBottom: "5%",
    }} />
    </>
  );
}
