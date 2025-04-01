"use client";

import "../css/login_page.css"
import Cookies from "js-cookie"

export default function ProfilePage({setLoggedUser, setBar}) {

    // logout user
    const handleLogout = () => {
        // remove cookies
        Cookies.remove('username');
        Cookies.remove('token');
        // remove logged user
        setLoggedUser(null);
        // change bar to home
        setBar("home");
    };

    // change field to correct one
    const handleBarChange = (event) => {
        setBar(event.target.placeholder)
    };

    return (
        <div className="login_page">
            <div className="login-card">
                <div className="form-group">
                    <input className="button" type="submit" value="Change profile" placeholder="profileChange" onClick={handleBarChange}/>
                </div>
                <div className="form-group">
                    <input className="button" type="submit" value="My items" placeholder="userList" onClick={handleBarChange}/>
                </div>
                <div className="form-group">
                    <input className="button" type="submit" value="Logout" onClick={handleLogout}/>
                </div>
            </div>  
        </div>
    );
}