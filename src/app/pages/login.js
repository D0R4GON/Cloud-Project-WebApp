"use client";

import "../css/login_page.css"
import { useState } from "react";
import Cookies from "js-cookie"


export default function LoginPage({setLoggedUser, setBar}) {
    // needed to choose if it shows login page or register page
    const [loginBar, setLoginBar] = useState('login');
    const [errorMessage, setErrorMessage] = useState("");
    // needed constants for user to login and other
    // add if needed
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [token, setToken] = useState('');


    // handle login where it send credentials to the backend
    // NOT IMPLEMENTED 
    //  - only changes the website now and saves username
    const handleLogin = () => {
        if (!username || !password) {
            setErrorMessage("Please enter both your username and password")
            return;
        }

        // 
        // add your code to login user here and if login is successful then continue else return
        // 
        setToken("Random token change for real one") 

        // save username and token as cookies and log in user
        Cookies.set('username', username);
        Cookies.set('token', token, { expires: 7 });

        setLoggedUser(username);
        // change field to profile
        setBar("profile")
    };

    // handle login where it send credentials to the backend 
    // NOT IMPLEMENTED 
    //  - only changes the website now and saves username
    const handleRegister = () => {
        if (!username || !password || !email) {
            setErrorMessage("All fields marked with * are required")
            return;
        }

        // 
        // add your code to register user here and if registration is successful the continue else return
        // 

        // login user after registration
        handleLogin();
    };

    // change rendering login/register to register/login
    const handlePageChange = () => {
        setLoginBar(loginBar === 'login' ? 'register' : 'login');
        setErrorMessage("")
    };

    // save string inside one of the constants...
    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    // render page for logging users
    const renderLoginPage = () => {
        return (
            <div>
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
                        placeholder="*Password"
                        minLength="8"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                    />
                </div>
                <div className="form-group">
                    <input className="button" type="submit" value="Login" onClick={handleLogin}/>
                </div>
            </div>
        );
    }

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
                    <input className="button" type="submit" value="Register" onClick={handleRegister}/>
                </div>
            </div>
        );
    }

    return (
        <div className="login_page">
            <div className="login-card">

                {loginBar === 'login' ? renderLoginPage() : renderRegisterPage()}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {/* Button for switching between login and register */}
                <div className="form-group">
                    <input
                        className="button"
                        type="button"
                        value={loginBar === 'login' ? 'Register' : 'Login'}
                        onClick={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}
