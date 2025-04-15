"use client";

import "../css/menu.css";

export default function Menu({ bar, setBar}) {

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
        <header className="UserHeader">
            <div className="menuBar">
                <label className="radio">
                    <button type="radio" name="radio" value="home" checked={bar === "home"} onClick={handleRadioChange} />
                    <div className="name">PrenájomVecí(Logo)</div>
                </label>         
            </div>
            <div className="menuBar">
                <label className="radio">
                    <button type="radio" name="radio" value="profile" checked={bar === "profile"} onClick={handleRadioChange} />
                    <div className="name">
                        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" width="30" height="30">
                            <title>Profil</title>
                            <path d="M61.44,0A61.31,61.31,0,0,1,84.92,4.66h0A61.66,61.66,0,0,1,118.21,38l.1.24a61.39,61.39,0,0,1-.1,46.73h0A61.42,61.42,0,0,1,38,118.21h0A61.3,61.3,0,0,1,18,104.88l0,0A61.5,61.5,0,0,1,4.66,84.94l-.09-.24A61.48,61.48,0,0,1,4.66,38v0A61.37,61.37,0,0,1,18,18l0,0A61.5,61.5,0,0,1,37.94,4.66l.24-.09A61.35,61.35,0,0,1,61.44,0ZM48.78,79.89a16.44,16.44,0,0,1-1.34-1.62c-2.6-3.56-4.93-7.58-7.27-11.33-1.7-2.5-2.59-4.73-2.59-6.52s1-4.13,3-4.64a101,101,0,0,1-.18-11.73A16.86,16.86,0,0,1,41,41.11a17,17,0,0,1,7.58-9.64,19.26,19.26,0,0,1,4.11-2c2.59-1,1.34-4.91,4.19-5C63.54,24.33,74.52,30,78.8,34.68a16.91,16.91,0,0,1,4.38,11l-.27,10.57a3.31,3.31,0,0,1,2.41,2.41c.36,1.43,0,3.39-1.25,6.16h0c0,.09-.09.09-.09.18-2.75,4.53-5.62,9.78-8.78,14-1.59,2.12-2.9,1.75-1.54,3.78,6.45,8.87,19.18,7.64,27,13.55a52.66,52.66,0,0,0,9.36-54.72l-.09-.2A52.7,52.7,0,0,0,98.55,24.33h0a52.63,52.63,0,0,0-57-11.49l-.21.09a52.53,52.53,0,0,0-17,11.4h0a52.63,52.63,0,0,0-11.49,57l.09.21A52.66,52.66,0,0,0,22.19,96.3c7.85-5.91,20.58-4.68,27-13.55,1.12-1.68.83-1.52-.44-2.86Z"/>
                        </svg>
                    </div>
                </label>
            </div>
        </header>
    );
}