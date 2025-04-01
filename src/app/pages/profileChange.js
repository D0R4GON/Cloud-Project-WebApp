"use client";

import "../css/login_page.css"
import { useState } from "react";


export default function ChangeProfilePage({setLoggedUser, setBar}) {
    // needed to choose if it shows login page or register page
    const [loginBar, setLoginBar] = useState('login');
    // needed constants for user to login and other
    // add if needed
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');


    // handle login where it send credentials to the backend 
    // NOT IMPLEMENTED 
    //  - only changes the website now and saves username
    const handleSave = () => {

        // 
        // add your code to register user here
        // 

        // set logged user and change field to profile
        setBar("profile")
    };

    const handleBack = () => {
        setBar("profile")
    };




    // save string inside one of the constants...
    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    // render page for registering users
    const renderRegisterPage = () => {
        return (
            <div>
                <div className="form-group">
                    <input
                        className="half"
                        name="firstname"
                        id="name"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={handleInputChange(setFirstName)}
                    />
                    <input
                        className="half"
                        name="lastname"
                        id="surname"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={handleInputChange(setLastName)}
                    />
                </div>
                <div className="form-group">
                    <input
                        required
                        className="whole"
                        name="email"
                        id="emailId"
                        type="text"
                        placeholder="*e-mail"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                    />
                </div>
                <div className="form-group">
                    <input
                        required
                        className="whole"
                        name="login"
                        id="username"
                        type="text"
                        placeholder="*Username"
                        value={username}
                        onChange={handleInputChange(setUsername)}
                    />
                </div>
                <div className="form-group">
                    <input
                        required
                        className="whole"
                        name="password"
                        id="password"
                        type="password"
                        minLength="8"
                        placeholder="*Password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                    />
                </div>
                <div className="form-group">
                    <input className="button" type="submit" value="Save" onClick={handleSave}/>
                </div>
                <div className="form-group">
                    <input className="button" type="submit" value="Back" onClick={handleBack}/>
                </div>
            </div>
        );
    }

    return (
        <div className="login_page">
            <div className="login-card">
                {renderRegisterPage()}
            </div>
        </div>
    );
}
