"use client";

import "../css/menu.css";
import ProfileDropdown from "./profile";
import { ShopLogo } from "../data/svgIcons";

export default function Menu({ bar, setBar }) {

    const handleRadioChange = (event) => {
        const newValue = event.target.value;
        if (bar === newValue) {
            setBar("");
            setTimeout(() => setBar(newValue), 0);
        } else {
            setBar(newValue);
        }
    };

    return (
        <header className="UserHeader">
        <div className="menuBar">
            <label className="radio">
            <button type="radio" name="radio" value="home" checked={bar === "home"} onClick={handleRadioChange} />
            <div className="name">
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ transform: "translateY(20%)" }}>
                    <ShopLogo />
                </div>
                <span style={{ marginLeft: "1rem", fontSize: "1.5rem", fontFamily: "sans-serif" }}>
                    ExchangeShop
                </span>
                </div>
            </div>
            </label>
        </div>
            <div className="menuBar">
                <ProfileDropdown setBar={setBar} />
            </div>
        </header>
    );
}

