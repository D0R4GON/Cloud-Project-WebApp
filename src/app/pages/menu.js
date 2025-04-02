"use client";

import "../css/menu.css";

export default function Menu({ bar, setBar, loggedUser}) {
    // change bar when the button is clicked
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
        <div className="MenuApp">
            <header>
                <div className="menuBar">
                    <label className="radio">
                        <button type="radio" name="radio" value="home" checked={bar === "home"} onClick={handleRadioChange} />
                        <div className="name">Home</div>
                    </label>
                    <label className="radio">
                        <button type="radio" name="radio" value="search" checked={bar === "search"} onClick={handleRadioChange} />
                        <div className="name">Items</div>
                    </label>
                    {loggedUser ? (
                        <label className="radio">
                            <button type="radio" name="radio" value="profile" checked={bar === "profile"} onClick={handleRadioChange} />
                            <div className="name">Profile</div>
                        </label>
                    ) : (
                        <label className="radio">
                            <button type="radio" name="radio" value="login" checked={bar === "login"} onClick={handleRadioChange} />
                            <div className="name">Login</div>
                        </label>
                    )}
                </div>
            </header>
        </div>
    );
}
