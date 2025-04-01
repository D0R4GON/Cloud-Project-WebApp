"use client";

import "../css/menu.css";

export default function Menu({ bar, setBar, loggedUser}) {
    const handleRadioChange = (event) => {
        setBar(event.target.value);
    };

    return (
        <div className="MenuApp">
            <header>
                <div className="menuBar">
                    <label className="radio">
                        <input type="radio" name="radio" value="home" checked={bar === 'home'} onChange={handleRadioChange} />
                        <div className="name">Home</div>
                    </label>
                    <label className="radio">
                        <input type="radio" name="radio" value="search" checked={bar === 'search'} onChange={handleRadioChange} />
                        <div className="name">Items</div>
                    </label>
                    {loggedUser ? (
                        <label className="radio">
                            <input type="radio" name="radio" value="profile" checked={bar === 'profile'} onChange={handleRadioChange} />
                            <div className="name">Profile</div>
                        </label>
                    ) : (
                        <label className="radio">
                            <input type="radio" name="radio" value="login" checked={bar === 'login'} onChange={handleRadioChange} />
                            <div className="name">Login</div>
                        </label>
                    )}
                </div>
            </header>
        </div>
    );
}
