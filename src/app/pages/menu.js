"use client";

import "../css/menu.css";
import ProfileDropdown from "./profile";

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
            <div className="name">PrenájomVecí(Logo)</div>
            </label>
        </div>
            <div className="menuBar">
                <ProfileDropdown setBar={setBar} />
            </div>
        </header>
    );
}

